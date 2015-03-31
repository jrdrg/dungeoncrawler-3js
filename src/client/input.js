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
    handleKey: handleKey,

    //mousePos: mousePos,
    //mousePressed: mousePressed,

    processedKey: isKeyHandled,
    registerEventHandlers: registerEventHandlers
};


var config = require('./config'),
    element = require('./canvas').element,
    utils = require('./utils');


var KEYCODE = {
    // these are the arrow keys
    ARROW_UP: 38,
    ARROW_DOWN: 40,
    ARROW_LEFT: 37,
    ARROW_RIGHT: 39,

    // these are WASD keys
    UP: 87,
    DOWN: 83,
    LEFT: 65,
    RIGHT: 68,
    SPACE: 32,

    ESC: 27,
    ENTER: 13,
    M: 77       // 'M' for mini-map
};


var keyMappings = [
    {key: 'up', code: KEYCODE.UP},
    {key: 'down', code: KEYCODE.DOWN},
    {key: 'left', code: KEYCODE.LEFT},
    {key: 'right', code: KEYCODE.RIGHT},
    {key: 'action', code: KEYCODE.SPACE},
    {key: 'cancel', code: KEYCODE.ESC},
    {key: 'confirm', code: KEYCODE.ENTER},

    {key: 'a_up', code: KEYCODE.ARROW_UP},
    {key: 'a_down', code: KEYCODE.ARROW_DOWN},
    {key: 'a_left', code: KEYCODE.ARROW_LEFT},
    {key: 'a_right', code: KEYCODE.ARROW_RIGHT},

    {key: 'map', code: KEYCODE.M}
];

var mousePressed = {
    left: false,
    right: false
};

var preventInput = {
    left: false,
    right: false
};

var keyDown = {
    left: false,
    right: false,
    up: false,
    down: false
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
    canx -= element.offsetLeft;
    cany -= element.offsetTop;

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
    var processed = false;
    keyMappings.forEach(function (mapping) {

        if (!processed && evt.keyCode === mapping.code) {
            keyDown[mapping.key] = true;
            evt.preventDefault();

            processed = true;
        }
    });
}


function handleKeyUp(evt) {
    var processed = false;
    keyMappings.forEach(function (mapping) {

        if (!processed && evt.keyCode === mapping.code) {
            keyDown[mapping.key] = false;
            processedKey[mapping.key] = false;

            processed = true;
        }
    });
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

    canx -= element.offsetLeft;
    cany -= element.offsetTop;

    canx /= config.scale;
    cany /= config.scale;

    return {x: canx, y: cany};
}

function handleKey(key, processed) {
    processedKey[key] = processed;
}

function isMouseOver(rect) {
    if (!rect) return false;
    return utils.isWithin(mousePos, rect);
}

function isKeyDown(key, processed) {
    return keyDown[key] && (!processed || !isKeyHandled(key));
}

function isKeyHandled(key) {
    return processedKey[key];
}

