var express = require('express');
var db = require('../db/mysql');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('torrent_list', { title: '战狼' });
});

module.exports = router;
