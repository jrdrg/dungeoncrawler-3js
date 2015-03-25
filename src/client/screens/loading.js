/**
 * Created by john on 3/22/15.
 */

'use strict';

var text = require('../text');
var images = require('../images');
var gameState = require('../gameState');
var mapGeometry = require('../map/mapGeometry');
var renderer = require('../renderer');


module.exports = {
    update: update,
    render: render
};


/////////////////


function render() {
    text.drawText('Loading...' + images.loadPct(), 100, 100);
}


function update(delta) {
    if (text.loaded && images.isLoaded() && mapGeometry.loadTextures()) {
        renderer.initializeMap();
        gameState.setNextState(gameState.states.DUNGEON);
    }
}