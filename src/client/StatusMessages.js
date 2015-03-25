/**
 * Created by john on 3/24/15.
 */

'use strict';


function StatusMessages(maxMessages) {

    var self = this;

    this.add = add;
    this.messages = [];

    function add(msg) {
        self.messages.push(msg);
        if (self.messages.length > maxMessages) {
            self.messages.shift();
        }
    }
}


module.exports = StatusMessages;