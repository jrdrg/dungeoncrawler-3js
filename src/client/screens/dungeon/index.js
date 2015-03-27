/**
 * Created by john on 3/22/15.
 */


'use strict';

var dungeon = module.exports = {};

var canvas = require('../../canvas'),
    config = require('../../config'),
    hud = require('../../hud'),
    input = require('../../input'),
    keys = require('./keys'),
    renderer = require('../../renderer'),
    text = require('../../text');


var states = {
        EXPLORE: require('./explore'),
        BATTLE: require('./combat'),
        MENU: {}
    },
    currentState = states.EXPLORE;


/**
 * @description     Updates each frame
 */
dungeon.update = function update(delta) {

    currentState.update(delta);

    var nextState = states[currentState.nextState];
    if (nextState !== currentState) {
        currentState = nextState;
        if (currentState.init) {
            currentState.init();
        }

        // always redraw on state changes
        canvas.redraw = true;
    }
};


/**
 * @description     Renders the view
 */
dungeon.render = function render() {

    currentState.render();

    hud.render();
    renderer.updateHud();
};