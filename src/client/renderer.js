/**
 * Created by john on 3/22/15.
 *
 * This module renders the view using Three.js
 */

'use strict';

var viewRenderer = module.exports = {
    getDimensions: function () {
        return {
            width: wWidth,
            height: wHeight,
            aspect: aspect
        };
    },
    getElement: function () {
        return domElement;
    },
    initialize: initialize,
    initializeMap: initializeMap,
    render: render,
    screenShake: screenShake,
    update: update,

    getNewObject: createNewPlane
};


viewRenderer.updateHud = function updateHud() {
    cnvText.needsUpdate = true;
};

var constants = {
    CAMERA_HEIGHT: -10, //-40
    FLOOR_HEIGHT: -100,
    MAP_HEIGHT: 0
};

var atlas = require('./map/atlas'),
    canvas = require('./canvas'),
    config = require('./config'),
    mapGeometry = require('./map/mapGeometry'),
    player = require('./player'),
    utils = require('./utils');


var CELL_SIZE = mapGeometry.cellSize;

var cnvText;

var shake = {
    duration: 0,
    magnitude: 0
};

var scale, wWidth, wHeight, aspect;

var scene, hudScene,
    camera, hudCam,
    hudMesh,
    renderer,
    domElement,
    playerLight;

var mesh, floor, ceiling;

var tileSize = CELL_SIZE,
    WIDTH = config.width,
    HEIGHT = config.height;


function initialize() {

    scale = Math.floor(window.innerHeight / HEIGHT);    // scale to the available vertical space
    wWidth = WIDTH * scale;
    wHeight = HEIGHT * scale;
    aspect = wWidth / wHeight;

    cnvText = new THREE.Texture(canvas.element);
    cnvText.needsUpdate = true;
    cnvText.minFilter = THREE.NearestFilter;
    cnvText.magFilter = THREE.NearestFilter;


    scene = new THREE.Scene();
    hudScene = new THREE.Scene();

    //camera = new THREE.PerspectiveCamera(75, aspect, 1, 10000);
    camera = new THREE.PerspectiveCamera(90, aspect, 1, 10000);
    camera.position.y = constants.CAMERA_HEIGHT;

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


    playerLight = new THREE.PointLight(0xaaaaaa);
    playerLight.castShadow = true;
    playerLight.shadowMapWidth = 128;
    playerLight.shadowMapHeight = 128;
    playerLight.shadowCameraNear = 1;
    playerLight.shadowCameraFar = 100; //XXX: That should be far enough.
    playerLight.shadowCameraFov = 90;
    playerLight.shadowDarkness = 0.75; //XXX: Can change later...
    playerLight.intensity = 2.5;
    playerLight.angle = Math.PI / 2;
    playerLight.distance = tileSize * 8;

    scene.add(camera);

    // add the light to the camera, so it always points in the same direction
    camera.add(playerLight);

}


function initializeMap() {
    clearScene();

    var geometry = mapGeometry.getMapGeometry(atlas.maps[0].data);

    mesh = geometry.mesh;
    floor = geometry.floor;
    ceiling = geometry.ceiling;

    scene.add(mesh);
    scene.add(floor);
    scene.add(ceiling);

    mesh.position.y = 0;

    renderer.render(scene, camera);
    renderer.render(hudScene, hudCam);

}


function update(delta) {
    camera.rotation.y = player.direction;

    camera.position.y = constants.CAMERA_HEIGHT;
    camera.position.z = tileSize * player.position.y;   // z-coord: fwd/back
    camera.position.x = tileSize * player.position.x;   // x-coord: left/right

    if (mesh) {
        mesh.position.y = constants.MAP_HEIGHT;
    }

    // screen shake
    if (shake.duration > 0) {

        camera.position.y += (Math.random() * shake.magnitude) - (shake.magnitude / 2);
        camera.position.x += (Math.random() * shake.magnitude) - (shake.magnitude / 2);
        camera.position.z += (Math.random() * shake.magnitude) - (shake.magnitude / 2);

        //if (mesh && floor) {
        //    var yAmt = (Math.random() * shake.magnitude) - (shake.magnitude / 2);
        //    mesh.position.y += yAmt;
        //    floor.position.y += yAmt;
        //    //camera.position.x += (Math.random() * shake.magnitude) - (shake.magnitude / 2);
        //    //camera.position.z += (Math.random() * shake.magnitude) - (shake.magnitude / 2);
        //}

        shake.duration--;
    }
}


function render() {

    renderer.render(scene, camera);
    renderer.render(hudScene, hudCam);
}


function clearScene() {
    // remove everything but the camera/light, since it was added as the first child
    for (var i = scene.children.length - 1; i > 0; i--) {
        scene.remove(scene.children[i]);
    }
}


function screenShake(duration, magnitude) {
    shake.magnitude = magnitude || 10;
    shake.duration = duration;
}


function createNewPlane() {
    function PlaneObject() {
        var width = config.width;
        var height = config.height;
        var cellSize = CELL_SIZE;

        var cnv = document.createElement('canvas');
        cnv.width = width;
        cnv.height = height;

        this.context = cnv.getContext("2d");
        this.dispose = function () {
            scene.remove(plane);
            plane.geometry.dispose();
            plane.material.dispose();
        };
        this.needsUpdate = function () {
            cText.needsUpdate = true;
        };


        var cText = new THREE.Texture(cnv);
        cText.needsUpdate = true;
        cText.minFilter = THREE.NearestFilter;
        cText.magFilter = THREE.NearestFilter;


        var texture = require('./textures').getTexture('floor');
        texture.minFilter = THREE.NearestFilter;
        texture.magFilter = THREE.NearestFilter;

        texture.needsUpdate = true;

        //var material = new THREE.MeshLambertMaterial({map: texture, doubleSided: true, side: THREE.DoubleSide});
        var material = new THREE.MeshBasicMaterial({
            map: cText, doubleSided: true, side: THREE.DoubleSide, color: 0xffffff,
            transparent: true
        });
        var geometryPlane = new THREE.PlaneBufferGeometry(width, height);
        var plane = new THREE.Mesh(geometryPlane, material);

        // makes it face the same direction as the player
        var vect = require('./utils').directionToVector(player.direction);

        plane.rotation.y = player.direction;
        plane.position.y = 0;    // center is at 0, height is 200
        plane.position.x = (player.position.x * cellSize) + (-vect.x * cellSize / 2);
        plane.position.z = (player.position.y * cellSize) + (-vect.y * cellSize / 2);

        scene.add(plane);

    }

    return new PlaneObject();
}