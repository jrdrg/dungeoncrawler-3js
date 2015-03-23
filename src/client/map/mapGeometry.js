/**
 * Created by john on 3/22/15.
 */

'use strict';

module.exports = {
    'getMapMesh': getMapMesh
};


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

//
//var map = [
//    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
//    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
//    [1, 1, 0, 1, 0, 1, 0, 0, 0, 1],
//    [1, 0, 1, 1, 0, 0, 1, 0, 0, 1],
//    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
//    [1, 0, 0, 0, 1, 1, 1, 0, 0, 1],
//    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
//    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
//    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
//    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
//    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
//    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
//    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//];


function getMapMesh(map) {
    var geometry, material, mesh;
    var img = THREE.ImageUtils.loadTexture('/images/walltexture.png');
    img.minFilter = THREE.NearestFilter;
    img.magFilter = THREE.NearestFilter;


    geometry = new THREE.BoxGeometry(200, 200, 200);
    material = new THREE.MeshBasicMaterial({color: 0xaabbaa, wireframe: false, map: img});


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