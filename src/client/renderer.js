/**
 * Created by john on 3/22/15.
 *
 * This module renders the view using Three.js
 */

'use strict';

var viewRenderer = module.exports = {
    'getElement': function () {
        return domElement;
    },
    'initialize': initialize,
    'render': render,
    'update': update
};


viewRenderer.updateHud = function updateHud() {
    cnvText.needsUpdate = true;
};


var atlas = require('./map/atlas'),
    canvas = require('./canvas'),
    config = require('./config'),
    player = require('./player');


var cnvText;


var mapGeometry = require('./map/mapGeometry');
var hudMesh;
var scene, hudScene;
var camera, hudCam;
var renderer;
var domElement;

var tileSize = 200,
    WIDTH = config.width,
    HEIGHT = config.height;


function initialize() {

    var scale = Math.floor(window.innerHeight / HEIGHT);    // scale to the available vertical space

    var wWidth = WIDTH * scale,
        wHeight = HEIGHT * scale,
        aspect = wWidth / wHeight;

    var context = canvas.context;

    context.fillStyle = 'rgb(100,50,150)';

    context.fillStyle = 'rgb(50, 50, 75)';
    //context.fillRect(5, 180, 310, 60);

    context.fillStyle = 'rgb(250, 50, 200)';
    context.fillRect(3, 80, 1, 5);


    cnvText = new THREE.Texture(canvas.element);
    cnvText.needsUpdate = true;
    cnvText.minFilter = THREE.NearestFilter;
    cnvText.magFilter = THREE.NearestFilter;

    //var img = new Image();
    //img.onload = function () {
    //    context.drawImage(img, 0, 0, 128, 128);
    //
    //    context.fillStyle = 'rgb(50, 50, 75)';
    //    context.fillRect(5, 180, 310, 60);
    //    cnvText.needsUpdate = true;
    //};
    //img.src = '/fontImage/roses';


    scene = new THREE.Scene();
    hudScene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(80, aspect, 1, 10000);
    camera.position.y = -20;

    var width = wWidth;
    var height = wHeight;

    hudCam = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 10000);
    hudCam.position.z = 100;

    var planeGeom = new THREE.PlaneBufferGeometry(wWidth, wHeight);
    var textMater = new THREE.MeshBasicMaterial({
        map: cnvText,
        color: 0xffffff,
        transparent: true
    });


    var mesh = mapGeometry.getMapMesh(atlas.maps[0].data);

    hudMesh = new THREE.Mesh(planeGeom, textMater);


    scene.add(mesh);

    hudMesh.lookAt(hudCam.position); // Rotate the mesh so the face is fully visible by the camera
    hudScene.add(hudMesh);

    renderer = new THREE.WebGLRenderer({antialiasing: false});


    renderer.setSize(wWidth, wHeight);
    renderer.setClearColor(0x0088FF, 1);
    renderer.autoClear = false;

    renderer.render(scene, camera);
    renderer.render(hudScene, hudCam);

    //document.body.appendChild(renderer.domElement);
    domElement = renderer.domElement;
}


function update(delta) {

    camera.rotation.y = player.direction;
    camera.position.z = tileSize * player.position.y;   // z-coord: fwd/back
    camera.position.x = tileSize * player.position.x;   // x-coord: left/right
}


function render() {

    renderer.render(scene, camera);
    renderer.render(hudScene, hudCam);
}