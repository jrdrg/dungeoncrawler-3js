/**
 * Created by john on 3/22/15.
 */


'use strict';

var dungeon = module.exports = {};

var canvas = require('../../canvas'),
    config = require('../../config'),
    hud = require('../../hud'),
    input = require('../../input'),
    movement = require('./movement'),
    renderer = require('../../renderer'),
    text = require('../../text');

var charDisplay = require('../../characterDisplay');

/**
 * @description     Updates each frame
 */
dungeon.update = function update(delta) {
    var keyPressed = movement.processKeys();
    if (keyPressed && hud.message) {
        hud.message = "";
        canvas.redraw = true;
    }
    movement.update(delta, onMoveComplete);
};

/**
 * @description     Renders the view
 */
dungeon.render = function render() {

    // render entire view here

    //text.drawText('random number=' + Math.random(), 60, 60);
    //text.drawCentered('You are walking around in a maze.', 10);

    if (hud.message) {
        text.drawCentered(hud.message, 10);
    }

    charDisplay.render({x: 5, y: 240 - 65, w: 310, h: 60});

    renderer.updateHud();
};


function onMoveComplete(moved) {

    if (!moved) {
        hud.message = "There is a wall there!";
    }

    canvas.redraw = true;
}