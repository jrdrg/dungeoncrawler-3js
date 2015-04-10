/**
 * Created by john on 3/22/15.
 */

'use strict';

var CELL_SIZE = 200;


module.exports = {
    cellSize: CELL_SIZE,
    getMapGeometry: getMapGeometry
};


var textures = require('../textures');

/**
 * Returns two meshes for the map itself and the floor
 * @param map
 * @returns {{mesh: *, floor: *}}
 */
function getMapGeometry(map) {
    return {
        mesh: getMapMesh(map),
        floor: getFloor(map),
        ceiling: getCeiling(map)
    };
}


/**
 * Translate all points in a geometry `n` units in the x direction.
 */
function transX(geo, n) {
    for (var i = 0; i < geo.vertices.length; i++) {
        geo.vertices[i].x += n;
    }
}

/**
 * Translate all points in a geometry `n` units in the z direction.
 */
function transZ(geo, n) {
    for (var i = 0; i < geo.vertices.length; i++) {
        geo.vertices[i].z += n;
    }
}


/**
 * Returns a mesh representing the floor of the current level.
 * @param map
 * @returns {THREE.Mesh}
 */
function getFloor(map) {

    var width = map[0].length;
    var height = map.length;
    var cellSize = CELL_SIZE;

    var texture = textures.getTexture('floor');
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    texture.repeat.set(width * 1, height * 1);
    texture.needsUpdate = true;

    var material = new THREE.MeshPhongMaterial({map: texture, doubleSided: true, side: THREE.DoubleSide});
    var geometryPlane = new THREE.PlaneBufferGeometry(width * 1 * cellSize, height * 1 * cellSize);
    var plane = new THREE.Mesh(geometryPlane, material);

    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -100;    // center is at 0, height is 200
    plane.position.x = (width / 2) * cellSize;
    plane.position.z = (height / 2) * cellSize;

    return plane;
}


function getCeiling(map) {
    var width = map[0].length;
    var height = map.length;
    var cellSize = CELL_SIZE;

    var texture = textures.getTexture('floor');
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    texture.repeat.set(width * 1, height * 1);
    texture.needsUpdate = true;

    var material = new THREE.MeshPhongMaterial({map: texture, doubleSided: true, side: THREE.DoubleSide});
    var geometryPlane = new THREE.PlaneBufferGeometry(width * 1 * cellSize, height * 1 * cellSize);
    var plane = new THREE.Mesh(geometryPlane, material);

    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 100;    // center is at 0, height is 200
    plane.position.x = (width / 2) * cellSize;
    plane.position.z = (height / 2) * cellSize;

    return plane;
}


/**
 * Returns a mesh representing the maze geometry of the current level.
 * @param map
 * @returns {THREE.Mesh}
 */
function getMapMesh(map) {
    var geometry, material, mesh;
    var img = textures.getTexture('wall');
    img.minFilter = THREE.NearestFilter;
    img.magFilter = THREE.NearestFilter;

    geometry = new THREE.BoxGeometry(CELL_SIZE, CELL_SIZE, CELL_SIZE);
    material = new THREE.MeshLambertMaterial({color: 0xaabbaa, wireframe: false, map: img});

    var height = map.length;
    var width = map[0].length;

    for (var j = 0; j < height; j++) {
        for (var i = 0; i < width; i++) {

            if (map[j][i] === 1) {
                var tmp = new THREE.BoxGeometry(CELL_SIZE, CELL_SIZE, CELL_SIZE);
                transX(tmp, i * CELL_SIZE);
                transZ(tmp, j * CELL_SIZE);

                geometry.merge(tmp);
            }

        }
    }

    mesh = new THREE.Mesh(geometry, material);
    return mesh;
}


