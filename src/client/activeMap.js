/**
 * Created by john on 3/22/15.
 */

var activeMap = module.exports = {};


var atlas = require('./map/atlas'),
    player = require('./player');


activeMap.canMove = function canMove(dx, dy) {
    var map = activeMap.getCurrentMap();

    var xc = player.position.x + dx;
    var yc = player.position.y + dy;

    return map.data[yc][xc] === 0;
};


activeMap.getCurrentMap = function getCurrentMap() {
    return atlas.maps[player.currentMap];
};