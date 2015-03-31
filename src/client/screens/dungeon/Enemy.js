/**
 * Created by john on 3/26/15.
 */

'use strict';

module.exports = Enemy;


var canvas = require('../../canvas'),
    images = require('../../images'),
    utils = require('../../utils');

var context = canvas.context;


function Enemy(definition, x, y) {
    definition = definition || {};

    this.image = definition.image || 'skull';
    this.isAlive = true;
    this.level = 1;
    this.name = definition.name || 'Skull';
    this.position = {x: x, y: y};

    this.onUpdate = definition.onUpdate || getDefaultOnUpdate(this);
}


Enemy.prototype.update = function (delta) {

    this.onUpdate(delta);
};


Enemy.prototype.draw = function (row) {
    context.globalAlpha = 1 / ((row + 1));
    images.drawImage(this.image, Math.round(this.position.x), Math.round(this.position.y));
    context.globalAlpha = 1;
};


/**
 * Default update behavior, just moves the sprite up and down between a min and max y-value
 * @param enemy
 * @returns {Function}
 */
function getDefaultOnUpdate(enemy) {
    var yBounds = {
        min: enemy.position.y - Math.ceil(Math.random() * 3) + 2,
        max: enemy.position.y + Math.ceil(Math.random() * 3) + 2
    };
    var dir = Math.round(Math.random() * 2) - 1;
    if (dir === 0) dir = -1;

    return function defaultOnUpdate(delta) {
        var amount = utils.clamp(delta * 10, 0, 1);
        if (dir === 1) {
            if (enemy.position.y < yBounds.max) {
                enemy.position.y += amount;
            } else {
                dir = -1;
            }

        } else if (dir === -1) {
            if (enemy.position.y > yBounds.min) {
                enemy.position.y -= amount;
            } else {
                dir = 1;
            }
        }
    };
}