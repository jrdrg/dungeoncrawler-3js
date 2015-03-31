/**
 * Created by john on 3/25/15.
 */

'use strict';


var explore = module.exports = {};
explore.init = init;
explore.nextState = 'EXPLORE';
explore.render = render;
explore.update = update;


var activeMap = require('../../activeMap'),
    canvas = require('../../canvas'),
    hud = require('../../hud'),
    keys = require('./keys'),
    movement = require('./movement');


var keyHandlers = [
    {handler: movement, callback: onMoveComplete},
    {handler: keys}
];

var encounterChance = 0;


function init() {
    hud.setMessage('');
    explore.nextState = 'EXPLORE';
}

function update(delta) {
    var keyPressed = false,
        existingMessage = hud.message;

    // process any key pressed
    keyHandlers.forEach(function (i) {
        if (keyPressed) return;

        var processed = i.handler.processKeys();
        if (processed) {
            keyPressed = true;
        }
    });

    // clear the displayed message if a key was pressed
    if (keyPressed && existingMessage) {
        hud.message = "";
        canvas.redraw = true;
    }

    // update all key handlers
    keyHandlers.forEach(function (i) {
        i.handler.update(delta, i.callback);
    });

    hud.update(delta);
}


function render() {

}


function onMoveComplete(moved) {
    if (!moved) {
        hud.setMessage("There is a wall there!", 'red');

    } else {
        // check for random battles, events on the tile, etc
        var currentMap = activeMap.getCurrentMap();

        encounterChance += currentMap.encounterIncrement;
        encounterChance = Math.min(encounterChance, currentMap.maxEncounterChance);

        if (Math.random() < encounterChance) {
            hud.setMessage('Something approaches!');
            console.log("Battle! pct=" + encounterChance);

            // enter battle!
            encounterChance = 0;
            explore.nextState = 'BATTLE';
        }

    }

    canvas.redraw = true;
}