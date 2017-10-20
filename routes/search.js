var express = require('express');
var db = require('../db/mysql');
var router = express.Router();

// var redis = require("redis"),
// client = redis.createClient('redis://www.oyigo.com:6379?database=0');

/* GET search listing. */
router.get('/:keyword', function(req, res, next) {
  var keyword = req.params.keyword;
  var page = req.query.page;
  var pageCount = req.query.pageCount;
  console.log("keyword:" + keyword + ",page:" + page + ",pageCount:" + pageCount);
  if(!page)
    page = 1;
  if(!pageCount) {
    pageCount = 20;
  }
  db.queryByPage(keyword,page,pageCount,function(err,result) {
    if(err) {
      return console.error(err);
    }
    // var i,length;
    // length = result.length;
    // console.log("result length:" + length);
    // for(i = 0;i<length;i++) {
    //     console.log("item:" + result[i]);
    //     client.sadd(keyword, JSON.stringify(result[i]),function(err) {
    //         if(err) {
    //             console.error(err);
    //         }
    //     });
    // }
    //有效时间一天
    // client.expire(keyword,30);
    db.queryCount(keyword,function(err,rows) {
        if(err) {
            return console.error(err);
        }
        res.setHeader("total-page-count",rows[0].count);
        res.send(result);
    });
  });
//   client.smembers(keyword, function(err, reply) {
//       if(err) {
//           console.error(err);
//       } else {
//           if(reply != null && reply.length > 0) {
//             res.send(reply);
//           } else {
            
//           }
//       }
//   });
});

module.exports = router;
