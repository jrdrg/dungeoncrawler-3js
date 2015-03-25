/**
 * Created by john on 3/22/15.
 */


var express = require('express');
var bodyParser = require('body-parser');
//var characters = require('./src/server/api/characterRepository');
var font = require('./src/server/fontLoader');

var app = express();

app.use(bodyParser.json({}));
app.use('/public', express.static(__dirname + '/public'));
app.use('/partials', express.static(__dirname + '/views/partials'));
app.use('/images', express.static(__dirname + '/images'));
app.use('/sounds', express.static(__dirname + '/sounds'));


app.get('/font/:font', function (req, res) {
    var fnt = req.params.font;
    res.send(font.getFont(fnt));
});

app.get('/fontImage/:font', function (req, res) {
    var fnt = req.params.font;
    res.sendFile('/font/' + fnt + '.png', {root: __dirname});
});


app.all('/*', function (req, res, next) {

    // Sends the index.html for other files to support HTML5Mode
    res.sendFile('/index.html', {root: __dirname});
});


var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 13098;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP;

console.log("Listening on port " + port + ", ip=" + server_ip_address);

app.listen(port, server_ip_address);
