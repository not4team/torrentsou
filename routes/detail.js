var express = require('express');
var db = require('../db/mysql');
var router = express.Router();
var Segment = require('segment');
// 创建实例
var segment = new Segment();
// 使用默认的识别模块及字典，载入字典文件需要1秒，仅初始化时执行一次即可
segment.useDefault();

/* GET users listing. */
router.get('/:id', function (req, res, next) {
  var id = req.params.id;
  var kw = req.query.kw;
  db.getTorrentById(id, function (err, result) {
    if (err) {
      return console.error(err);
    }
    var _fenci = segment.doSegment(result[0].name, {
      stripPunctuation: true
    });
    // console.log(_fenci);
    res.render('torrent_detail', {
      keyword: kw, id: result[0].id, name: result[0].name, type: result[0].type, size: result[0].size,
      files: result[0].files, hot: result[0].hot, hots: result[0].hots, createDate: result[0].create_date,
      updateDate: result[0].update_date, magnet: result[0].magnet, torrentPath: result[0].torrent_path,
      fenci: _fenci
    });
  });
});
module.exports = router;