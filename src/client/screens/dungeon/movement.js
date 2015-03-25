/**
 * Created by john on 3/22/15.
 */

'use strict';

var movement = module.exports = {};

var activeMap = require('../../activeMap'),
    input = require('../../input'),
    player = require('../../player'),
    sounds = require('../../sounds'),
    util = require('../../utils');


var keys = {left: false, right: false, up: false, down: false};

var turnTo = {
        from: 0,
        to: 0,
        dir: 0
    },
    walkTo = {
        from: 0,
        to: 0,
        dir: 0
    };


movement.processKeys = processKeys;
movement.update = update;


function processKeys() {

    keys = {
        left: false, right: false, up: false, down: false
    };
    if (player.getState() === player.states.INPUT) {
        var keyPressed = false;
        for (var key in keys) {
            if (keys.hasOwnProperty(key)) {

                if (input.keyDown(key)) {

                    if (!input.processedKey(key)) {
                        input.handleKey(key, true);

                        keys[key] = true;
                        keyPressed = true;
                        break;
                    }
                }
            }
        }
    }
}

function update(delta) {

    var vect;
    switch (player.getState()) {

        case player.states.INPUT:

            if (keys.left) {

                player.direction -= (Math.PI * 2);
                turnTo = {
                    from: player.direction,
                    to: (player.direction + (Math.PI / 2)) % (2 * Math.PI),
                    dir: -1
                };

            } else if (keys.right) {
                player.direction += (Math.PI * 2);  // so that our calculations for delta etc still work
                turnTo = {
                    from: player.direction,
                    to: (player.direction - (Math.PI / 2)) % (2 * Math.PI),
                    dir: 1
                };

            } else if (keys.up) {

                vect = {
                    x: Math.round(Math.sin(player.direction % (2 * Math.PI))) * -1,
                    y: Math.round(Math.cos(player.direction % (2 * Math.PI))) * -1
                };

                walkTo = {
                    from: {x: player.position.x, y: player.position.y},
                    to: {x: player.position.x + vect.x, y: player.position.y + vect.y},
                    dir: vect
                };


            } else if (keys.down) {

                vect = {
                    x: Math.round(Math.sin(player.direction % (2 * Math.PI))),
                    y: Math.round(Math.cos(player.direction % (2 * Math.PI)))
                };

                walkTo = {
                    from: {x: player.position.x, y: player.position.y},
                    to: {x: player.position.x + vect.x, y: player.position.y + vect.y},
                    dir: vect
                };

            }

            if (turnTo.from !== turnTo.to) {
                sounds.playSound('MOVE');
                player.setState(player.states.TURNING);

            } else if (walkTo.from !== walkTo.to) {

                if (activeMap.canMove(walkTo.dir.x, walkTo.dir.y)) {
                    sounds.playSound('MOVE');
                    player.setState(player.states.MOVING);

                } else {

                    sounds.playSound('NO_MOVE');
                    walkTo = {from: 0, to: 0, dir: 0};
                }

            }

            break;

        case player.states.TURNING:

            player.direction -= (delta * (turnTo.dir) * 3);
            player.direction = player.direction % (Math.PI * 2);

            if (reachedDestination(turnTo.from, turnTo.to, player.direction)) {

                input.handleKey('left', false);
                input.handleKey('right', false);

                player.setState(player.states.INPUT);
                player.direction = turnTo.to;
                turnTo = {from: 0, to: 0, dir: 0};
            }

            break;

        case player.states.MOVING:

            player.position.x += (delta * 2 * walkTo.dir.x);
            player.position.y += (delta * 2 * walkTo.dir.y);

            var reachedX = reachedDestination(walkTo.from.x, walkTo.to.x, player.position.x);
            var reachedY = reachedDestination(walkTo.from.y, walkTo.to.y, player.position.y);

            if (reachedX && reachedY) {

                input.handleKey('up', false);
                input.handleKey('down', false);

                player.setState(player.states.INPUT);
                player.position.x = walkTo.to.x;
                player.position.y = walkTo.to.y;
                walkTo = {from: 0, to: 0, dir: 0};
            }

            break;
    }
}


function reachedDestination(from, to, current) {

    if (from < to) {

        if (current >= to) {
            return true;
        }

    } else if (from > to) {

        if (current <= to) {
            return true;
        }

    } else {
        return true;
    }

    return false;
}