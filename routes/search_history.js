var express = require('express');
var db = require('../db/mysql');
var router = express.Router();
var pinyin = require("pinyin");

router.get('/', function (req, res, next) {
    var _keyword = req.query.keyword;
    var keywordPinyin = _keyword;
    if(_keyword.length > 10)
        keywordPinyin = _keyword.substring(0,10);
    var pinyins = pinyin(keywordPinyin,{style: pinyin.STYLE_NORMAL});
    var sql = "SELECT t.id,t.keyword,t.hot,t.pinyin FROM (SELECT t1.id,t1.keyword,t1.hot,t1.pinyin FROM t_search_history t1 WHERE keyword LIKE '?%' UNION SELECT t2.id,t2.keyword,t2.hot,t2.pinyin FROM t_search_history t2 WHERE pinyin LIKE '?%') t ORDER BY t.hot DESC LIMIT 0,10";
    db.query(sql,[_keyword,pinyins.toString()],function(err,rows,fields){
        if(err) {
            return console.error(err);
        }
        res.send(rows);
    });
});

module.exports = router;