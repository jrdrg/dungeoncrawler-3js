/**
 * Created by john on 3/22/15.
 */

'use strict';

var sounds = {
    MOVE: loadSound('walking', 0.4),
    NO_MOVE: loadSound('nomove'),
    START_BATTLE: loadSound('startbattle2')
};


module.exports = {
    fx: sounds,
    playSound: playSound
};


/////////////////////////////

function loadSound(sound, volume) {
    var snd = new Audio('/sounds/' + sound + '.wav');
    snd.volume = volume || 1.0;
    return snd;
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