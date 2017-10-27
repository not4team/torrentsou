var express = require('express');
var db = require('../db/mysql');
var router = express.Router();
var pinyin = require("pinyin");
var device = require("../util/device");

/* GET torrent listing. */
router.get('/', function (req, res, next) {
  var _keyword = req.query.keyword;
  var page = req.query.page;
  var pageCount = req.query.pageCount;
  if (!page)
    page = 1;
  if (!pageCount) {
    pageCount = 10;
  }
  console.log("keyword:" + _keyword + ",page:" + page + ",pageCount:" + pageCount);
  db.queryByPage(_keyword, page, pageCount, function (err, result) {
    if (err) {
      return console.error(err);
    }
    // console.log("data finish");
    db.queryCount(_keyword, function (err, rows) {
      if (err) {
        return console.error(err);
      }
      var _isMobile = device.isMobile(req);
      // console.log("isMobile:" + _isMobile);
      res.render('torrent_list', { keyword: _keyword, isMobile: _isMobile, currentPage: page, totalRows: rows[0].count, totalPageCount: Math.ceil(rows[0].count / pageCount), torrents: result });
    });
  });

  var keywordPinyin = _keyword;
  if (_keyword.length > 10)
    keywordPinyin = _keyword.substring(0, 10);
  var pinyins = pinyin(keywordPinyin, { style: pinyin.STYLE_NORMAL });
  db.update("call update_search_history_pro(?,?)", [_keyword, pinyins.toString()], function (err, result) {
    if (err) {
      return console.error(err);
    }
  });
});

module.exports = router;