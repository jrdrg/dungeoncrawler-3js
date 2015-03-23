/**
 * Created by john on 3/22/15.
 *
 * This module gives access to the HUD canvas for drawing status, character info, etc on top of the WebGL
 * Three.js renderer.
 *
 * Because Three.js will map this onto a plane geometry the size of the screen, there's no need for double
 * buffering to rescale the pixel art, etc.
 */

'use strict';


var config = require('./config');


//var bgCanvas = createNewCanvas(config.width, config.height);
//var bgCtx = bgCanvas.getContext("2d");

var canvas = createNewCanvas(config.width, config.height);
var ctx = canvas.getContext("2d");


module.exports = {
    clear: clear,
    //context: bgCtx,
    context: ctx,
    createNewCanvas: createNewCanvas,
    draw: draw,
    element: canvas,
    redraw: true,
    resizeCanvas: resizeCanvas
};

///////////////////////////////

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
}


function createNewCanvas(width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
}


function draw() {
    var w = config.width;// * config.scale;
    var h = config.height;// * config.scale;
    //ctx.drawImage(bgCanvas, 0, 0, w, h);
    ctx.drawImage(canvas, 0, 0, w, h);
}


// shamelessly ripped from heroine dusk code
function resizeCanvas() {
    var aspect_ratio = 4 / 3;

    var h, w;

    // the screen is wider than 4:3
    if (window.innerWidth * (3 / 4) > window.innerHeight) {
        h = window.innerHeight;
        w = h * aspect_ratio;
        config.scale = h / config.height;
    }
    // the screen is taller than 4:3
    else {
        w = window.innerWidth;
        h = w / aspect_ratio;
        config.scale = w / config.width;
    }

    config.scale = Math.floor(config.scale);
    //canvas.height = h;
    //canvas.width = w;
    canvas.height = config.height * config.scale;
    canvas.width = config.width * config.scale;

    module.exports.redraw = true;
    setNearestNeighbor();
}


function setNearestNeighbor() {
    ctx.imageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.oImageSmoothingEnabled = false;
}
