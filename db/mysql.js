var mysql = require('mysql'),
    config = require('../config'),
    Torrent = require('../model/Torrent'),
    Segment = require('segment');

var pool = mysql.createPool({
    host: config.mysqlHost,
    user: config.mysqlUser,
    password: config.mysqlPassword,
    database: config.mysqlDatabase,
    port: config.mysqlPort
});

// 创建实例
var segment = new Segment();
// 使用默认的识别模块及字典，载入字典文件需要1秒，仅初始化时执行一次即可
segment.useDefault();

var query = function (sql, sqlParam, callback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            callback(err, null, null);
        } else {
            conn.query(sql, sqlParam, function (err, rows, fields) {
                //释放连接
                conn.release();
                //事件驱动回调
                callback(err, rows, fields);
            });
        }
    });
};

exports.queryByPage = function queryByPage(keyword, page, pageCount, callback) {
    var start = (page - 1) * pageCount;
    pageCount = Number(pageCount);
    var _fenci = segment.doSegment(keyword, {
        simple: true,
        stripPunctuation: true
    });
    var sqlIndex = "SELECT id,name,type,size,files,hot,create_date,magnet FROM t_torrent WHERE MATCH (name_separate) AGAINST (? IN BOOLEAN MODE) limit ?,?";

    var sqlParam = new Array();
    if (_fenci.length > 0) {
        sqlParam.push("+" + _fenci.join("+"));
        sqlParam.push(start);
        sqlParam.push(pageCount);
    } else {
        sqlParam.push("+" + keyword);
        sqlParam.push(start);
        sqlParam.push(pageCount);
    }
    console.log(sqlIndex);
    console.log(sqlParam);
    query(sqlIndex, sqlParam, function (err, rows) {
        if (err) {
            return console.error(err);
        }
        if (rows.length > 0) {
            console.log("mysql 全文检索");
            callback(err, rows);
        } else {
            // var sql = "select id,name,type,size,files,hot,create_date,magnet from t_torrent where locate(?,name) > 0 limit ?,?";
            var sql = "SELECT id,name,type,size,files,hot,create_date,magnet FROM t_torrent WHERE MATCH (name) AGAINST (? IN BOOLEAN MODE) limit ?,?";
            query(sql, [keyword, start, pageCount], function (err, rows) {
                callback(err, rows);
            });
        }
    });
};

exports.queryCount = function queryCount(keyword, callback) {
    var _fenci = segment.doSegment(keyword, {
        simple: true,
        stripPunctuation: true
    });
    var sqlIndex = "select count(id) as count from t_torrent WHERE MATCH (name_separate) AGAINST (? IN BOOLEAN MODE)";
    var sqlParam = new Array();
    if (_fenci.length > 0) {
        sqlParam.push("+" + _fenci.join("+"));
    } else {
        sqlParam.push(keyword);
    }
    query(sqlIndex, sqlParam, function (err, rows) {
        if (err) {
            return console.error(err);
        }
        if (rows[0].count > 0) {
            callback(err, rows);
        } else {
            //var sql = "select count(id) as count from t_torrent where locate(?,name) > 0";
            var sql = "select count(id) as count from t_torrent WHERE MATCH (name) AGAINST (? IN BOOLEAN MODE)";
            query(sql, [keyword], function (err, rows) {
                callback(err, rows);
            });
        }
    });

};

exports.getTorrentById = function getTorrentById(id, callback) {
    var sql = "select id,name,type,size,files,hot,hots,create_date,update_date,enable,magnet,torrent_path from t_torrent where id = ?";
    query(sql, [id], function (err, rows) {
        callback(err, rows);
    });
};

exports.update = function (sql, sqlParam, callback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            callback(err, 0);
        } else {
            conn.query(sql, sqlParam, function (err, result) {
                //释放连接
                conn.release();
                //事件驱动回调
                callback(err, result);
            });
        }
    });
}
