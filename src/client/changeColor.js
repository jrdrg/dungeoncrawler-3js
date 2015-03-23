/**
 * Created by john on 3/22/15.
 */

'use strict';

var canvas = require('./canvas');


/**
 * @description         Examines each pixel in the given image and changes all oldColor pixels to newColor, or if oldColor
 *                      is not specified then changes all non-black pixels to newColor
 * @param img
 * @param newColor      {Object} - {r, g, b}
 * @param oldColor      {Object} - {r, g, b}
 * @returns {String}    A DataURL that can be used as a .src for an Image
 */
function changeColor(img, newColor, oldColor) {
    newColor = newColor || {};
    oldColor = oldColor || {};

    var cnv = canvas.createNewCanvas(img.width, img.height);
    var ctx = cnv.getContext('2d');

    var nR = newColor.r || 0,
        nG = newColor.g || 0,
        nB = newColor.b || 0;

    var oR = oldColor.r,
        oG = oldColor.g,
        oB = oldColor.b;

    ctx.drawImage(img, 0, 0);

    // pull the entire image into an array of pixel data
    var imageData = ctx.getImageData(0, 0, img.width, img.height);

    // examine every pixel,
    // change any old rgb to the new-rgb
    for (var i = 0; i < imageData.data.length; i += 4) {
        if ((imageData.data[i] == oR &&
            imageData.data[i + 1] == oG &&
            imageData.data[i + 2] == oB
            ) || ((!oR && !oG && !oB) && imageData.data[i] > 0)) {

            imageData.data[i] = nR;
            imageData.data[i + 1] = nG;
            imageData.data[i + 2] = nB;
        }
    }
    // put the altered data back on the canvas
    ctx.putImageData(imageData, 0, 0);
    return cnv.toDataURL();
}

module.exports = changeColor;