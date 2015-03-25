/**
 * Created by john on 3/22/15.
 */

'use strict';

var textureCount = 0;
var textures = {
    wall: THREE.ImageUtils.loadTexture('/images/walltexture.png', {}, function () {
        textureCount++;
    }),
    floor: THREE.ImageUtils.loadTexture('/images/floortexture.png', {}, function () {
        textureCount++;
    })
};

module.exports = {
    loadTextures: loadTextures,
    getMapGeometry: getMapGeometry,
    getMapMesh: getMapMesh
};


function loadTextures() {
    return (textureCount === Object.keys(textures).length);
}


function transx(geo, n) {
    for (var i = 0; i < geo.vertices.length; i++) {
        geo.vertices[i].x += n;
    }
}

/**
 * Translate all points in a geometry `n` units in the z direction.
 */
function transz(geo, n) {
    for (var i = 0; i < geo.vertices.length; i++) {
        geo.vertices[i].z += n;
    }
}


function getMapGeometry(map) {
    return {
        mesh: getMapMesh(map),
        floor: getFloor(map)
    };
}

function getMapMesh(map) {
    var geometry, material, mesh;
    var img = textures.wall;
    img.minFilter = THREE.NearestFilter;
    img.magFilter = THREE.NearestFilter;


    geometry = new THREE.BoxGeometry(200, 200, 200);
    material = new THREE.MeshLambertMaterial({color: 0xaabbaa, wireframe: false, map: img});


    for (var j = 0; j < map.length; j++) {
        for (var i = 0; i < map[j].length; i++) {

            if (map[j][i] === 1) {
                var tmp = new THREE.BoxGeometry(200, 200, 200);
                transx(tmp, i * 200);
                transz(tmp, j * 200);
                console.log('i=' + i + ', j=' + j);

                geometry.merge(tmp);
            }

        }
    }

    mesh = new THREE.Mesh(geometry, material);
    return mesh;
}


function getFloor(map) {

    var width = map[0].length;
    var height = map.length;
    var cellSize = 200;

    var texture = textures.floor;
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    texture.repeat.set(width * 2, height * 2);
    texture.needsUpdate = true;

    var material = new THREE.MeshPhongMaterial({map: texture, doubleSided: true, side: THREE.DoubleSide});
    var geometryPlane = new THREE.PlaneBufferGeometry(width * 2 * cellSize, height * 2 * cellSize);
    var plane = new THREE.Mesh(geometryPlane, material);

    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -100;    // center is at 0, height is 200
    plane.position.x = 0;
    plane.position.z = 0;

    return plane;
}