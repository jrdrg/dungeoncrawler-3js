/**
 * Created by john on 3/24/15.
 */

'use strict';


module.exports = {
    update: update,
    render: render
};


//var party = require('./characters/party');
var text = require('./../text');
var input = require('./../input');


var party = [
    {name: 'Char 1', className: 'Fighter', level: 1, hp: 10, maxHp: 10},
    {name: 'Char 2', className: 'Thief', level: 1, hp: 8, maxHp: 8},
    {name: 'Char 3', className: 'Priest', level: 1, hp: 8, maxHp: 8},
    {name: 'Char 4', className: 'Wizard', level: 1, hp: 4, maxHp: 4}
];


var widths = {
    name: 80,
    class: 70,
    level: 35,
    hp: 60
};


function update(delta) {
    // no update yet
}


function render(rect) {
    var margin = 0;

    var x = rect.x + margin;
    var y = rect.y + margin;

    text.drawText('Name', x, y, 'green');
    x += widths.name;

    text.drawText('HP', x, y, 'green');
    x += widths.hp;

    text.drawText('Class', x, y, 'green');
    x += widths.class;

    text.drawText('Level', x, y, 'green');
    x += widths.level;

    y += 12;
    for (var i = 0; i < party.length; i++) {
        drawCharacter(party[i], rect.x + margin, y + (i * 10));
    }
}


function drawCharacter(character, x, y) {
    var ox = x;
    var oy = y;

    text.drawText(character.name, x, y);
    x += widths.name;

    text.drawText(character.hp + '/' + character.maxHp, x, y);
    x += widths.hp;

    text.drawText(character.className, x, y);
    x += widths.class;

    text.drawText(character.level + '', x, y);
    x += widths.level;

}


