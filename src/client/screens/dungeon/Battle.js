/**
 * Created by john on 3/28/15.
 */

'use strict';

module.exports = Battle;


var activeMap = require('../../activeMap'),
    config = require('../../config'),
    Enemy = require('./Enemy'),
    hud = require('../../hud'),
    input = require('../../input'),
    Menu = require('../../menu'),
    sounds = require('../../sounds'),
    utils = require('../../utils');

var rowPositionsX = [
    [
        [130],
        [100, 160],
        [70, 140, 210],
        [60, 110, 160, 210]
    ],
    [
        [135],
        [95, 155],
        [75, 145, 215],
        [65, 115, 165, 215]
    ]
];

var rowPositionsY = [80, 70, 65];
var plane;

var states = {
    FIGHT: 0,
    ESCAPED: 1
};

var endBattleCounter = 0;


/**
 * Represents the current battle. A new one gets created and assigned to currentBattle each time combat.init() is called
 * @constructor
 */
function Battle(combat) {
    var self = this;
    var map = activeMap.getCurrentMap();
    //plane = renderer.getNewObject();

    this.combat = combat;
    this.enemies = initializeEnemies();
    this.menu = new Menu({
        x: 150,
        y: config.height - 70,
        w: config.width - 180,
        h: 60
    }, [
        {title: 'Fight'},
        {
            title: 'Run',
            action: function () {
                self.run();
            }
        },
        {title: '9/9/9/9/9/9/9/9/9'},
        {title: 'Skill'}
    ]);
    this.state = states.FIGHT;


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
    switch (this.state) {
        case states.FIGHT:
            for (var i = this.enemies.length - 1; i >= 0; i--) {
                for (var j = 0; j < this.enemies[i].length; j++) {
                    var enemy = this.enemies[i][j];
                    if (enemy.isAlive) {
                        enemy.update(delta);
                    }
                }
            }
            this.menu.update(delta);
            break;

        case states.ESCAPED:
            //var ctx = require('../../canvas').context;
            //if (endBattleCounter < 99) {
            //    endBattleCounter++;
            //}
            //if (endBattleCounter > 0) {
            //    ctx.globalAlpha = 1 / (endBattleCounter + 1);
            //}
            if (input.keyDown('confirm', true) || input.keyDown('action', true) || input.keyDown('cancel', true)) {
                //ctx.globalAlpha = 1;
                this.combat.endBattle();
            }
            break;
    }

};

Battle.prototype.render = function () {
    //var img = images.images.skull;
    //var ctx = plane.context;
    //ctx.drawImage(img, 60, 50);
    //plane.needsUpdate();

    switch (this.state) {
        case states.FIGHT:
            for (var i = this.enemies.length - 1; i >= 0; i--) {
                for (var j = 0; j < this.enemies[i].length; j++) {
                    var enemy = this.enemies[i][j];
                    if (enemy.isAlive) {
                        enemy.draw(i);
                    }
                }
            }
            this.menu.render();
            break;

        case states.ESCAPED:

            break;
    }

};


Battle.prototype.dispose = function () {
    //plane.dispose();
};


Battle.prototype.run = function () {
    // check if we can run
    if (Math.random() <= 0.5) {
        hud.setMessage("You managed to escape.");
        hud.drawMore(200);
        sounds.playSound('RUN');
        this.state = states.ESCAPED;

    } else {
        hud.setMessage("Can't run!", 'red');
        sounds.playSound('NO_RUN');
    }
};