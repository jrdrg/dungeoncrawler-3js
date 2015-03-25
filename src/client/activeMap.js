/**
 * Created by john on 3/22/15.
 */

var activeMap = module.exports = {};


var atlas = require('./map/atlas');
var player = require('./player');


activeMap.canMove = function canMove(dx, dy) {
    var map = atlas.maps[player.currentMap];

    var xc = player.position.x + dx;
    var yc = player.position.y + dy;

    return map.data[yc][xc] === 0;
};