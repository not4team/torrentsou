var express = require('express');
var router = express.Router();

router.get('/:id', function (req, res, next) {
    var _id = req.params.id;
    var _name = req.query.name;
    res.render("video_player", { id: _id, name: _name });
});
module.exports = router;