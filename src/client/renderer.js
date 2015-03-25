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
    'initializeMap': initializeMap,
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
var playerLight;

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


    hudMesh = new THREE.Mesh(planeGeom, textMater);
    hudMesh.lookAt(hudCam.position); // Rotate the mesh so the face is fully visible by the camera
    hudScene.add(hudMesh);

    renderer = new THREE.WebGLRenderer({antialiasing: false});


    renderer.setSize(wWidth, wHeight);
    renderer.setClearColor(0x0088FF, 1);
    renderer.autoClear = false;

    domElement = renderer.domElement;
}

function initializeMap() {
    var geometry = mapGeometry.getMapGeometry(atlas.maps[0].data);
    var mesh = geometry.mesh;
    var floor = geometry.floor;
    scene.add(mesh);
    scene.add(floor);


    playerLight = new THREE.PointLight(0xaaaaaa);
    playerLight.castShadow = false;
    playerLight.shadowMapWidth = 128;
    playerLight.shadowMapHeight = 128;
    playerLight.shadowCameraNear = 1;
    playerLight.shadowCameraFar = 100; //XXX: That should be far enough.
    playerLight.shadowCameraFov = 90;
    playerLight.shadowDarkness = 0.75; //XXX: Can change later...
    playerLight.intensity = 2.5;
    //playerLight.exponent = 20;
    playerLight.angle = Math.PI / 3;
    playerLight.distance = 200 * 10;

    //scene.add(playerLight);

    scene.add(camera);
    camera.add(playerLight);

    renderer.render(scene, camera);
    renderer.render(hudScene, hudCam);

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