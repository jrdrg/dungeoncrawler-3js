/**
 * Created by john on 3/24/15.
 */

'use strict';

var hud = module.exports = {};

var characterDisplay = require('./characterDisplay');
var canvas = require('../canvas'),
    images = require('../images'),
    text = require('../text');


hud.message = '';
hud.render = render;
hud.setMessage = setMessage;
hud.update = update;

var messageColor = 'green';

function update(delta) {
    characterDisplay.update(delta);
}

function render() {
    if (hud.message) {
        text.drawCentered(hud.message, 10, messageColor);
    }

    characterDisplay.render({x: 5, y: 240 - 65, w: 310, h: 60});
}


function setMessage(message, color) {
    hud.message = message;
    canvas.redraw = true;

    messageColor = color || 'green';
}