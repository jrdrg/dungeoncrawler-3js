/**
 * Created by john on 3/22/15.
 */

'use strict';


var textExport = {
    drawCentered: drawCentered,
    drawText: drawText,
    loaded: false,
    setCursor: setCursor,
    textWidth: textWidth
};

module.exports = textExport;


var canvas = require('./canvas'),
    changeColor = require('./changeColor'),
    config = require('./config'),
    utils = require('./utils');


var ctx = canvas.context;

var dataLoaded = false,
    imageLoaded = false,
    lineHeight = 0,
    data = null,
    fontName = 'roses',
    fontImg = new Image(),
    fontCache = {},
    fontColors = {
        'default': fontImg,
        'red': new Image(),
        'green': new Image()
    };


/**
 * The position where the text will be drawn
 * @type {{x: number, y: number}}
 */
var cursor = {x: 0, y: 0};


loadFontImage(fontImg);
loadFont();


////////////////////////////////////////////////


/**
 * Draws the glyph indicated by the code.
 * @param code
 * @returns {Number} The number of pixels to advance in the x-direction.
 */
function drawGlyph(code, color) {
    if (!textExport.loaded) return 0;

    color = color || 'default';

    var character = fontCache[code].char;

    var dst = utils.scaleRect({
        x: cursor.x + character.xoffset,
        y: cursor.y + character.yoffset,
        w: character.width,
        h: character.height
    }, config.scale);

    var src = {x: character.x, y: character.y, w: character.width, h: character.height};

    ctx.drawImage(fontColors[color], src.x, src.y, src.w, src.h, dst.x, dst.y, dst.w, dst.h);

    return character.xadvance; // to advance the cursor
}


/**
 * Draws a string of text at the given coordinates.
 * @param text
 * @param x
 * @param y
 */
function drawText(text, x, y, color) {
    x = Math.round(x);
    y = Math.round(y);
    color = color || 'default';

    setCursor(x, y);

    text = text || '';
    for (var i = 0; i < text.length; i++) {
        var code = text.charCodeAt(i);
        cursor.x += drawGlyph(code, color);
    }
}


function drawCentered(text, y) {
    if (!textExport.loaded) return;

    var tw = textWidth(text);
    var x = Math.floor((config.width / 2) - (tw / 2));
    drawText(text, x, y, 'red');
}


function loadFontImage(fontImg) {
    fontImg.src = "/fontImage/" + fontName;
    fontImg.onload = function () {

        // original font color: 240, 221, 178: #F0DDB2
        // 252 234 199

        /*  assign color changes here */
        fontColors.red.src = changeColor(fontImg, {r: 200, g: 50, b: 50}, {r: 252, g: 234, b: 199});
        fontColors.green.src = changeColor(fontImg, {r: 50, g: 200, b: 50}, {r: 252, g: 234, b: 199});

        imageLoaded = true;
        textExport.loaded = imageLoaded && dataLoaded;
        console.log(textExport.loaded);
    };
}


function loadFont() {
    var oReq = new XMLHttpRequest();
    oReq.onload = function () {
        data = JSON.parse(this.responseText);

        lineHeight = data.common.lineHeight;

        for (var i = 0; i < data.chars.length; i++) {
            fontCache[data.chars[i].id] = {
                char: data.chars[i],
                kerning: {}
            };
        }
        for (var j = 0; j < data.kernings.length; j++) {
            var kern = data.kernings[j];
            var char = fontCache[kern.first];
            if (char) {
                char.kerning[kern.second] = kern.amount;
            } else {
                console.log(kern.first);
            }
        }

        dataLoaded = true;
        textExport.loaded = imageLoaded && dataLoaded;
        console.log(textExport.loaded);
    };
    oReq.open("get", "/font/" + fontName, true);
    oReq.send();
}


/**
 * Moves the cursor to the indicated position.
 * @param x
 * @param y
 */
function setCursor(x, y) {
    cursor.x = x || 0;
    cursor.y = y || 0;
}


function textWidth(text) {
    if (!textExport.loaded) {
        console.log("text not loaded...");
        return;
    }
    var width = 0;
    text = text || '';
    for (var i = 0; i < text.length; i++) {
        var char = fontCache[text.charCodeAt(i)].char;
        width += char.xadvance;
    }
    return width;
}
