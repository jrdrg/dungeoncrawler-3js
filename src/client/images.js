/**
 * Created by john on 3/22/15.
 */

'use strict';

var canvas = require('./canvas');
var ctx = canvas.context;

var totalImages = 9999;
var loadedImages = 0;
var loaded = false;

var images = {};


images.wallTexture = loadImage('walltexture');
images.floorTexture = loadImage('floortexture');

//images.title = loadImage('title');
//
//images.borderUL = loadImage('textborder', {x: 0, y: 0, w: 16, h: 16});
//images.borderU = loadImage('textborder', {x: 16, y: 0, w: 16, h: 16});
//images.borderUR = loadImage('textborder', {x: 32, y: 0, w: 16, h: 16});
//images.borderL = loadImage('textborder', {x: 0, y: 16, w: 16, h: 16});
//images.borderM = loadImage('textborder', {x: 16, y: 16, w: 16, h: 16});
//images.borderR = loadImage('textborder', {x: 32, y: 16, w: 16, h: 16});
//images.borderBL = loadImage('textborder', {x: 0, y: 32, w: 16, h: 16});
//images.borderB = loadImage('textborder', {x: 16, y: 32, w: 16, h: 16});
//images.borderBR = loadImage('textborder', {x: 32, y: 32, w: 16, h: 16});
//
//images.room = loadImage('mapTiles', {x: 16, y: 0, w: 16, h: 16});
//images.visitedroom = loadImage('mapTiles', {x: 0, y: 0, w: 16, h: 16});
//images.currentPos = loadImage('mapTiles', {x: 22, y: 22, w: 4, h: 4});
//
//images.hCorridor = loadImage('mapTiles', {x: 32, y: 6, w: 4, h: 4});    // real width=16
//images.vCorridor = loadImage('mapTiles', {x: 6, y: 16, w: 4, h: 4});    // real height=16
//
//images.stairsUp = loadImage('mapTiles', {x: 32, y: 16, w: 16, h: 16});
//
//images.skull = loadImage('skull', {x: 0, y: 0, w: 50, h: 50});
//
//
//images.tilesets = {};   // indexed by distance from player, 0=closest (tiles1), 4=furthest (tiles5)
//images.tilesets.dungeon = [
//    {
//        l: loadImage('tiles1', {x: 0, y: 0, w: 25, h: 140}),
//        r: loadImage('tiles1', {x: 175, y: 0, w: 25, h: 140}),
//        floor: loadImage('floors', {x: 0, y: 53, w: 200, h: 17}),
//        wall_l: loadImage('tiles1', {x: 175, y: 17, w: 25, h: 106}),
//        wall_r: loadImage('tiles1', {x: 0, y: 17, w: 25, h: 106}),     // fix this, create actual wall graphics
//        wall: loadImage('tiles1', {x: 25, y: 17, w: 150, h: 106})
//    }
//];


// get total number of images to make sure we've loaded everything
totalImages = Object.keys(images).length;
if (checkLoadComplete()) loaded = true;

module.exports = {
    drawBorder: drawBorder,
    drawImage: drawImage,
    getBorder: getBorder,
    images: images,
    isLoaded: function () {
        return loaded;
    },
    loadPct: function () {
        return loadedImages / totalImages;
    }
};

////////////////////////////////////////


function onLoad() {
    loadedImages++;
    if (checkLoadComplete()) {
        loaded = true;
    }
}

function checkLoadComplete() {
    return loadedImages >= totalImages;
}


function drawBorder(rect) {
    if (!loaded) return;
    var x = rect.x,
        y = rect.y,
        w = rect.w,
        h = rect.h;

    var borderSize = 16;

    var bottomRow = (y + h) - borderSize;
    var rightCol = (x + w) - borderSize;

    // take advantage of the fact that the border graphics are one color so we can stretch them

    drawImage('borderM', rect.x, rect.y, rect.w, rect.h);
    drawImage('borderU', rect.x, rect.y, rect.w, borderSize);
    drawImage('borderL', rect.x, rect.y, borderSize, rect.h);
    drawImage('borderR', rect.w - borderSize, rect.y, borderSize, rect.h);
    drawImage('borderB', rect.x, rect.h - borderSize, rect.w, borderSize);

    drawImage('borderUL', x, y);
    drawImage('borderUR', rightCol, y);
    drawImage('borderBL', x, bottomRow);
    drawImage('borderBR', rightCol, bottomRow);
}


function drawImage(image, x, y, w, h) {
    if (!loaded) return;

    var img = typeof(image) === 'object' ? image : images[image];
    w = w || img.sw;
    h = h || img.sh;


    if (img.sx !== undefined && img.sy !== undefined) {
        ctx.drawImage(img, img.sx, img.sy, img.sw, img.sh, x, y, w, h);
    } else {
        ctx.drawImage(img, x, y);
    }
}


function getBorder(rect) {
    var config = require('./config');

    console.log('getBorder');
    console.log(rect);

    var cnv = canvas.createNewCanvas(config.width, config.height);
    var context = cnv.getContext("2d");

    // switch the context around and draw to the new canvas, then switch it back
    ctx = context;
    var r2 = {x: 0, y: 0, w: rect.w, h: rect.h};
    drawBorder(r2);
    ctx = canvas.context;
    return cnv;
}


function loadImage(image, src) {
    var img = new Image();
    img.onload = onLoad;
    img.src = '/images/' + image + '.png';
    if (src) {
        img.sx = src.x;
        img.sy = src.y;
        img.sw = src.w;
        img.sh = src.h;
    }
    return img;
}


