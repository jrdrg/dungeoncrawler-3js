/**
 * Created by john on 3/22/15.
 */


'use strict';

var gameState = require('./gameState');
var canvas = require('./canvas');
var renderer = require('./renderer');

var screens = {
    loading: require('./screens/loading'),
    //title: require('./screens/title'),
    //town: require('./screens/town'),
    dungeon: require('./screens/dungeon')
};

var states = gameState.states;


module.exports = {
    update: update,
    render: render
};

////////////////////////////////

function update(delta) {
    renderer.update(delta);

    switch (gameState.currentState) {

        case states.LOADING:
            screens.loading.update(delta);
            break;

        //case states.TITLE:
        //    screens.title.update(delta);
        //    break;
        //
        //case states.TOWN:
        //    screens.town.update(delta);
        //    break;

        case states.DUNGEON:
            screens.dungeon.update(delta);
            break;
    }
}


function render() {
    renderer.render();


    /*  only draw other stuff if we've updated the canvas */
    if (!canvas.redraw) return;
    canvas.clear();

    switch (gameState.currentState) {

        case states.LOADING:
            screens.loading.render();
            break;

        //case states.TITLE:
        //    screens.title.render();
        //    break;
        //
        //case states.TOWN:
        //    screens.town.render();
        //    break;

        case states.DUNGEON:
            screens.dungeon.render();
            break;

    }
    canvas.draw();
    canvas.redraw = false;
}