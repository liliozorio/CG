import * as THREE from 'three';
import KeyboardState from '../libs/util/KeyboardState.js'
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '../build/jsm/loaders/GLTFLoader.js'
import {
    initRenderer,
    SecondaryBox,
    initCamera,
    initDefaultBasicLight,
    setDefaultMaterial,
    getMaxSize,
    onWindowResize
} from "../libs/util/util.js";

const bbcube = [];

let scene, renderer, camera, material, light, keyboard, orthographic, anguloY;
anguloY = 0;
orthographic = true;
scene = new THREE.Scene();
renderer = initRenderer();

var lookAtVec = new THREE.Vector3(0.0, 0.0, 0.0);
var camPosition = new THREE.Vector3(0, 8, 12.5);
var upVec = new THREE.Vector3(0.0, 1.0, 0.0);
var s = 105;
camera = new THREE.OrthographicCamera(-window.innerWidth / s, window.innerWidth / s,
    window.innerHeight / s, window.innerHeight / -s, -s, s);

camera.position.copy(camPosition);
camera.up.copy(upVec);
camera.lookAt(lookAtVec);

let cameraholder = new THREE.Object3D();
cameraholder.add(camera);
scene.add(cameraholder);

material = setDefaultMaterial("rgb(205,133,63)");
light = initDefaultBasicLight(scene);

keyboard = new KeyboardState();
var clock = new THREE.Clock();

window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

const SIZE_PLANE = 60;
const SIZE_TILE = 0.8;
const NUM_CUBES = 200;
const SIZE_OBSTACLE = 1
const AVAILABLE_SPACE = SIZE_PLANE - 4;

let plane = createGroundPlaneXZ(SIZE_PLANE + 55, SIZE_PLANE + 55);
scene.add(plane);

let cubeGeometry = new THREE.BoxGeometry(SIZE_TILE, 0.01, SIZE_TILE);
let cubeGeometry2 = new THREE.BoxGeometry(2, 2, 2);
let material1 = setDefaultMaterial("rgb(255,222,173)");

var playAction;
var mixer = new Array();

let asset = {
    object: null,
    loaded: false,
    bb: new THREE.Box3()
}

let asset2 = {
    object: null,
    loaded: false,
    bb: new THREE.Box3()
}

loadGLTFFile(asset, '../assets/objects/walkingMan.glb', true);
loadGLTFFile(asset2, '../assets/objects/walkingMan.glb', false);

makeFloor();
makeEdgeX(-SIZE_PLANE / 2, -SIZE_PLANE / 2);
makeEdgeX(-SIZE_PLANE / 2, SIZE_PLANE / 2);
makeEdgeZ(-SIZE_PLANE / 2, -SIZE_PLANE / 2);
makeEdgeZ(SIZE_PLANE / 2, -SIZE_PLANE / 2);


// CREATE PLANE
function createGroundPlaneXZ(width, height, widthSegments = 10, heightSegments = 10, gcolor = null) {
    if (!gcolor) gcolor = "rgb(210,180,140)";
    let planeGeometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
    let planeMaterial = new THREE.MeshLambertMaterial({ color: gcolor, side: THREE.DoubleSide });

    let mat4 = new THREE.Matrix4();
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    plane.matrixAutoUpdate = false;
    plane.matrix.identity();

    plane.matrix.multiply(mat4.makeTranslation(0.0, -0.1, 0.0));
    var plano_rad = THREE.MathUtils.degToRad(90);
    plane.matrix.multiply(mat4.makeRotationX((plano_rad)));

    return plane;
}

// CRIA CHÃO
function makeFloor() {
    for (let x = -SIZE_PLANE / 2; x <= SIZE_PLANE / 2; x += (SIZE_TILE * 1.08)) {
        for (let z = -SIZE_PLANE / 2; z <= SIZE_PLANE / 2; z += (SIZE_TILE * 1.08)) {
            let cube = new THREE.Mesh(cubeGeometry, material1);
            cube.position.set(x, 0.05, z);
            scene.add(cube);
        }
    }
}

// CRIA BORDAS PARALELAS AO EIXO X
function makeEdgeX(x, z) {
    for (; x <= SIZE_PLANE / 2; x += 2.1) {
        let cube = new THREE.Mesh(cubeGeometry2, material);
        cube.position.set(x, 1, z);
        bbcube.push(new THREE.Box3().setFromObject(cube));
        scene.add(cube);
    }
}

// CRIA BORDAS PARALELAS AO EIXO Z
function makeEdgeZ(x, z) {
    for (; z <= SIZE_PLANE / 2; z += 2.1) {
        let cube = new THREE.Mesh(cubeGeometry2, material);
        cube.position.set(x, 1, z);
        bbcube.push(new THREE.Box3().setFromObject(cube));
        scene.add(cube);
    }
}

let randomCoordinate = () => Math.floor((Math.random() * AVAILABLE_SPACE) - AVAILABLE_SPACE / 2)

let randomCoordinate2 = () => (Math.random() * AVAILABLE_SPACE) - AVAILABLE_SPACE / 2

let chooseCoordenate = () => Math.random()

function randomCube() {
    let c = new THREE.BoxGeometry(SIZE_OBSTACLE, SIZE_OBSTACLE, SIZE_OBSTACLE);
    let aux = {
        object: null,
        bb: new THREE.Box3()
    }
    for (let i = 0; i < NUM_CUBES; i++) {
        let x;
        let z;
        if (chooseCoordenate() < 0.5) {

            x = randomCoordinate2();
            z = randomCoordinate();
        } else {
            x = randomCoordinate();
            z = randomCoordinate2();
        }
        let m = setDefaultMaterial("rgb(222,184,135)");
        let cube = new THREE.Mesh(c, m);

        cube.position.set(x, 0.6, z);

        aux.object = cube;
        aux.bb = new THREE.Box3().setFromObject(cube)

        if (!checkCollisions(bbcube, asset2) && !checkCollisions(bbcube, aux)) {
            bbcube.push(new THREE.Box3().setFromObject(cube));
            cube.name = "randomCube";
            scene.add(cube);
        }
        else {
            cube.remove();
        }
    }
}

randomCube()

// INICIALIZA PERSONEGEM
function loadGLTFFile(asset, file, add_scene) {
    var loader = new GLTFLoader();
    loader.load(file, function (gltf) {
        var obj = gltf.scene;
        obj.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
            }
        });
        obj = normalizeAndRescale(obj, 2);
        obj.updateMatrixWorld(true);
        if (add_scene) {
            scene.add(obj);
        }
        asset.object = gltf.scene;
        var mixerLocal = new THREE.AnimationMixer(obj);
        mixerLocal.clipAction(gltf.animations[0]).play();
        mixer.push(mixerLocal);
    }, () => { }, () => { });
}

// AJUSTA AS ESCALAS
function normalizeAndRescale(obj, newScale) {
    var scale = getMaxSize(obj);
    obj.scale.set(newScale * (1.0 / scale),
        newScale * (1.0 / scale),
        newScale * (1.0 / scale));
    return obj;
}

// GERA O MOVIMENTO DO PERSONAGEM
function movimentation(angulo_max, camX, camZ, walkZ, walkX, walkZ_hide, walkX_hide) {
    if (anguloY < angulo_max) {
        while (anguloY < angulo_max) {
            anguloY = anguloY + 1;
            var rad = THREE.MathUtils.degToRad(1);
            asset.object.rotateY(rad);
            asset2.object.rotateY(rad);
        }
    }
    if (anguloY > angulo_max) {
        while (anguloY > angulo_max) {
            anguloY = anguloY - 1;
            var rad = THREE.MathUtils.degToRad(-1);
            asset.object.rotateY(rad);
            asset2.object.rotateY(rad);
        }
    }
    cameraholder.translateX(camX);
    cameraholder.translateZ(camZ);
    asset.object.translateZ(walkZ);
    asset.object.translateX(walkX);
    asset2.object.translateZ(walkZ_hide);
    asset2.object.translateX(walkX_hide);
    asset.bb.setFromObject(asset.object);
    asset2.bb.setFromObject(asset2.object);
}

// TRATA OS MOVIMENTOS COM COLISÃO DO PERSONAGEM
function movimentation_colision(angulo_max, camX, camZ, walkZ, walkX, walkZ_hide, walkX_hide) {
    playAction = true;
    var collision = checkCollisions(bbcube, asset)
    if (!collision) {
        movimentation(angulo_max, camX, camZ, walkZ, walkX, walkZ_hide, walkX_hide);
    }
    else {
        movimentation(angulo_max, 0, 0, 0, 0, walkZ_hide, -0.6);
        collision = checkCollisions(bbcube, asset2);
        if (collision) {
            movimentation(angulo_max, 0, 0, 0, 0, -walkZ_hide, 0.6);
            asset2.bb.setFromObject(asset2.object);
            movimentation(angulo_max, 0, 0, 0, 0, walkZ_hide, 0.6);
            collision = checkCollisions(bbcube, asset2);
            if (collision) {
                movimentation(angulo_max, 0, 0, 0, 0, -walkZ_hide, -0.6);
                asset2.bb.setFromObject(asset2.object);
            }
            else {
                movimentation(angulo_max, camX, camZ, walkZ, walkX, 0, -0.6);
            }
        }
        else {
            movimentation(angulo_max, camX, camZ, walkZ, walkX, 0, 0.6);
        }
    }
    return collision;
}

// COMANDOS DO TECLADO
function keyboardUpdate() {
    let aux_collision;
    keyboard.update()
    if (keyboard.pressed("A") && keyboard.pressed("S") || keyboard.pressed("left") && keyboard.pressed("down")) {
        //aux_collision = movimentation_colision(315, -(Math.sqrt(0.005, 2)), (Math.sqrt(0.005, 2)), 0.1, 0, 0.1, 0);
        //if (aux_collision) {
        movimentation_colision(270, -0.0707, 0, 0.0707, 0, 0.0707, 0);
        movimentation_colision(0, 0, 0.0707, 0.0707, 0, 0.0707, 0);
        movimentation_colision(315, 0, 0, 0, 0, 0, 0);
        //}
    }
    else if (keyboard.pressed("A") && keyboard.pressed("W") || keyboard.pressed("left") && keyboard.pressed("up")) {

        //aux_collision = movimentation_colision(225, -(Math.sqrt(0.005, 2)), -(Math.sqrt(0.005, 2)), 0.1, 0, 0.1, 0);
        //if (aux_collision) {
        movimentation_colision(270, -0.0707, 0, 0.0707, 0, 0.0707, 0);
        movimentation_colision(180, 0, -0.0707, 0.0707, 0, 0.0707, 0);
        movimentation_colision(225, 0, 0, 0, 0, 0, 0);
        //}

    }
    else if (keyboard.pressed("D") && keyboard.pressed("S") || keyboard.pressed("right") && keyboard.pressed("down")) {
        //aux_collision = movimentation_colision(45, (Math.sqrt(0.005, 2)), (Math.sqrt(0.005, 2)), 0.1, 0, 0.1, 0);
        //if (aux_collision) {
        movimentation_colision(0, 0, 0.0707, 0.0707, 0, 0.0707, 0);
        movimentation_colision(90, 0.0707, 0, 0.0707, 0, 0.0707, 0);
        movimentation_colision(45, 0, 0, 0, 0, 0, 0);
        //}
    }
    else if (keyboard.pressed("D") && keyboard.pressed("W") || keyboard.pressed("right") && keyboard.pressed("up")) {
        //aux_collision = movimentation_colision(135, (Math.sqrt(0.005, 2)), -(Math.sqrt(0.005, 2)), 0.1, 0, 0.1, 0);
        //if (aux_collision) {
        movimentation_colision(180, 0, -0.0707, 0.0707, 0, 0.0707, 0);
        movimentation_colision(90, 0.0707, 0, 0.0707, 0, 0.0707, 0);
        movimentation_colision(135, 0, 0, 0, 0, 0, 0);
        //}
    }
    else if (keyboard.pressed("A") || keyboard.pressed("left")) {
        movimentation_colision(270, -0.1, 0, 0.1, 0, 0.1, 0);
    }
    else if (keyboard.pressed("D") || keyboard.pressed("right")) {
        movimentation_colision(90, 0.1, 0, 0.1, 0, 0.1, 0);
    }
    else if (keyboard.pressed("S") || keyboard.pressed("down")) {
        movimentation_colision(0, 0, 0.1, 0.1, 0, 0.1, 0);
    }
    else if (keyboard.pressed("W") || keyboard.pressed("up")) {
        movimentation_colision(180, 0, -0.1, 0.1, 0, 0.1, 0);
    }
    else {
        playAction = false;
    }
    if (keyboard.down("C")) {
        if (orthographic) {
            camPosition = new THREE.Vector3(0, 9.5, 11.5);
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, s);
            camera.position.copy(camPosition);
            camera.up.copy(upVec);
            camera.lookAt(lookAtVec);

            cameraholder.add(camera);
            scene.add(cameraholder);
            orthographic = false;
        }
        else {
            camPosition = new THREE.Vector3(0, 10, 12.5);
            camera = new THREE.OrthographicCamera(-window.innerWidth / s, window.innerWidth / s,
                window.innerHeight / s, window.innerHeight / -s, -s, s);
            camera.position.copy(camPosition);
            camera.up.copy(upVec);
            camera.lookAt(lookAtVec);

            cameraholder.add(camera);
            scene.add(cameraholder);
            orthographic = true;
        }
    }
}

// CHECA SE EXISTE COLISÃO
function checkCollisions(object, man) {
    for (var i = 0; i < object.length; i++) {
        let collision = man.bb.intersectsBox(object[i]);
        if (collision) {
            return true;
        }
    }
    return false
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let click = false;
function clickElement(events) {
    pointer.x = (events.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (events.clientY / window.innerHeight) * 2 + 1;
    click = true;
}

let colors = ["rgb(222,184,135)", "rgb(165,42,42)"]
function render() {
    var delta = clock.getDelta();
    requestAnimationFrame(render);
    keyboardUpdate();
    renderer.render(scene, camera) // Render scene
    if (playAction) {
        for (var i = 0; i < mixer.length; i++)
            mixer[i].update(delta * 2);
    };
    if (click) {
        renderer.render(scene, camera);
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        if (intersects[0].object.name === "randomCube") {
            if (intersects[0].object.material.color.getHexString() == "deb887") {
                intersects[0].object.material.color.set(colors[1]);
            } else {
                intersects[0].object.material.color.set(colors[0]);
            }
        }
        click = false;
    }
}
window.addEventListener('click', clickElement);
render();