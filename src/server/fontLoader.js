/**
 * Created by john on 3/22/15.
 */

'use strict';

var fs = require('fs');
var bmfont2json = require('bmfont2json');
var path = require('path');


function getFont(font) {

    //grab the Buffer or a string of our data
    var data = fs.readFileSync(path.resolve(__dirname + '/../../font/' + font + '.fnt'));

    //the bitmap font data as an object
    var obj = bmfont2json(data);

    return JSON.stringify(obj);
}


module.exports = {
    getFont: getFont
};