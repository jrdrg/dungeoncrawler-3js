/**
 * Created by john on 3/22/15.
 */

'use strict';

var sounds = {
    MOVE: loadSound('walking', 0.5),
    NO_MOVE: loadSound('nomove'),
    START_BATTLE: loadSound('startbattle2'),
    MENU_MOVE: loadSound('menuitem', 0.4),
    MENU_SELECT: loadSound('Pickup_Coin6'),
    RUN: loadSound('battle_run2'),
    NO_RUN: loadSound('menu_select')
};


module.exports = {
    fx: sounds,
    playSound: playSound
};


/////////////////////////////

function loaded() {

}

function loadSound(sound, volume) {
    //var snd = new Audio('/sounds/' + sound + '.wav');
    //snd.volume = volume || 1.0;
    //return snd;
    var elem = document.createElement('audio');
    elem.src = '/sounds/' + sound + '.wav';
    elem.volume = volume || 1.0;
    return elem;
}


function playSound(sound) {
    try {
        sounds[sound].currentTime = 0;
        sounds[sound].play();
    }
    catch (err) {
        // do something when sound doesn't play?
        console.log(err);
    }
}


function onLoad() {

}