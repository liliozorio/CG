import * as THREE from 'three';
import {
    setDefaultMaterial,
} from "../libs/util/util.js";
import {checkCollisions,
} from './check.js';
import { CSG } from '../libs/other/CSGMesh.js'
import {
    loadGLTFFile,
} from './import_object.js'
import { CompressedTextureLoader } from '../build/three.module.js';
// CREATE PLANE
export function createGroundPlaneXZ(p, widthSegments = 10, heightSegments = 10, gcolor = null) {
    //cif (!gcolor) gcolor = "rgb(210,180,140)";
    let planeGeometry = new THREE.PlaneGeometry(p.w + 1, p.h + 1, widthSegments, heightSegments);
    let planeMaterial = new THREE.MeshLambertMaterial({ color: gcolor, side: THREE.DoubleSide });

    //adicionatextura
    var textureLoader = new THREE.TextureLoader();
    var floorTexture = textureLoader.load(`./textures/${p.textureName}`);

    planeMaterial.map = floorTexture;
    planeMaterial.map.wrapS = THREE.RepeatWrapping;
    planeMaterial.map.wrapT = THREE.RepeatWrapping;
    planeMaterial.map.repeat.set(p.w/0.8, p.h/0.8);


    let mat4 = new THREE.Matrix4();
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    plane.matrixAutoUpdate = false;
    plane.matrix.identity();

    plane.matrix.multiply(mat4.makeTranslation(p.x, p.y, p.z));
    var plano_rad = THREE.MathUtils.degToRad(90);
    plane.matrix.multiply(mat4.makeRotationX((plano_rad)));

    return plane;
}

// CREATE EDGES
export function makeEdges(coor, sizeX, sizeZ, dif, q, bbcube, cubeS, scene, textureName) {
    let cubeGeometry = new THREE.BoxGeometry(1, 1.5, 1);
    let aux1 = (coor.x + sizeX / 2);
    let aux2 = (coor.z + sizeZ / 2);
    let materialEmissive = new THREE.MeshLambertMaterial(); //lambert?
    materialEmissive.emissive.set()
    var textureLoader = new THREE.TextureLoader();
    var floorTexture = textureLoader.load(`./textures/${textureName}`);
    //adicionatextura
    materialEmissive.map = floorTexture;

    if (q.f1 != -1)
        for (let x = coor.x; x <= (coor.x + sizeX); x += 1.1) {
            if (q.f1 && x >= aux1 - dif && x <= aux1 + dif) {
                x = aux1 + 2.5;
                continue;
            }
            let cube = new THREE.Mesh(cubeGeometry, materialEmissive);
            cube.position.set(x, coor.y, coor.z);
            cube.receiveShadow = true;
            cube.castShadow = true;
            bbcube.push(new THREE.Box3().setFromObject(cube));
            cubeS.push(cube);
            scene.add(cube);
        }
    if (q.f2 != -1)
        for (let x = coor.x; x <= (coor.x + sizeX); x += 1.1) {
            if (q.f2 && x >= aux1 - dif && x <= aux1 + dif) {
                x = aux1 + 2.5;
                continue;
            }
            let cube = new THREE.Mesh(cubeGeometry, materialEmissive);
            cube.position.set(x, coor.y, coor.z + sizeZ);
            cube.receiveShadow = true;
            cube.castShadow = true;
            bbcube.push(new THREE.Box3().setFromObject(cube));
            cubeS.push(cube);
            scene.add(cube);
        }
    if (q.f3 != -1)
        for (let z = coor.z; z <= coor.z + sizeZ; z += 1.1) {
            if (q.f3 && z >= aux2 - dif && z <= aux2 + dif) {
                z = aux2 + 2.5;
                continue;
            }
            let cube = new THREE.Mesh(cubeGeometry, materialEmissive);
            cube.position.set(coor.x, coor.y, z);
            cube.receiveShadow = true;
            cube.castShadow = true;
            bbcube.push(new THREE.Box3().setFromObject(cube));
            cubeS.push(cube);
            scene.add(cube);
        }
    if (q.f4 != -1)
        for (let z = coor.z; z <= coor.z + sizeZ; z += 1.1) {
            if (q.f4 && z >= aux2 - dif && z <= aux2 + dif) {
                z = aux2 + 2.5;
                continue;
            }
            let cube = new THREE.Mesh(cubeGeometry, materialEmissive);
            cube.position.set(coor.x + sizeX, coor.y, z);
            cube.receiveShadow = true;
            cube.castShadow = true;
            bbcube.push(new THREE.Box3().setFromObject(cube));
            cubeS.push(cube);
            scene.add(cube);
        }
}

// CREATE A INVISIBLE PONTE
export function invisibleWay(p, size_obstacle, size_tile, blockElevationValue, invisibleWayBlocks, bbcube) {
    let c = new THREE.BoxGeometry(size_obstacle, size_obstacle, size_obstacle);
    let m = setDefaultMaterial("rgb(222,184,135)");
    for (let x = p.x1; x <= p.x2; x += (size_tile * 1.08)) {
        for (let z = p.z1; z <= p.z2; z += (size_tile * 1.08)) {
            let cube = new THREE.Mesh(c, m);
            cube.position.set(x, p.y + 0.65 + blockElevationValue, z);
            invisibleWayBlocks.cube.push(cube);
            bbcube.push(new THREE.Box3().setFromObject(cube));
            invisibleWayBlocks.box.push(bbcube[bbcube.length - 1]);
            invisibleWayBlocks.selected.push(false);
        }
    }
}

//CREATE BLOCKS IN RANDOM POSITION
export function randomCube(p, numB, size_obstacle, available_space, bbcube, cubeS, scene) {
    let randomCoordinate = () => Math.floor((Math.random() * available_space) - available_space / 2)
    let randomCoordinate2 = () => (Math.random() * available_space) - available_space / 2
    let chooseCoordenate = () => Math.random()

    let c = new THREE.BoxGeometry(size_obstacle, size_obstacle, size_obstacle);
    let aux = {
        object: null,
        bb: new THREE.Box3()
    }
    for (let i = 0; i < numB; i++) {
        let x;
        let z;
        if (chooseCoordenate() < 0.5) {
            x = p.x1 + Math.abs(randomCoordinate2(Math.abs(p.x1 - p.x2))) + 1;
            z = p.z1 + Math.abs(randomCoordinate(Math.abs(p.z1 - p.z2))) + 1;

        } else {
            x = p.x1 + Math.abs(randomCoordinate(Math.abs(p.x1 - p.x2))) + 1;
            z = p.z1 + Math.abs(randomCoordinate2(Math.abs(p.z1 - p.z2))) + 1;
        }
        let m = setDefaultMaterial("rgb(222,184,135)");
        let cube = new THREE.Mesh(c, m);
        cube.position.set(x, p.y + 0.4, z);
        cube.receiveShadow = true;
        cube.castShadow = true;
        aux.object = cube;
        aux.bb = new THREE.Box3().setFromObject(cube);

        if ((!checkCollisions(bbcube, aux))) {
            cube.name = "randomCube";
            bbcube.push(new THREE.Box3().setFromObject(cube));
            cubeS.push(cube);
            scene.add(cube);
        } else {
            cube.remove();
            i--;
        }
    }
}

export function randomGLTF(p, numB, size_obstacle, available_space, bbcube, cubeS, scene, bbBox, id_key, mixer) {
    let randomCoordinate = () => Math.floor((Math.random() * available_space) - available_space / 2)
    let randomCoordinate2 = () => (Math.random() * available_space) - available_space / 2
    let chooseCoordenate = () => Math.random()
    let aux_bbBox = [];
    
    for (let i = 0; i < numB; i++) {
        let assetT = {
            object: null,
            loaded: false,
            bb: new THREE.Box3(),
            obj3D: new THREE.Object3D(),
            selected: false
        }
        let x;
        let z;
        if (chooseCoordenate() < 0.5) {
            x = p.x1 + Math.abs(randomCoordinate2(Math.abs(p.x1 - p.x2))) + 1;
            z = p.z1 + Math.abs(randomCoordinate(Math.abs(p.z1 - p.z2))) + 1;

        } else {
            x = p.x1 + Math.abs(randomCoordinate(Math.abs(p.x1 - p.x2))) + 1;
            z = p.z1 + Math.abs(randomCoordinate2(Math.abs(p.z1 - p.z2))) + 1;
        }

        
        
        loadGLTFFile(assetT, './asset/redFox.glb', true, x, p.y - 0.14, z, '', false, null, scene, [], id_key, mixer, true);
        aux_bbBox.push(assetT);
    }
    return aux_bbBox;
}
// CREATE PORTAL
export function makePortal(rgb) {
    let cube1 = new THREE.Mesh(new THREE.BoxGeometry(6, 6, 1));
    let cube2 = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 1));
    let cylinder = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 1, 32));

    cube2.position.set(0, -1, 0);
    cube2.matrixAutoUpdate = false;
    cube2.updateMatrix();

    cylinder.position.set(0, 0.7, 0);
    cylinder.rotateX(THREE.MathUtils.degToRad(90))
    cylinder.matrixAutoUpdate = false;
    cylinder.updateMatrix();

    let cubeCSG1 = CSG.fromMesh(cube1);
    let cubeCSG2 = CSG.fromMesh(cube2);
    let sphereCSG = CSG.fromMesh(cylinder);
    let csgObject = cubeCSG1.subtract(cubeCSG2);
    csgObject = csgObject.subtract(sphereCSG);
    let csgFinal = CSG.toMesh(csgObject, new THREE.Matrix4());
    csgFinal.material = new THREE.MeshLambertMaterial();
    csgFinal.material.emissive.set()

    //adicionatextura
    var textureLoader = new THREE.TextureLoader();
    var floorTexture = textureLoader.load(`./textures/brickPortal.jpg`);
    csgFinal.material.map = floorTexture;
    return csgFinal;
}

// MAKE BLOCK COLISSION TO MAN IN PORTAL
export function makeHiddenCube(x, y, z, bbcube, cubeS, scene) {
    let material = setDefaultMaterial("rgb(205,133,63)");
    let cubeGeometry = new THREE.BoxGeometry(0.8, 3, 0.8);
    let hiddenCube = new THREE.Mesh(cubeGeometry, material);
    hiddenCube.position.set(x, y, z);
    bbcube.push(new THREE.Box3().setFromObject(hiddenCube));
    cubeS.push(hiddenCube)
    scene.add(hiddenCube);
}

// CREATE DOOR
export function makeDoor(rgb) {
    let cube2 = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 0.5));
    let cylinder = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 0.5, 32));

    cube2.position.set(0, -1, 0);
    cube2.matrixAutoUpdate = false;
    cube2.updateMatrix();

    cylinder.position.set(0, 0.7, 0);
    cylinder.rotateX(THREE.MathUtils.degToRad(90))
    cylinder.matrixAutoUpdate = false;
    cylinder.updateMatrix();

    let cubeCSG2 = CSG.fromMesh(cube2);
    let sphereCSG = CSG.fromMesh(cylinder);
    let csgObject = cubeCSG2.union(sphereCSG);
    let csgFinal = CSG.toMesh(csgObject, new THREE.Matrix4());
    csgFinal.material = new THREE.MeshPhongMaterial({ color: rgb });
    csgFinal.material.emissive.set(rgb)
    return csgFinal;
}

// MAKE STAIRS
export function makeStairs(rgb) {
    let stairs = {
        object: null,
        inclinacao: null
    }
    let cube = new THREE.Mesh(new THREE.BoxGeometry(6, 3, 6));
    let rectangle = new THREE.Mesh(new THREE.BoxGeometry(7, 0.25, 0.5));
    cube.position.set(0, 1.5, 0)
    cube.matrixAutoUpdate = false;
    cube.updateMatrix();

    let cubeCSG = CSG.fromMesh(cube);
    let rectangleCSG = CSG.fromMesh(rectangle);
    let csgObject;
    let z = -2.25, y = 2.88;
    for (let aux = 2.88; aux >= 0; aux -= 0.25) {
        for (let y = 2.88; y >= aux; y -= 0.25) {
            rectangle.position.set(0, y, z)
            rectangle.matrixAutoUpdate = false;
            rectangle.updateMatrix();
            rectangleCSG = CSG.fromMesh(rectangle);
            if (csgObject == undefined) {
                csgObject = cubeCSG.subtract(rectangleCSG);
            }
            else {
                csgObject = csgObject.subtract(rectangleCSG);
            }
        }
        z += 0.5
    }
    let csgFinal = CSG.toMesh(csgObject, new THREE.Matrix4());
    csgFinal.material = new THREE.MeshPhongMaterial({ color: rgb });
    stairs.object = csgFinal;
    return stairs;
}