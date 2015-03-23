/**
 * Created by john on 3/22/15.
 */


'use strict';

var dungeon = module.exports = {};

var canvas = require('./../../canvas'),
    input = require('./../../input'),
    movement = require('./movement'),
    renderer = require('./../../renderer'),
    text = require('../../text');


/**
 * @description     Updates each frame
 */
dungeon.update = function update(delta) {
    movement.processKeys();
    movement.update(delta);
};

/**
 * @description     Renders the view
 */
dungeon.render = function render() {

    text.drawCentered('You are walking around in a maze.', 10);
    renderer.updateHud();
};