import * as THREE from 'three';
import GUI from '../libs/util/dat.gui.module.js'
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

let orthographic = true;

const bbcube = [];

function createGroundPlaneXZ(width, height, widthSegments = 10, heightSegments = 10, gcolor = null) {
    if (!gcolor) gcolor = "rgb(210,180,140)";
    let planeGeometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
    let planeMaterial = new THREE.MeshLambertMaterial({ color: gcolor, side: THREE.DoubleSide });

    let mat4 = new THREE.Matrix4(); // Aux mat4 matrix   
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    // Rotate 90 in X and perform a small translation in Y
    plane.matrixAutoUpdate = false;
    plane.matrix.identity();    // resetting matrices
    // Will execute R1 and then T1
    plane.matrix.multiply(mat4.makeTranslation(0.0, -0.1, 0.0)); // T1   
    var plano_rad = THREE.MathUtils.degToRad(90)
    plane.matrix.multiply(mat4.makeRotationX((plano_rad))); // R1   

    return plane;
}

let scene, renderer, camera, material, light, orbit, keyboard; // Initial variables
let anguloY = 0
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer

var lookAtVec   = new THREE.Vector3( 0.0, 0.0, 0.0 );
var camPosition = new THREE.Vector3( 0, 8, 12.5 );
var upVec       = new THREE.Vector3( 0.0, 1.0, 0.0 );
var s = 105;
camera = new THREE.OrthographicCamera(-window.innerWidth / s, window.innerWidth / s,
window.innerHeight / s, window.innerHeight / -s, -s, s);
camera.position.copy(camPosition);
camera.up.copy(upVec);
camera.lookAt(lookAtVec);

let cameraholder = new THREE.Object3D();
cameraholder.add(camera);
scene.add(cameraholder);

//camera = initCamera(new THREE.Vector3(0, 10, 12.5)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.

keyboard = new KeyboardState();

var clock = new THREE.Clock();

// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

// create the ground plane

const SIZE_PLANE = 60;

let plane = createGroundPlaneXZ(SIZE_PLANE+55, SIZE_PLANE+55);
scene.add(plane);

let cubeGeometry = new THREE.BoxGeometry(2, 0.01, 2);
let cubeGeometry2 = new THREE.BoxGeometry(2, 2, 2);
let material1 = setDefaultMaterial("rgb(255,222,173)");

function makeFloor() {
    for (let x = -SIZE_PLANE / 2; x <= SIZE_PLANE / 2; x += 2.2) {
        for (let z = -SIZE_PLANE / 2; z <= SIZE_PLANE / 2; z += 2.2) {
            // create a cube
            let cube = new THREE.Mesh(cubeGeometry, material1);
            // position the cube
            cube.position.set(x, 0.05, z);
            // add the cube to the scene
            scene.add(cube);
        }
    }
}

function makeEdgeX(x, z) {
    for (; x <= SIZE_PLANE / 2; x += 2.2) {
        // position the cube
        let cube = new THREE.Mesh(cubeGeometry2, material1);
        cube.position.set(x, 1, z);
        bbcube.push(new THREE.Box3().setFromObject(cube));
        // add the cube to the scene
        scene.add(cube);
    }
}
function makeEdgeZ(x, z) {
    for (; z <= SIZE_PLANE / 2; z += 2.2) {
        // position the cube
        let cube = new THREE.Mesh(cubeGeometry2, material1);
        cube.position.set(x, 1, z);
        bbcube.push(new THREE.Box3().setFromObject(cube));
        // add the cube to the scene
        scene.add(cube);
    }
}


var playAction;
var mixer = new Array();

function loadGLTFFile(asset, file, add_scene) {
    var loader = new GLTFLoader();
    loader.load(file, function (gltf) {
        var obj = gltf.scene;
        obj.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
            }
          });
        obj = normalizeAndRescale(obj, 2);
        obj.updateMatrixWorld(true)
        if(add_scene)
        {
            scene.add(obj);
        }

        asset.object = gltf.scene;
        // Create animationMixer and push it in the array of mixers
        var mixerLocal = new THREE.AnimationMixer(obj);
        mixerLocal.clipAction(gltf.animations[0]).play();
        mixer.push(mixerLocal);
    }, onProgress, onError);
}

function onProgress(xhr, model) {
    if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
    }
}

function onError() { };

function normalizeAndRescale(obj, newScale) {
    var scale = getMaxSize(obj); // Available in 'utils.js'
    obj.scale.set(newScale * (1.0 / scale),
        newScale * (1.0 / scale),
        newScale * (1.0 / scale));
    return obj;
}

function movimentation(angulo_max, camX, camZ, walkZ, walkX, walkZ_hide, walkX_hide)
{
    if (anguloY < angulo_max) {
        while (anguloY < angulo_max) {
            anguloY = anguloY + 1
            var rad = THREE.MathUtils.degToRad(1)
            asset.object.rotateY(rad)
            asset2.object.rotateY(rad)
        }
    }
    if (anguloY > angulo_max) {
        while (anguloY > angulo_max) {
            anguloY = anguloY - 1
            var rad = THREE.MathUtils.degToRad(-1)
            asset.object.rotateY(rad)
            asset2.object.rotateY(rad)
        }
    }
    cameraholder.translateX(camX)
    cameraholder.translateZ(camZ)
    asset.object.translateZ(walkZ)
    asset.object.translateX(walkX)
    asset2.object.translateZ(walkZ_hide)
    asset2.object.translateX(walkX_hide)
    asset.bb.setFromObject(asset.object);
    asset2.bb.setFromObject(asset2.object);
}

function keyboardUpdate() {

    keyboard.update()
    if (keyboard.pressed("A") || keyboard.pressed("D") || keyboard.pressed("S") || keyboard.pressed("W") || keyboard.pressed("up") || keyboard.pressed("down") || keyboard.pressed("left") || keyboard.pressed("right")) 
    {
        playAction = true
    }
    else 
    {
        playAction = false
    }
    if (keyboard.pressed("A") && keyboard.pressed("S") || keyboard.pressed("left") && keyboard.pressed("down")) {
        var collision = checkCollisions(bbcube,asset)
        if(!collision){
            movimentation(315,-(Math.sqrt(0.005, 2)),(Math.sqrt(0.005, 2)),0.1,0,0.1,0)
        }
    }
    else if (keyboard.pressed("A") && keyboard.pressed("W") || keyboard.pressed("left") && keyboard.pressed("up")) {
        var collision = checkCollisions(bbcube,asset)
        if(!collision){
            movimentation(225,-(Math.sqrt(0.005, 2)),-(Math.sqrt(0.005, 2)),0.1,0,0.1,0)
        }
    }
    else if (keyboard.pressed("D") && keyboard.pressed("S") || keyboard.pressed("right") && keyboard.pressed("down")) {
        var collision = checkCollisions(bbcube,asset)
        if(!collision){
            movimentation(45,(Math.sqrt(0.005, 2)),(Math.sqrt(0.005, 2)),0.1,0,0.1,0)
        }
    }
    else if (keyboard.pressed("D") && keyboard.pressed("W") || keyboard.pressed("right") && keyboard.pressed("up")) {
        var collision = checkCollisions(bbcube,asset)
        if(!collision){
            movimentation(135,(Math.sqrt(0.005, 2)),-(Math.sqrt(0.005, 2)),0.1,0,0.1,0)
        }
    }
    else if (keyboard.pressed("A") || keyboard.pressed("left")) {
        var collision = checkCollisions(bbcube,asset)
        if(!collision){
            movimentation(270,-0.1,0,0.1,0,0.1,0)
        }
        else
        {
            movimentation(270,0,0,0,0,0.1,-0.6)
            collision = checkCollisions(bbcube,asset2)
            if(collision)
            {
                movimentation(270,0,0,0,0,-0.1,0.6);
                asset2.bb.setFromObject(asset2.object);
                movimentation(270,0,0,0,0,0.1,0.6)
                collision = checkCollisions(bbcube,asset2)
                if(collision)
                {
                    movimentation(270,0,0,0,0,-0.1,-0.6)
                    asset2.bb.setFromObject(asset2.object);
                }
                else
                {
                    movimentation(270,-0.1,0,0.1,0,0,-0.6)
                }
            }
            else
            {
                movimentation(270,-0.1,0,0.1,0,0,0.6)
            }
        }
    }
    else if (keyboard.pressed("D") || keyboard.pressed("right")) {
        var collision = checkCollisions(bbcube,asset)
        if(!collision){
            movimentation(90,0.1,0,0.1,0,0.1,0)
        }
        else
        {
            movimentation(90,0,0,0,0,0.1,-0.6)
            collision = checkCollisions(bbcube,asset2)
            if(collision)
            {
                movimentation(90,0,0,0,0,-0.1,0.6)
                asset2.bb.setFromObject(asset2.object);
                movimentation(90,0,0,0,0,0.1,0.6)
                collision = checkCollisions(bbcube,asset2)
                if(collision)
                {
                    movimentation(90,0,0,0,0,-0.1,-0.6)
                    asset2.bb.setFromObject(asset2.object);
                }
                else
                {
                    movimentation(90,0.1,0,0.1,0,0,-0.6)
                }
            }
            else
            {
                movimentation(90,0.1,0,0.1,0,0,0.6)
            }
        }
    }
    else if (keyboard.pressed("S") || keyboard.pressed("down")) {
        var collision = checkCollisions(bbcube,asset)
        if(!collision){
            movimentation(0,0,0.1,0.1,0,0.1,0)
        }
        else
        {
            movimentation(0,0,0,0,0,0.1,-0.6)
            collision = checkCollisions(bbcube,asset2)
            if(collision)
            {
                movimentation(0,0,0,0,0,-0.1,0.6)
                asset2.bb.setFromObject(asset2.object);
                movimentation(0,0,0,0,0,0.1,0.6)
                collision = checkCollisions(bbcube,asset2)
                if(collision)
                {
                    movimentation(0,0,0,0,0,-0.1,-0.6)
                    asset2.bb.setFromObject(asset2.object);
                }
                else
                {
                    movimentation(0,0,0.1,0.1,0,0,-0.6)  
                }
            }
            else
            {
                movimentation(0,0,0.1,0.1,0,0,0.6)
            }
        }
    }
    else if (keyboard.pressed("W") || keyboard.pressed("up")) {
        var collision = checkCollisions(bbcube,asset)
        if(!collision){
            movimentation(180,0,-0.1,0.1,0,0.1,0)
        }
        else
        {
            movimentation(180,0,0,0,0,0.1,-0.6)
            collision = checkCollisions(bbcube,asset2)
            if(collision)
            {
                movimentation(180,0,0,0,0,-0.1,0.6)
                asset2.bb.setFromObject(asset2.object);
                movimentation(180,0,0,0,0,0.1,0.6)
                collision = checkCollisions(bbcube,asset2)
                if(collision)
                {
                    movimentation(180,0,0,0,0,-0.1,-0.6)
                    asset2.bb.setFromObject(asset2.object);
                }
                else
                {
                    movimentation(180,0,-0.1,0.1,0,0,-0.6)
                }
            }
            else
            {
                movimentation(180,0,-0.1,0.1,0,0,0.6)
            }
        }
    };
    if (keyboard.down("C"))
    {
        if(orthographic)
        {
            camPosition = new THREE.Vector3( 0, 10, 12.5 );
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, s);
            camera.position.copy(camPosition);
            camera.up.copy(upVec);
            camera.lookAt(lookAtVec);

            console.log(camera.position)

            cameraholder.add(camera);
            scene.add(cameraholder);
            orthographic = false;
        }
        else
        {
            camPosition = new THREE.Vector3( 0, 10, 12.5 );
            camera = new THREE.OrthographicCamera(-window.innerWidth / s, window.innerWidth / s,
            window.innerHeight / s, window.innerHeight / -s, -s, s);
            camera.position.copy(camPosition);
            camera.up.copy(upVec);
            camera.lookAt(lookAtVec);
            
            console.log(camera.position)

            cameraholder.add(camera);
            scene.add(cameraholder);
            orthographic = true;
        }
    }
}

function createBBHelper(bb, color)
{
   // Create a bounding box helper
   let helper = new THREE.Box3Helper( bb, color );
   scene.add( helper );
   return helper;
}

function checkCollisions(object, man)
{
    for(var i = 0; i<object.length; i++)
    {
        let collision = man.bb.intersectsBox(object[i]);
        if(collision) 
        {
            return true;
        }
    }
    return false
}

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

loadGLTFFile(asset,'../assets/objects/walkingMan.glb',true);
let assetHelper = createBBHelper(asset.bb, 'yellow');
loadGLTFFile(asset2,'../assets/objects/walkingMan.glb',false);
let assetHelper2 = createBBHelper(asset2.bb, 'yellow');

makeFloor()
makeEdgeX(-SIZE_PLANE / 2, -SIZE_PLANE / 2)
makeEdgeX(-SIZE_PLANE / 2, SIZE_PLANE / 2)
makeEdgeZ(-SIZE_PLANE / 2, -SIZE_PLANE / 2)
makeEdgeZ(SIZE_PLANE / 2, -SIZE_PLANE / 2)

render();
function render() {
    var delta = clock.getDelta();
    requestAnimationFrame(render);
    keyboardUpdate();
    renderer.render(scene, camera) // Render scene
    if (playAction) {
        for (var i = 0; i < mixer.length; i++)
            mixer[i].update(delta * 2);
    };
}