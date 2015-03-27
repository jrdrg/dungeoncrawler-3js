/**
 * Created by john on 3/22/15.
 */


'use strict';

function isWithin(point, rect) {
    var x = isBetween(point.x, rect.x, rect.x + rect.w);
    var y = isBetween(point.y, rect.y, rect.y + rect.h);
    return x && y;

}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function isBetween(value, min, max) {
    return value >= min && value < max;
}

function scaleRect(rect, scale) {
    //return {
    //    x: (rect.x * scale),
    //    y: (rect.y * scale),
    //    w: Math.floor(rect.w * scale),
    //    h: (rect.h * scale)
    //};
    return rect;
}


function distance(p1, p2) {
    return Math.abs(p2.x - p1.x) + Math.abs(p2.y - p1.y);
}


function extend() {
    var defaults = arguments[0];
    var options = arguments[1];

    var extended = {};
    if (arguments[2]) {
        extended = defaults;
    }

    var prop;
    for (prop in defaults) {
        if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
            extended[prop] = defaults[prop];
        }
    }
    for (prop in options) {
        if (Object.prototype.hasOwnProperty.call(options, prop)) {
            extended[prop] = options[prop];
        }
    }
    return extended;
}


function randomBetween(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}


function directionToVector(direction) {
    var vect = {
        x: Math.round(Math.sin(direction % (2 * Math.PI))),
        y: Math.round(Math.cos(direction % (2 * Math.PI)))
    };
    return vect;
}


module.exports = {
    clamp: clamp,
    directionToVector: directionToVector,
    distance: distance,
    extend: extend,
    isBetween: isBetween,
    isWithin: isWithin,
    randomBetween: randomBetween,
    scaleRect: scaleRect
};