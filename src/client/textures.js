/**
 * Created by john on 3/25/15.
 */

'use strict';


module.exports = {
    loadTextures: loadTextures,
    getTexture: function (key) {
        return textures[key];
    }
};


var textureCount = 0;
var textures = {
    wall: THREE.ImageUtils.loadTexture('/images/walltexture.png', {}, onLoad),
    floor: THREE.ImageUtils.loadTexture('/images/floortexture.png', {}, onLoad),
    woodWall: THREE.ImageUtils.loadTexture('/images/wood_walltexture.png', {}, onLoad)
};


/**
 * Allows preloading of all textures before we start rendering anything
 * @returns {boolean} True when all textures have been loaded.
 */
function loadTextures() {
    return (textureCount === Object.keys(textures).length);
}


function onLoad() {
    textureCount++;
}