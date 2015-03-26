/**
 * Created by john on 3/25/15.
 */

'use strict';

var keys = module.exports = {};

var canvas = require('../../canvas'),
    hud = require('../../hud'),
    input = require('../../input'),
    player = require('../../player');

var renderer = require('../../renderer');

keys.processKeys = processKeys;
keys.update = function update(delta) {

};


function processKeys() {
    if (player.getState() !== player.states.INPUT) {
        return false;
    }

    if (isKeyDown('action')) {
        input.handleKey('action', true);

        hud.setMessage("action key pressed");

        renderer.screenShake(20, 30);
    }
}


function isKeyDown(key) {
    return input.keyDown(key) && !input.processedKey(key);
}