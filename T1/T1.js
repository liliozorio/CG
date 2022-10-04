import * as THREE from 'three';
import KeyboardState from '../libs/util/KeyboardState.js'
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '../build/jsm/loaders/GLTFLoader.js'
import {
    initRenderer,
    initCamera,
    initDefaultBasicLight,
    setDefaultMaterial,
    InfoBox,
    getMaxSize,
    onWindowResize
} from "../libs/util/util.js";

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
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 10, 12.5)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.

keyboard = new KeyboardState();

let cameraholder = new THREE.Object3D();
cameraholder.add(camera);
scene.add(cameraholder);

var clock = new THREE.Clock();

// Listen window size changes
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

// create the ground plane

const SIZE_PLANE = 120;

let plane = createGroundPlaneXZ(SIZE_PLANE, SIZE_PLANE);
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
        // add the cube to the scene
        scene.add(cube);
    }
}
function makeEdgeZ(x, z) {
    for (; z <= SIZE_PLANE / 2; z += 2.2) {
        // position the cube
        let cube = new THREE.Mesh(cubeGeometry2, material1);
        cube.position.set(x, 1, z);
        // add the cube to the scene
        scene.add(cube);
    }
}


var playAction;
var mixer = new Array();
let man;

function loadGLTFFile(modelName) {
    var loader = new GLTFLoader();
    loader.load(modelName, function (gltf) {
        var obj = gltf.scene;
        // obj.traverse(function (child) {
        //     if (child) {
        //         child.castShadow = true;
        //     }
        // });
        // obj.traverse(function (node) {
        //     if (node.material) node.material.side = THREE.DoubleSide;
        // });

        obj = normalizeAndRescale(obj, 2);
        man = obj
        scene.add(obj);

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

let anguloY = 0


function keyboardUpdate() {

    keyboard.update()
    if (keyboard.pressed("A") || keyboard.pressed("D") || keyboard.pressed("S") || keyboard.pressed("W") || keyboard.pressed("up") || keyboard.pressed("down") || keyboard.pressed("left") || keyboard.pressed("right")) {
        playAction = true
    }
    else {
        playAction = false
    }
    if (keyboard.pressed("A") && keyboard.pressed("S") || keyboard.pressed("left") && keyboard.pressed("down")) {

        if (anguloY < 315) {
            while (anguloY < 315) {
                anguloY = anguloY + 1
                var rad = THREE.MathUtils.degToRad(1)
                man.rotateY(rad)
                console.log(anguloY)
            }
        }
        if (anguloY > 315) {
            while (anguloY > 315) {
                anguloY = anguloY - 1
                var rad = THREE.MathUtils.degToRad(-1)
                man.rotateY(rad)
                console.log(anguloY)
            }
        }
        cameraholder.translateX(-(Math.sqrt(0.005, 2)))
        cameraholder.translateZ(Math.sqrt(0.005, 2))
        man.translateZ(0.1)
    }
    else if (keyboard.pressed("A") && keyboard.pressed("W") || keyboard.pressed("left") && keyboard.pressed("up")) {
        if (anguloY < 225) {
            while (anguloY < 225) {
                anguloY = anguloY + 1
                var rad = THREE.MathUtils.degToRad(1)
                man.rotateY(rad)
                console.log(anguloY)
            }
        }
        if (anguloY > 225) {
            while (anguloY > 225) {
                anguloY = anguloY - 1
                var rad = THREE.MathUtils.degToRad(-1)
                man.rotateY(rad)
                console.log(anguloY)
            }
        }
        cameraholder.translateX(-(Math.sqrt(0.005, 2)))
        cameraholder.translateZ(-(Math.sqrt(0.005, 2)))
        man.translateZ(0.1)
    }
    else if (keyboard.pressed("D") && keyboard.pressed("S") || keyboard.pressed("right") && keyboard.pressed("down")) {
        if (anguloY < 45) {
            while (anguloY < 45) {
                anguloY = anguloY + 1
                var rad = THREE.MathUtils.degToRad(1)
                man.rotateY(rad)
                console.log(anguloY)
            }
        }
        if (anguloY > 45) {
            while (anguloY > 45) {
                anguloY = anguloY - 1
                var rad = THREE.MathUtils.degToRad(-1)
                man.rotateY(rad)
                console.log(anguloY)
            }
        }
        cameraholder.translateX((Math.sqrt(0.005, 2)))
        cameraholder.translateZ((Math.sqrt(0.005, 2)))
        man.translateZ(0.1)
    }
    else if (keyboard.pressed("D") && keyboard.pressed("W") || keyboard.pressed("right") && keyboard.pressed("up")) {
        if (anguloY < 135) {
            while (anguloY < 135) {
                anguloY = anguloY + 1
                var rad = THREE.MathUtils.degToRad(1)
                man.rotateY(rad)
                console.log(anguloY)
            }
        }
        if (anguloY > 135) {
            while (anguloY > 135) {
                anguloY = anguloY - 1
                var rad = THREE.MathUtils.degToRad(-1)
                man.rotateY(rad)
                console.log(anguloY)
            }
        }
        cameraholder.translateX((Math.sqrt(0.005, 2)))
        cameraholder.translateZ(-(Math.sqrt(0.005, 2)))
        man.translateZ(0.1)
    }
    else if (keyboard.pressed("A") || keyboard.pressed("left")) {
        if (anguloY < 270) {
            while (anguloY < 270) {
                anguloY = anguloY + 1
                var rad = THREE.MathUtils.degToRad(1)
                man.rotateY(rad)
                console.log(anguloY)
            }
        }
        if (anguloY > 270) {
            while (anguloY > 270) {
                anguloY = anguloY - 1
                var rad = THREE.MathUtils.degToRad(-1)
                man.rotateY(rad)
                console.log(anguloY)
            }
        }
        cameraholder.translateX(-0.1)
        man.translateZ(0.1)
    }
    else if (keyboard.pressed("D") || keyboard.pressed("right")) {
        if (anguloY < 90) {
            while (anguloY < 90) {
                anguloY = anguloY + 1
                var rad = THREE.MathUtils.degToRad(1)
                man.rotateY(rad)
                console.log(anguloY)
            }
        }
        if (anguloY > 90) {
            while (anguloY > 90) {
                anguloY = anguloY - 1
                var rad = THREE.MathUtils.degToRad(-1)
                man.rotateY(rad)
                console.log(anguloY)
            }
        }
        cameraholder.translateX(0.1)
        man.translateZ(0.1)
    }
    else if (keyboard.pressed("S") || keyboard.pressed("down")) {
        if (anguloY < 0) {
            while (anguloY < 0) {
                anguloY = anguloY + 1
                var rad = THREE.MathUtils.degToRad(1)
                man.rotateY(rad)
                console.log(anguloY)
            }
        }
        if (anguloY > 0) {
            while (anguloY > 0) {
                anguloY = anguloY - 1
                var rad = THREE.MathUtils.degToRad(-1)
                man.rotateY(rad)
                console.log(anguloY)
            }
        }
        cameraholder.translateZ(0.1)
        man.translateZ(0.1)
    }
    else if (keyboard.pressed("W") || keyboard.pressed("up")) {
        if (anguloY < 180) {
            while (anguloY < 180) {
                anguloY = anguloY + 1
                var rad = THREE.MathUtils.degToRad(1)
                man.rotateY(rad)
                console.log(anguloY)
            }
        }
        if (anguloY > 180) {
            while (anguloY > 180) {
                anguloY = anguloY - 1
                var rad = THREE.MathUtils.degToRad(-1)
                man.rotateY(rad)
                console.log(anguloY)
            }
        }
        cameraholder.translateZ(-0.1)
        man.translateZ(0.1)
    };
}

loadGLTFFile('../assets/objects/walkingMan.glb');


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
    }
}