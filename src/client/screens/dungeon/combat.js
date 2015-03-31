/**
 * Created by john on 3/25/15.
 */


'use strict';


var combat = module.exports = {
    nextState: 'BATTLE',
    update: update,
    render: render,
    endBattle: endBattle
};

combat.init = function initialize() {
    console.log("New battle!");
    sounds.playSound('START_BATTLE');
    currentBattle = new Battle(combat);

    combat.nextState = 'BATTLE';
};

combat.getBattle = function getBattle() {
    return currentBattle;
};


var
    Battle = require('./Battle'),
    canvas = require('../../canvas'),
    config = require('../../config'),
    hud = require('../../hud'),
    images = require('../../images'),
    input = require('../../input'),
    player = require('../../player'),
    renderer = require('../../renderer'),
    sounds = require('../../sounds'),
    utils = require('../../utils')
    ;

var dims = {
    width: config.width,
    height: config.height
};


var currentBattle = null;


function update(delta) {
    processKeys();

    if (currentBattle) {
        currentBattle.update(delta);
        canvas.redraw = true;
    }
    hud.update(delta);
}


function render() {

    // dim the background
    var ctx = canvas.context;
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = 'rgb(30,30,40)';
    ctx.fillRect(0, 0, 320, 240);
    ctx.globalAlpha = 1;


    images.drawBorder({x: 30, y: 40, w: dims.width - 60, h: 120});

    if (currentBattle) {
        currentBattle.render();
    }
}


function processKeys() {
    if (player.getState() !== player.states.INPUT) {
        return false;
    }

    if (input.keyDown('action', true)) {
        input.handleKey('action', true);

        hud.setMessage("action key pressed");

        renderer.screenShake(20, 30);

    } else if (input.keyDown('cancel', true)) {

    }
}


function endBattle() {
    if (currentBattle) currentBattle.dispose();
    combat.nextState = 'EXPLORE';
}