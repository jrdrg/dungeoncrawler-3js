/**
 * Created by john on 3/22/15.
 */

'use strict';

var player = module.exports = {
    direction: 0,
    flags: []
};


var states = {
        MOVING: 0,
        TURNING: 1,
        INPUT: 2
    },
    currentState = states.INPUT;


player.direction = Math.PI;
player.hasFlag = hasFlag;
player.position = {x: 3, y: 3};
player.states = states;

player.getState = function getState() {
    return currentState;
};
player.setState = function setState(state) {
    currentState = state;
};


function hasFlag(flag) {
    return player.flags.indexOf(flag) >= 0;
}
