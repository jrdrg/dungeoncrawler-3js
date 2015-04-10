/**
 * Created by john on 3/22/15.
 */

'use strict';

require('./text');  // load text etc

var lastTime;

window.onload = function () {

    var w = window;
    var requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

    var config = require('./config');
    var input = require('./input');
    var gameLoop = require('./gameLoop');
    var canvas = require('./canvas');
    var renderer = require('./renderer');


    function main() {
        var now = Date.now();
        var delta = now - lastTime;

        gameLoop.update(delta / 1000);
        gameLoop.render();

        lastTime = now;

        // Request to do this again ASAP
        requestAnimationFrame(main);
    }

    renderer.initialize();
    document.getElementById('game').appendChild(renderer.getElement());

    if (window.addEventListener) {
        //window.addEventListener('resize', canvas.resizeCanvas, false);
        window.addEventListener('orientationchange', canvas.resizeCanvas, false);
    }
    input.registerEventHandlers();

    lastTime = Date.now();

    //canvas.resizeCanvas();
    main();
};