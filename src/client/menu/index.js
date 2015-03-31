/**
 * Created by john on 3/26/15.
 */

'use strict';

module.exports = Menu;

var
    images = require('../images'),
    input = require('../input'),
    player = require('../player'),
    sounds = require('../sounds'),
    text = require('../text'),
    utils = require('../utils')
    ;


function Menu(sizeRect, options) {
    this.border = images.getBorder(sizeRect);
    this.options = [];
    this.parentMenu = options.parent || null;   // when cancel is pressed, what menu to go back to
    this.selectedIndex = 0;
    this.size = sizeRect;
    this.subMenu = null;    // display a sub menu

    var xPos = 5,
        yPos = 0,
        self = this;

    options.forEach(function (o) {
        var opt = utils.extend(o, {
            menu: self,
            x: xPos + 2,
            y: yPos += 10
        });
        self.options.push(opt);
    });
}


Menu.prototype.render = function () {
    var self = this;
    images.drawImage(this.border, this.size.x, this.size.y);

    for (var i = 0; i < this.options.length; i++) {
        var o = this.options[i],
            xPos = o.x + self.size.x,
            yPos = o.y + self.size.y;

        if (this.selectedIndex === i) {
            images.drawImage('selectionArrow', xPos, yPos);
            xPos += 5;
        }
        text.drawText(o.title, xPos, yPos);
    }
};


Menu.prototype.update = function (delta) {
    // process keys etc
    if (player.getState() !== player.states.INPUT) {
        return false;
    }

    if (input.keyDown('a_up', true)) {
        input.handleKey('a_up', true);
        this.selectedIndex--;
        sounds.playSound('MENU_MOVE');

    } else if (input.keyDown('a_down', true)) {
        input.handleKey('a_down', true);
        this.selectedIndex++;
        sounds.playSound('MENU_MOVE');

    } else if (input.keyDown('confirm', true)) {
        input.handleKey('confirm', true);

        var item = this.options[this.selectedIndex];
        if (item && item.action) {
            //sounds.playSound('MENU_SELECT');
            item.action();
        }

    } else if (input.keyDown('cancel', true)) {
        input.handleKey('cancel', true);

        if (this.parentMenu) {
            // go back to parent menu
        }
    }


    if (this.selectedIndex < 0) {
        this.selectedIndex = this.options.length - 1;
    }
    this.selectedIndex = this.selectedIndex % this.options.length;
};
