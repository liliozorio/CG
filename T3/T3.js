import * as THREE from 'three';
import KeyboardState from '../libs/util/KeyboardState.js'
import {
    initRenderer,
    setDefaultMaterial,
    getMaxSize,
    radiansToDegrees
} from "../libs/util/util.js";
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {
    checkCollisions,
    checkOpenDoorRoom,
    getColissionObjectId
} from './check.js'
import {
    createLightSwitch,
    onWindowResize,
    createChambers,
    insertPortal,
    insertStairs,
    makePlatforms,
    createBarrier,
    plataformsAreaFinal,
    cubesArea3
} from './scenery.js';
import {
    directionalLight,
    createAmbientLight,
    createSpotLight,
    spotLightM,
    iluminaMan,
    getIntensityEmissive,
    lightTrasition
} from './light.js';
import {
    loadGLTFFile,
} from './import_object.js'
import {
    movimentation_colision,
    movimentation_stairs
} from './movimentation.js';

import { trilhaSonora, effects, playSound } from './soundEffects.js';


const bbcube = [];
const cubeS = [];
const bbstairs = [];
const bbportal = [];
const ListEscadas = [];
const objectsArea3 = [];
const doors = { box: [], obj: [] };
const bbkey = [null, null, null];
const bbBox = [];
let get_key = [true, true, true, true];
const id_key = [null, null, null];
var clickeObjects = { object: undefined, floor: undefined, top: undefined, direction: "up" }
const invisibleWayBlocks = { box: [], cube: [], selected: [] };
const light_switch = [];
const spotLight_on = [];
var finalPlatform;
const blockElevationValue = 1.5;
var platforms = { object: [], box: [], pressed: [false, false, false] };
let scene, renderer, camera, material, light, keyboard, orthographic, anguloY, aux_anguloY;
anguloY = { Y: 0 };
orthographic = true;
scene = new THREE.Scene();
renderer = initRenderer();

let doorsSounds = [0, 1, 2, 3, 4, 5, 6]

var lookAtVec = new THREE.Vector3(0.0, 0.0, 0.0);
var camPosition = new THREE.Vector3(9, 6, -7);
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

var listener = new THREE.AudioListener();
camera.add(listener);


const trilha_sonora = trilhaSonora(listener);
const pegar_chave = effects("pegar_chave.mp3", listener);
const abrir_porta = effects("closing door.ogg", listener);
const acionar_plataforma = effects("plataforma.ogg", listener);
const monta_ponte = effects("monta_ponte.mp3", listener);
const fimjogo = effects("fimjogo.ogg", listener);


// GIRAR COM MOUSE
new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.

let ambientLight = createAmbientLight(scene)

let dirLight = directionalLight(cameraholder)


keyboard = new KeyboardState();
var clock = new THREE.Clock();

window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

const SIZE_PLANE = 40;
const SIZE_TILE = 0.8;
const NUM_CUBES = 0
const SIZE_OBSTACLE = 0.8;
const AVAILABLE_SPACE = SIZE_PLANE - 4;
const WALK_SIZE = 0.06;

var playAction = { play: null };
var mixer = new Array();

const lerpConfig = {
    destination: new THREE.Vector3(0.0, -1.0, 0.0),
    alpha: 0.01,
    move: true
}

let asset = {
    object: null,
    loaded: false,
    bb: new THREE.Box3(),
    obj3D: new THREE.Object3D()
}

let asset2 = {
    object: null,
    loaded: false,
    bb: new THREE.Box3(),
    obj3D: new THREE.Object3D()
}

let key1 = {
    object: null,
    loaded: false,
    bb: new THREE.Box3()
}

let key2 = {
    object: null,
    loaded: false,
    bb: new THREE.Box3()
}

let key3 = {
    object: null,
    loaded: false,
    bb: new THREE.Box3()
}

loadGLTFFile(asset, '../assets/objects/walkingMan.glb', true, 0, 0, 0, '', false, null, scene, bbkey, id_key, mixer);
loadGLTFFile(asset2, '../assets/objects/walkingMan.glb', false, 0, 0, 0, '', false, null, scene, bbkey, id_key, mixer);

loadGLTFFile(key1, './asset/key.glb', true, 0, -2, -77, "rgb(72,61,139)", true, 0, scene, bbkey, id_key, mixer);
loadGLTFFile(key2, './asset/key.glb', true, 0, 4, 72, "rgb(128,0,0)", true, 1, scene, bbkey, id_key, mixer);
loadGLTFFile(key3, './asset/key.glb', true, 80, -2, 0, "rgb(255,215,0)", true, 2, scene, bbkey, id_key, mixer);

onWindowResize(camera, renderer)

createLightSwitch(33, -1.26, 7.5, 6, scene, light_switch)
createLightSwitch(43, -1.26, 7.5, 6, scene, light_switch)
createLightSwitch(53, -1.26, 7.5, 6, scene, light_switch)
createLightSwitch(63, -1.26, 7.5, 6, scene, light_switch)
createLightSwitch(33, -1.26, -7.5, -6, scene, light_switch)
createLightSwitch(43, -1.26, -7.5, -6, scene, light_switch)
createLightSwitch(53, -1.26, -7.5, -6, scene, light_switch)
createLightSwitch(63, -1.26, -7.5, -6, scene, light_switch)

createSpotLight(33, 0, 5, scene, spotLight_on)
createSpotLight(43, 0, 5, scene, spotLight_on)
createSpotLight(53, 0, 5, scene, spotLight_on)
createSpotLight(63, 0, 5, scene, spotLight_on)
createSpotLight(33, 0, -5, scene, spotLight_on)
createSpotLight(43, 0, -5, scene, spotLight_on)
createSpotLight(53, 0, -5, scene, spotLight_on)
createSpotLight(63, 0, -5, scene, spotLight_on)
createSpotLight(80, 0, 0, scene, spotLight_on)

createChambers(SIZE_PLANE, SIZE_OBSTACLE, SIZE_TILE, AVAILABLE_SPACE, scene, bbcube, cubeS, bbBox, blockElevationValue, invisibleWayBlocks,id_key,mixer).forEach(
    returnedBox =>{
        bbBox.push(returnedBox);
    }
)
insertPortal(scene, bbcube, cubeS, bbportal, doors)

insertStairs(bbstairs, ListEscadas, scene, SIZE_PLANE);

makePlatforms({ x: -8, y: 3.25, z: SIZE_PLANE * 1.4 }, 3, 2, bbcube, platforms, scene, objectsArea3);

createBarrier(0.25, 6, 7, -3, -1, -23, 0, 0, 0, bbcube, cubeS)
createBarrier(0.25, 6, 7, 3, -1, -23, 0, 0, 0, bbcube, cubeS)
createBarrier(0.25, 6, 7, -23, 1, -3, 0, 90, 0, bbcube, cubeS)
createBarrier(0.25, 6, 7, -23, 1, 3, 0, 90, 0, bbcube, cubeS)
createBarrier(0.25, 6, 7, -3, 1, 24, 0, 0, 0, bbcube, cubeS)
createBarrier(0.25, 6, 7, 3, 1, 24, 0, 0, 0, bbcube, cubeS)
createBarrier(0.25, 6, 7, 23, -1, -3, 0, 90, 0, bbcube, cubeS)
createBarrier(0.25, 6, 7, 23, -1, 3, 0, 90, 0, bbcube, cubeS)
createBarrier(3, 1, 3, 3, -3, -66, 0, 0, 0, bbcube, cubeS)
createBarrier(4, 1, 3, -3, -3, -66, 0, 0, 0, bbcube, cubeS)

finalPlatform =  plataformsAreaFinal(scene)

cubesArea3(bbcube, platforms, scene, objectsArea3, bbBox, id_key, mixer);

let spotLightMan = spotLightM(cameraholder)

// KEYBOARD COMMANDS
function keyboardUpdate() {

    keyboard.update()
    let aux_collision;
    var escada = checkCollisions(bbstairs, asset)
    if (keyboard.pressed("A") && keyboard.pressed("W") || keyboard.pressed("left") && keyboard.pressed("up")) {
        var rad = THREE.MathUtils.degToRad(anguloY.Y);
        if (escada) {
            var select_stairs = getColissionObjectId(bbstairs, asset)
            if (select_stairs == 0) {
                movimentation_stairs(0, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            else if (select_stairs == 1) {
                movimentation_stairs(0, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            if (select_stairs == 2) {
                movimentation_stairs(0, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0, WALK_SIZE, 0, 0, WALK_SIZE, 0, 0, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            else if (select_stairs == 3) {
                movimentation_stairs(0, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0, WALK_SIZE, 0, 0, WALK_SIZE, 0, 0, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
        }
        else {
            movimentation_colision(0, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, false, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder, bbBox.filter(box => box.selected==false).map(box2 => box2.bb));
        }
    }
    else if (keyboard.pressed("D") && keyboard.pressed("W") || keyboard.pressed("right") && keyboard.pressed("up")) {
        var rad = THREE.MathUtils.degToRad(anguloY.Y);
        if (escada) {
            var select_stairs = getColissionObjectId(bbstairs, asset)
            if (select_stairs == 0) {
                movimentation_stairs(270, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0, WALK_SIZE, 0, 0, WALK_SIZE, 0, 0, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            else if (select_stairs == 1) {
                movimentation_stairs(270, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0, WALK_SIZE, 0, 0, WALK_SIZE, 0, 0, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            if (select_stairs == 2) {
                movimentation_stairs(270, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
                dirLight.intensity = dirLight.intensity + 0.01
                ambientLight.intensity = ambientLight.intensity + 0.01
                if (spotLightMan.intensity > 0) {
                    spotLightMan.intensity = spotLightMan.intensity - 0.01
                }
                if (getIntensityEmissive(asset.object) > 0) {
                    iluminaMan(getIntensityEmissive(asset.object) - 0.01, asset.object)
                }
            }
            else if (select_stairs == 3) {
                movimentation_stairs(270, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
        }
        else {
            movimentation_colision(270, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, false, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder, bbBox.filter(box => box.selected==false).map(box2 => box2.bb));
        }
    }
    else if (keyboard.pressed("A") && keyboard.pressed("S") || keyboard.pressed("left") && keyboard.pressed("down")) {
        var rad = THREE.MathUtils.degToRad(anguloY.Y);
        if (escada) {
            var select_stairs = getColissionObjectId(bbstairs, asset)
            if (select_stairs == 0) {
                movimentation_stairs(90, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0, WALK_SIZE, 0, 0, WALK_SIZE, 0, 0, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            else if (select_stairs == 1) {
                movimentation_stairs(90, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0, WALK_SIZE, 0, 0, WALK_SIZE, 0, 0, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            if (select_stairs == 2) {
                movimentation_stairs(90, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
                dirLight.intensity = dirLight.intensity - 0.01
                ambientLight.intensity = ambientLight.intensity - 0.01
                if (spotLightMan.intensity < 1) {
                    spotLightMan.intensity = spotLightMan.intensity + 0.01
                }
                if (getIntensityEmissive(asset.object) < 0.15) {
                    iluminaMan(getIntensityEmissive(asset.object) + 0.01, asset.object)
                }
            }
            else if (select_stairs == 3) {
                movimentation_stairs(90, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
        }
        else {
            movimentation_colision(90, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, false, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder, bbBox.filter(box => box.selected==false).map(box2 => box2.bb));
        }
    }
    else if (keyboard.pressed("D") && keyboard.pressed("S") || keyboard.pressed("right") && keyboard.pressed("down")) {
        var rad = THREE.MathUtils.degToRad(anguloY.Y);
        if (escada) {
            var select_stairs = getColissionObjectId(bbstairs, asset)
            if (select_stairs == 0) {
                movimentation_stairs(180, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            else if (select_stairs == 1) {
                movimentation_stairs(180, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            if (select_stairs == 2) {
                movimentation_stairs(180, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0, WALK_SIZE, 0, 0, WALK_SIZE, 0, 0, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            else if (select_stairs == 3) {
                movimentation_stairs(180, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0, WALK_SIZE, 0, 0, WALK_SIZE, 0, 0, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
        }
        else {
            movimentation_colision(180, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, false, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder, bbBox.filter(box => box.selected==false).map(box2 => box2.bb));
        }
    }
    else if (keyboard.pressed("W") || keyboard.pressed("up")) {
        var rad = THREE.MathUtils.degToRad(anguloY.Y);
        if (escada) {
            var select_stairs = getColissionObjectId(bbstairs, asset)
            if (select_stairs == 0) {
                movimentation_stairs(315, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            else if (select_stairs == 1) {
                movimentation_stairs(315, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            if (select_stairs == 2) {
                movimentation_stairs(315, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
                dirLight.intensity = dirLight.intensity + 0.01
                ambientLight.intensity = ambientLight.intensity + 0.01
                if (spotLightMan.intensity > 0) {
                    spotLightMan.intensity = spotLightMan.intensity - 0.01
                }
                if (getIntensityEmissive(asset.object) > 0) {
                    iluminaMan(getIntensityEmissive(asset.object) - 0.01, asset.object)
                }
            }
            else if (select_stairs == 3) {
                movimentation_stairs(315, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
        }
        else {
            aux_collision = movimentation_colision(315, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, false, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder, bbBox.filter(box => box.selected==false).map(box2 => box2.bb));
            if (aux_collision) {
                movimentation_colision(270, Math.sin(THREE.MathUtils.degToRad(270)) * WALK_SIZE, Math.cos(THREE.MathUtils.degToRad(270)) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, true, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder, bbBox.filter(box => box.selected==false).map(box2 => box2.bb));
                movimentation_colision(0, Math.sin(THREE.MathUtils.degToRad(0)) * WALK_SIZE, Math.cos(THREE.MathUtils.degToRad(0)) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, true, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder, bbBox.filter(box => box.selected==false).map(box2 => box2.bb));
                movimentation_colision(315, 0, 0, 0, 0, 0, 0, true, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder, bbBox.filter(box => box.selected==false).map(box2 => box2.bb));
            }
        }
    }
    else if (keyboard.pressed("S") || keyboard.pressed("down")) {
        var rad = THREE.MathUtils.degToRad(anguloY.Y);
        if (escada) {
            var select_stairs = getColissionObjectId(bbstairs, asset)
            if (select_stairs == 0) {
                movimentation_stairs(135, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            else if (select_stairs == 1) {
                movimentation_stairs(135, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            if (select_stairs == 2) {
                movimentation_stairs(135, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
                dirLight.intensity = dirLight.intensity - 0.01
                ambientLight.intensity = ambientLight.intensity - 0.01
                if (spotLightMan.intensity < 1) {
                    spotLightMan.intensity = spotLightMan.intensity + 0.01
                }
                if (getIntensityEmissive(asset.object) < 0.15) {
                    iluminaMan(getIntensityEmissive(asset.object) + 0.01, asset.object)
                }
            }
            else if (select_stairs == 3) {
                movimentation_stairs(135, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
        }
        else {
            aux_collision = movimentation_colision(135, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, false, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder, bbBox.filter(box => box.selected==false).map(box2 => box2.bb));
            if (aux_collision) {
                movimentation_colision(180, Math.sin(THREE.MathUtils.degToRad(180)) * WALK_SIZE, Math.cos(THREE.MathUtils.degToRad(180)) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, true, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder, bbBox.filter(box => box.selected==false).map(box2 => box2.bb));
                movimentation_colision(90, Math.sin(THREE.MathUtils.degToRad(90)) * WALK_SIZE, Math.cos(THREE.MathUtils.degToRad(90)) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, true, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder, bbBox.filter(box => box.selected==false).map(box2 => box2.bb));
                movimentation_colision(135, 0, 0, 0, 0, 0, 0, true, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder, bbBox.filter(box => box.selected==false).map(box2 => box2.bb));
            }
        }
    }
    else if (keyboard.pressed("A") || keyboard.pressed("left")) {
        var rad = THREE.MathUtils.degToRad(anguloY.Y);
        if (escada) {
            var select_stairs = getColissionObjectId(bbstairs, asset)
            if (select_stairs == 0) {
                movimentation_stairs(45, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            else if (select_stairs == 1) {
                movimentation_stairs(45, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            if (select_stairs == 2) {
                movimentation_stairs(45, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
                dirLight.intensity = dirLight.intensity - 0.01
                ambientLight.intensity = ambientLight.intensity - 0.01
                if (spotLightMan.intensity < 1) {
                    spotLightMan.intensity = spotLightMan.intensity + 0.01
                }
                if (getIntensityEmissive(asset.object) < 0.15) {
                    iluminaMan(getIntensityEmissive(asset.object) + 0.01, asset.object)
                }
            }
            else if (select_stairs == 3) {
                movimentation_stairs(45, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
        }
        else {
            aux_collision = movimentation_colision(45, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, false, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder, bbBox.filter(box => box.selected==false).map(box2 => box2.bb));
            if (aux_collision) {
                movimentation_colision(0, Math.sin(THREE.MathUtils.degToRad(0)) * WALK_SIZE, Math.cos(THREE.MathUtils.degToRad(0)) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, true, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder, bbBox.filter(box => box.selected==false).map(box2 => box2.bb));
                movimentation_colision(90, Math.sin(THREE.MathUtils.degToRad(90)) * WALK_SIZE, Math.cos(THREE.MathUtils.degToRad(90)) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, true, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder, bbBox.filter(box => box.selected==false).map(box2 => box2.bb));
                movimentation_colision(45, 0, 0, 0, 0, 0, 0, true, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder, bbBox.filter(box => box.selected==false).map(box2 => box2.bb));
            }
        }
    }
    else if (keyboard.pressed("D") || keyboard.pressed("right")) {
        var rad = THREE.MathUtils.degToRad(anguloY.Y);
        if (escada) {
            var select_stairs = getColissionObjectId(bbstairs, asset)
            if (select_stairs == 0) {
                movimentation_stairs(225, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            else if (select_stairs == 1) {
                movimentation_stairs(225, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            if (select_stairs == 2) {
                movimentation_stairs(225, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
                dirLight.intensity = dirLight.intensity + 0.01
                ambientLight.intensity = ambientLight.intensity + 0.01
                if (spotLightMan.intensity > 0) {
                    spotLightMan.intensity = spotLightMan.intensity - 0.01
                }
                if (getIntensityEmissive(asset.object) > 0) {
                    iluminaMan(getIntensityEmissive(asset.object) - 0.01, asset.object)
                }
            }
            else if (select_stairs == 3) {
                movimentation_stairs(225, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
        }
        else {
            aux_collision = movimentation_colision(225, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, false, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder, bbBox.filter(box => box.selected==false).map(box2 => box2.bb));
            if (aux_collision) {
                movimentation_colision(270, Math.sin(THREE.MathUtils.degToRad(270)) * WALK_SIZE, Math.cos(THREE.MathUtils.degToRad(270)) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, true, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder, bbBox.filter(box => box.selected==false).map(box2 => box2.bb));
                movimentation_colision(180, Math.sin(THREE.MathUtils.degToRad(180)) * WALK_SIZE, Math.cos(THREE.MathUtils.degToRad(180)) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, true, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder, bbBox.filter(box => box.selected==false).map(box2 => box2.bb));
                movimentation_colision(225, 0, 0, 0, 0, 0, 0, true, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder, bbBox.filter(box => box.selected==false).map(box2 => box2.bb));
            }
        }
    }
    else {
        playAction.play = false;
    }
    if (keyboard.down("C")) {
        if (orthographic) {
            camPosition = new THREE.Vector3(14, 12, -14);
            camera = new THREE.PerspectiveCamera(31, window.innerWidth / window.innerHeight, 0.1, s);
            camera.position.copy(camPosition);
            camera.up.copy(upVec);
            camera.lookAt(lookAtVec);

            cameraholder.add(camera);
            scene.add(cameraholder);
            orthographic = false;
        }
        else {
            camPosition = new THREE.Vector3(9, 6, -7);
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
    if (keyboard.down("T")) {
        get_key = [true, true, true, true]
    }
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
// CHECK IF BLOCK WAS PRESSED
let click = false;
function clickElement(events) {
    pointer.x = (events.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (events.clientY / window.innerHeight) * 2 + 1;
    click = true;
}

let indexDoor
let colors = ["rgb(222,184,135)", "rgb(165,42,42)", "rgb(102,205,170)", "rgb(60,179,113)"];
function render() {
    if (checkCollisions(doors.box, asset)) {
        indexDoor = getColissionObjectId(doors.box, asset)
    }
    if (get_key[indexDoor] || (checkOpenDoorRoom(0, 3) && indexDoor == 5) || (checkOpenDoorRoom(3, 5) && indexDoor == 6) || indexDoor == 4) {
        lerpConfig.destination = new THREE.Vector3(doors.obj[indexDoor].position.x, -12.0, doors.obj[indexDoor].position.z)
        doors.obj[indexDoor].position.lerp(lerpConfig.destination, lerpConfig.alpha);
        doors.box[indexDoor] = new THREE.Box3().setFromObject(doors.obj[indexDoor]);

        if (doorsSounds.includes(indexDoor))
            playSound(abrir_porta)
        if (doors.obj[indexDoor].position.y <= asset.object.position.y - 2.75) {
            doors.obj[indexDoor].visible = false;

            doorsSounds[indexDoor] = -1;
        }
    }
    if (indexDoor == 2) {
        objectsArea3.map((x) => {
            x.visible = true;
        })
    }

    lightTrasition(light_switch, asset, spotLight_on);

    if (checkCollisions(bbkey, asset)) {
        let indexkey = getColissionObjectId(bbkey, asset);
        id_key[indexkey].removeFromParent();
        bbkey.splice(indexkey, 1)
        get_key[indexkey + 1] = true;
        playSound(pegar_chave)
        // pegar_chave.play();

    }
    if (asset2.object && !asset2.loaded) {
        asset2.bb.setFromObject(asset2.object);
        asset2.loaded = true;
        asset.loaded = true;
        trilha_sonora.play()
    }
    let allLoaded = true;
    if(!bbBox[0].loaded){
        bbBox.forEach(box =>{
            if(bbBox.object==null){
                allLoaded = false;
            
        }});
        if(allLoaded == true){
            bbBox[0].loaded = true;
        }
    }
    if(allLoaded){
        bbBox.forEach((loadedBox, index) =>{
            bbBox[index].bb = new THREE.Box3().setFromObject(loadedBox.object);
            bbBox[index].loaded = true;
            bbBox[index].object.name = "randomGLTF"
        });
        
    }

    var delta = clock.getDelta();
    requestAnimationFrame(render);
    if (asset.loaded) {
        keyboardUpdate();
    }
    renderer.render(scene, camera)
    if (playAction.play) {
        for (var i = 0; i < mixer.length; i++)
            mixer[i].update(delta * 2.3);
    }
    let isGLTF = false;
    if (click) {
        renderer.render(scene, camera);
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        const blockFromAsset = 2;
        let GLTFremove;
        if(intersects[0] && intersects[0].object && intersects[0].object.name!="randomCube"){
            bbBox.forEach( (searchUUID, index) =>{
                searchUUID.object.children.forEach(child =>{
                    if(child.uuid == intersects[0].object.uuid){
                        isGLTF = true;
                        intersects[0].object=searchUUID.object;
                        GLTFremove = index;
                    }
                })
            })
        };
        if ((intersects[0] && intersects[0].object.name === "randomCube" && (clickeObjects.object == undefined || intersects[0].object.material.color.getHexString() != "deb887")) || (isGLTF)) {
            let isNear = Math.pow(intersects[0].object.position.x - asset.object.position.x, 2) + Math.pow(intersects[0].object.position.z - asset.object.position.z, 2);
            isNear = Math.sqrt(isNear);
            if ((intersects[0].object.material && intersects[0].object.material.color.getHexString() == "deb887") || (isGLTF && clickeObjects.direction == "up")) /*&& isNear <= 2*/ { //== "deb887"
                if(isGLTF){
                    bbBox[GLTFremove].selected = true;
                }else{

                    cubeS.forEach((bloco, indexRandomBlock) => {
                        if (bloco.uuid && bloco.uuid == intersects[0].object.uuid) {
                        var indexCube = new THREE.Box3().setFromObject(bloco);
                        bbcube.forEach((bloco, indexbbCube) => {
                            if (bloco.max && bloco.min && bloco.max.x == indexCube.max.x && bloco.max.z == indexCube.max.z &&
                                bloco.min.x == indexCube.min.x && bloco.min.x == indexCube.min.x) {
                                    cubeS.splice(indexRandomBlock, 1)
                                    bbcube.splice(indexbbCube, 1)
                                }
                            })
                        }
                    })
                }
                let sqrtPosition = Math.pow(intersects[0].object.position.x - cameraholder.position.x, 2) + Math.pow(intersects[0].object.position.z - cameraholder.position.z, 2);
                sqrtPosition = Math.sqrt(sqrtPosition);

                intersects[0].object.rotation.set(0, 0, 0);
                if(isGLTF){
                    intersects[0].object.position.set(
                        0,
                        -0.09,
                        blockFromAsset,
                        );
                }else{

                    intersects[0].object.position.set(
                        0,
                        0.5,
                        blockFromAsset,
                        );
                }
                asset.obj3D.add(intersects[0].object);

                //Records element(s) clicked. Objects that must be lifted
                clickeObjects.object = intersects[0].object;
                clickeObjects.floor = intersects[0].object.position.y;
                clickeObjects.top = intersects[0].object.position.y + blockElevationValue;
                //Change color on click
                if(intersects[0].object.material)
                intersects[0].object.material.color.set(colors[1]);

            } else if ((intersects[0].object.material && intersects[0].object.material.color.getHexString() != "deb887") || (isGLTF && clickeObjects.direction == "down")) {
                if(intersects[0].object.material)
                intersects[0].object.material.color.set(colors[0]);
                asset.obj3D.remove(intersects[0].object);

                scene.add(intersects[0].object)
                intersects[0].object.position.set(
                    asset.object.position.x + (blockFromAsset * Math.sin(THREE.MathUtils.degToRad(anguloY.Y))),
                    intersects[0].object.position.y + asset.object.position.y,
                    asset.object.position.z + (blockFromAsset * Math.cos(THREE.MathUtils.degToRad(anguloY.Y)))
                )
                intersects[0].object.rotateY(THREE.MathUtils.degToRad(anguloY.Y));
                if(isGLTF){
                    bbBox[GLTFremove].selected = false;
                    bbBox[GLTFremove].bb = new THREE.Box3().setFromObject(intersects[0].object)
                    bbBox[GLTFremove].object = intersects[0].object;
                }else{
                    bbcube.push(new THREE.Box3().setFromObject(intersects[0].object));
                    cubeS.push(intersects[0].object)
                }

                //Records element(s) clicked. Objects that must be placed on the floor
                clickeObjects.object = intersects[0].object;
                clickeObjects.floor = intersects[0].object.position.y - blockElevationValue;
                clickeObjects.top = intersects[0].object.position.y + asset.object.position.y;
            }
        }
        click = false;
    }
    if (clickeObjects.object != undefined) {
        if ((clickeObjects.object.material && clickeObjects.object.material.color.getHexString() == "deb887") || (clickeObjects.direction =="down")) {
            if (clickeObjects.object.position.y > clickeObjects.floor + 0.001) {
                lerpConfig.destination = new THREE.Vector3(clickeObjects.object.position.x, clickeObjects.floor, clickeObjects.object.position.z)
                clickeObjects.object.position.lerp(lerpConfig.destination, lerpConfig.alpha + 0.2);

                let c = getColissionObjectId(platforms.box, { bb: new THREE.Box3().setFromObject(clickeObjects.object) })
                let isInvisibleSelected = invisibleWayBlocks.selected.indexOf(true);
                if (c != -1) {
                    lerpConfig.destination = new THREE.Vector3(platforms.object[c].position.x, asset.object.position.y - 0.2, platforms.object[c].position.z)
                    platforms.object[c].position.lerp(lerpConfig.destination, lerpConfig.alpha + 0.1);
                    platforms.pressed[c] = true;
                    clickeObjects.object.name = "";
                    platforms.object[c].material.color.set(colors[2]);

                    playSound(acionar_plataforma);

                } else if (checkCollisions(invisibleWayBlocks.box, { bb: new THREE.Box3().setFromObject(clickeObjects.object) }) || isInvisibleSelected != -1) {
                    let indexWay = getColissionObjectId(invisibleWayBlocks.box, { bb: new THREE.Box3().setFromObject(clickeObjects.object) });
                    if (indexWay != undefined) {
                        if (invisibleWayBlocks.selected[indexWay] == false) {
                            clickeObjects.floor = clickeObjects.floor - 1;
                            clickeObjects.name = "";
                        }
                        invisibleWayBlocks.selected[indexWay] = true;
                        playSound(monta_ponte)
                    }
                    isInvisibleSelected = invisibleWayBlocks.selected.indexOf(true);
                    lerpConfig.destination = new THREE.Vector3(invisibleWayBlocks.cube[isInvisibleSelected].position.x, clickeObjects.floor, invisibleWayBlocks.cube[isInvisibleSelected].position.z)
                    clickeObjects.object.position.lerp(lerpConfig.destination, lerpConfig.alpha + 0.2);
                    let quat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(180));
                    clickeObjects.object.quaternion.slerp(quat, lerpConfig.alpha + 0.3)

                }
            } else {
                let indexSelected = invisibleWayBlocks.selected.indexOf(true);
                if (indexSelected != -1) {
                    let indexToRemove = bbcube.indexOf(invisibleWayBlocks.box[indexSelected]);
                    bbcube.splice(indexToRemove, 1);
                    clickeObjects.object.name = "";
                    bbcube.pop();
                    invisibleWayBlocks.selected.splice(indexSelected, 1);
                    invisibleWayBlocks.cube.splice(indexSelected, 1);
                    invisibleWayBlocks.box.splice(indexSelected, 1);
                }
                clickeObjects.object = undefined;
                clickeObjects.floor = undefined;
                clickeObjects.top = undefined;
                if(clickeObjects.direction =="up"){
                    clickeObjects.direction = "down"; 
                }else{
                    clickeObjects.direction = "up"; 
                }
            }
        }
        else if(clickeObjects.direction =="up"){
            if (clickeObjects.object.position.y < clickeObjects.top - 0.001) {
                lerpConfig.destination = new THREE.Vector3(clickeObjects.object.position.x, clickeObjects.top, clickeObjects.object.position.z)
                clickeObjects.object.position.lerp(lerpConfig.destination, lerpConfig.alpha + 0.2);
            } else {
                clickeObjects.object = undefined;
                clickeObjects.floor = undefined;
                clickeObjects.top = undefined;
                if(clickeObjects.direction =="up"){
                    clickeObjects.direction = "down"; 
                }else{
                    clickeObjects.direction = "up"; 
                }
            }
        }
    }
    if (checkCollisions(finalPlatform, asset) && document.getElementById("hidden") != null) {
        trilha_sonora.stop()
        playSound(fimjogo)
        let element = document.getElementById("hidden");
        element.setAttribute('id', 'end_game')
    }
}

window.addEventListener('click', clickElement);

render();