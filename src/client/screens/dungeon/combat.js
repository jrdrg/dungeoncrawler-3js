/**
 * Created by john on 3/25/15.
 */


'use strict';


var combat = module.exports = {
    nextState: 'BATTLE',
    update: update,
    render: render
};

combat.init = function initialize() {
    console.log("New battle!");
    sounds.playSound('START_BATTLE');
    currentBattle = new Battle();

    combat.nextState = 'BATTLE';


    //plane = renderer.getNewObject();
};

combat.getBattle = function getBattle() {
    return currentBattle;
};


var
    activeMap = require('../../activeMap'),
    canvas = require('../../canvas'),
    config = require('../../config'),
    Enemy = require('./Enemy'),
    hud = require('../../hud'),
    images = require('../../images'),
    input = require('../../input'),
    player = require('../../player'),
    renderer = require('../../renderer'),
    sounds = require('../../sounds'),
    utils = require('../../utils')
    ;

var plane;
var dims = {
    width: config.width,
    height: config.height
};

var rowPositionsX = [
    [
        [80],
        [90, 150],
        [70, 140, 210],
        [60, 110, 160, 210]
    ],
    [
        [130],
        [90, 150],
        [70, 140, 210],
        [60, 110, 160, 210]
    ]
];

var rowPositionsY = [80, 70, 65];

/**
 * Represents the current battle. A new one gets created and assigned to currentBattle each time combat.init() is called
 * @constructor
 */
function Battle() {
    var map = activeMap.getCurrentMap();

    this.enemies = initializeEnemies();


    function initializeEnemies() {
        var enemies = [];
        var numRows = utils.randomBetween(1, 2);
        for (var r = 0; r < numRows; r++) {
            var numEnemies = utils.randomBetween(1, 4);
            var row = [];
            var xPos = rowPositionsX[r][numEnemies - 1];

            for (var e = 0; e < numEnemies; e++) {
                var x = xPos[e];
                var y = rowPositionsY[r];

                var enemy = new Enemy({image: 'skull'}, x, y);
                row.push(enemy);
            }
            enemies.push(row);
        }
        return enemies;
    }
}

Battle.prototype.update = function (delta) {
    for (var i = this.enemies.length - 1; i >= 0; i--) {
        for (var j = 0; j < this.enemies[i].length; j++) {
            var enemy = this.enemies[i][j];
            if (enemy.isAlive) {
                enemy.update(delta);
            }
        }
    }
};

Battle.prototype.render = function () {
    for (var i = this.enemies.length - 1; i >= 0; i--) {
        for (var j = 0; j < this.enemies[i].length; j++) {
            var enemy = this.enemies[i][j];
            if (enemy.isAlive) {
                enemy.draw(i);
            }
        }
    }
};


var currentBattle = null;


function update(delta) {
    processKeys();

    if (currentBattle) {
        currentBattle.update(delta);
        canvas.redraw = true;
    }
    hud.update(delta);
}


function render() {

    //var img = images.images.skull;
    //var ctx = plane.context;
    //ctx.drawImage(img, 60, 50);
    //plane.needsUpdate();


    // dim the background
    var ctx = canvas.context;
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = 'rgb(30,30,40)';
    ctx.fillRect(0, 0, 320, 240);
    ctx.globalAlpha = 1;


    images.drawBorder({x: 30, y: 40, w: dims.width - 60, h: 120});

    if (currentBattle) {
        currentBattle.render();
    }
}


function processKeys() {
    if (player.getState() !== player.states.INPUT) {
        return false;
    }

    if (input.keyDown('action', true)) {
        input.handleKey('action', true);

        hud.setMessage("action key pressed");

        renderer.screenShake(20, 30);

    } else if (input.keyDown('cancel', true)) {

        //plane.dispose();
        combat.nextState = 'EXPLORE';
    }
}