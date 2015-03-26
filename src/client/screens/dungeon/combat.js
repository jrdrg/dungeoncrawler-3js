/**
 * Created by john on 3/25/15.
 */


'use strict';


var combat = module.exports = {
    nextState: 'BATTLE',
    update: update,
    render: render
};

combat.init = function initialize() {
    console.log("New battle!");
    sounds.playSound('START_BATTLE');
    currentBattle = new Battle();

    combat.nextState = 'BATTLE';
};

combat.getBattle = function getBattle() {
    return currentBattle;
};


var
    activeMap = require('../../activeMap'),
    hud = require('../../hud'),
    input = require('../../input'),
    player = require('../../player'),
    renderer = require('../../renderer'),
    sounds = require('../../sounds'),
    utils = require('../../utils')
    ;


/**
 * Represents the current battle. A new one gets created and assigned to currentBattle each time combat.init() is called
 * @constructor
 */
function Battle() {
    var map = activeMap.getCurrentMap();
    this.enemyCount = utils.randomBetween(1, 3);
}


var currentBattle = null;


function update(delta) {
    processKeys();

    hud.update(delta);
}


function render() {

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

        combat.nextState = 'EXPLORE';
    }
}