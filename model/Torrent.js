var query = require("../db/mysql"); 

module.exports = Torrent;
var Torrent = function Torrent(obj) {
    this.id = obj.id;
    this.name = obj.name;
    this.type = obj.type;
    this.size = obj.size;
    //json [{name:"",size:0}]
    this.files = obj.files;
    this.hot = obj.hot;
    //json [{time:"2017-09-20",hot:0}]
    this.hots = obj.hots;
    this.createDate = obj.createDate;
    this.updateDate = obj.updateDate;
    this.enable = obj.enable;
    this.magnet = obj.magnet;
    this.torrentPath = obj.torrentPath;
}