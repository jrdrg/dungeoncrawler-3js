/**
 * Created by john on 3/22/15.
 */


'use strict';

module.exports = {
    //clickPos: clickPos,
    //getMouseClick: getMouseClick,
    //isClicked: isClicked,
    //isMouseOver: isMouseOver,

    keyDown: isKeyDown,
    handleKey: function (key, processed) {
        processedKey[key] = processed;
    },

    //mousePos: mousePos,
    //mousePressed: mousePressed,

    processedKey: isKeyHandled,
    registerEventHandlers: registerEventHandlers
};


var config = require('./config');
var canvas = require('./canvas').element;
var utils = require('./utils');


var KEYCODE = {
    //UP: 38,
    //DOWN: 40,
    //LEFT: 37,
    //RIGHT: 39,
    UP: 87,
    DOWN: 83,
    LEFT: 65,
    RIGHT: 68,
    SPACE: 32
};
/*

 if (keyCode == 87) {
 camera.translateZ(-200);
 }
 if (keyCode == 68) {
 camera.rotation.y -= (Math.PI / 2);
 }
 if (keyCode == 83) {
 camera.translateZ(200);
 }
 if (keyCode == 65) {
 camera.rotation.y += (Math.PI / 2);
 }

 */

var mousePressed = {
    left: false,
    right: false
};

var keyDown = {
    left: false,
    right: false,
    up: false,
    down: false
};

var preventInput = {
    left: false,
    right: false
};

var processedKey = {
    left: false,
    right: false,
    up: false,
    down: false,
    action: false
};


var mousePos = {x: 0, y: 0};
var clickPos = null;


function handleMouseDown(evt) {
    evt.preventDefault();
    mousePressed.left = true;
    clickPos = clickCoord(evt);
}

function handleMouseUp(evt) {
    mousePressed.left = false;
    preventInput.left = false;
    clickPos = null;
}

function handleMouseOver(evt) {
    mousePos = clickCoord(evt);
}

function clickCoord(evt) {

    var canx;
    var cany;

    if (evt.pageX || evt.pageY) {
        canx = evt.pageX;
        cany = evt.pageY;
    }
    else {
        canx = evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        cany = evt.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    canx -= canvas.offsetLeft;
    cany -= canvas.offsetTop;

    canx /= config.scale;
    cany /= config.scale;

    return {x: canx, y: cany};
}

/** Touch Handler **/

function handleTouchStart(evt) {
    evt.preventDefault();
    mousePressed.left = true;
    mousePos = touchCoord(evt);
}


function handleTouchEnd(evt) {
    mousePressed.left = false;
    preventInput.left = false;
}


function handleKeyDown(evt) {
    function setKey(key) {
        keyDown[key] = true;
        evt.preventDefault();
    }

    if (evt.keyCode == KEYCODE.UP) {
        //keyDown.up = true;
        setKey('up');
    }
    else if (evt.keyCode == KEYCODE.DOWN) {
        //keyDown.down = true;
        setKey('down');
    }
    else if (evt.keyCode == KEYCODE.LEFT) {
        //keyDown.left = true;
        setKey('left');
    }
    else if (evt.keyCode == KEYCODE.RIGHT) {
        //keyDown.right = true;
        setKey('right');
    }
    else if (evt.keyCode == KEYCODE.SPACE) {
        keyDown.action = true;
    }
}


function handleKeyUp(evt) {
    if (evt.keyCode == KEYCODE.UP) {
        keyDown.up = false;
        processedKey.up = false;
    }
    else if (evt.keyCode == KEYCODE.DOWN) {
        keyDown.down = false;
        processedKey.down = false;
    }
    else if (evt.keyCode == KEYCODE.LEFT) {
        keyDown.left = false;
        processedKey.left = false;
    }
    else if (evt.keyCode == KEYCODE.RIGHT) {
        keyDown.right = false;
        processedKey.right = false;
    }
    else if (evt.keyCode == KEYCODE.SPACE) {
        keyDown.action = false;
        processedKey.action = false;
    }
}


function registerEventHandlers() {
    if (window.addEventListener) {
        window.addEventListener('keydown', handleKeyDown, true);
        window.addEventListener('keyup', handleKeyUp, true);
        window.addEventListener('mousedown', handleMouseDown, true);
        window.addEventListener('mouseup', handleMouseUp, true);
        window.addEventListener('mousemove', handleMouseOver, true);
        window.addEventListener('touchstart', handleTouchStart, true);
        window.addEventListener('touchend', handleTouchEnd, true);
    }
}


/**
 * Returns true if the mouse is down within the specified rectangle
 * @param rect
 */
function isClicked(rect) {
    if (!rect) return false;
    if (preventInput.left) {
        console.log("preventinput");
        return false;
    }

    var clicked = mousePressed.left && isMouseOver(rect);
    if (clicked) {
        // make sure we don't process 2 clicks in 2 subsequent frames if the button is held down
        mousePressed.left = false;
    }
    return clicked;
}


function getMouseClick() {
    if (preventInput.left) return false;

    var clicked = mousePressed.left;
    if (clicked) {
        mousePressed.left = false;
        return clickPos;
    }
    return null;
}


function touchCoord(evt) {
    var canx = evt.touches[0].pageX;
    var cany = evt.touches[0].pageY;

    canx -= canvas.offsetLeft;
    cany -= canvas.offsetTop;

    canx /= config.scale;
    cany /= config.scale;

    return {x: canx, y: cany};
}


function isMouseOver(rect) {
    if (!rect) return false;
    return utils.isWithin(mousePos, rect);
}

function isKeyDown(key) {
    return keyDown[key];
}

function isKeyHandled(key) {
    return processedKey[key];
}

