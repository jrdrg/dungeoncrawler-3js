/**
 * Created by john on 3/22/15.
 */



'use strict';

var canvas = require('./canvas');
var ctx = canvas.context;

var states = {
    LOADING: "loading",
    TITLE: "title",
    TOWN: "town",
    DUNGEON: "dungeon",
    BATTLE: "battle"
};


var gameState = {
    currentState: states.LOADING,
    setNextState: setNextState,
    states: states
};


module.exports = gameState;

//////////////////////////


function setNextState(state) {
    ctx.globalAlpha = 1;
    canvas.redraw = true;
    gameState.currentState = state;
}