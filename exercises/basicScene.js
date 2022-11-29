import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ,
        degreesToRadians} from "../libs/util/util.js";

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// create the ground plane
let plane = createGroundPlaneXZ(20, 20)
scene.add(plane);
 
var texture = new THREE.TextureLoader();
var floor = texture.load('../assets/textures/marble.png');

let planeGeometry = new THREE.PlaneGeometry(3, 3, 10, 10);
let planeMaterial = new THREE.MeshLambertMaterial();
planeMaterial.map = floor;
planeMaterial.side =  THREE.DoubleSide;

let mat4 = new THREE.Matrix4(); // Aux mat4 matrix   
let plane1 = new THREE.Mesh(planeGeometry, planeMaterial);
plane1.receiveShadow = true;
// Rotate 90 in X and perform a small translation in Y
plane1.matrixAutoUpdate = false;
plane1.matrix.identity();    // resetting matrices
// Will execute R1 and then T1
plane1.matrix.multiply(mat4.makeTranslation(0.0, 0.0, 0.0)); // T1   
plane1.matrix.multiply(mat4.makeRotationX(degreesToRadians(-90))); // R1
scene.add(plane1)

let plane2 = new THREE.Mesh(planeGeometry, planeMaterial);
plane2.receiveShadow = true;
// Rotate 90 in X and perform a small translation in Y
plane2.matrixAutoUpdate = false;
plane2.matrix.identity();    // resetting matrices
// Will execute R1 and then T1
plane2.matrix.multiply(mat4.makeTranslation(0, 1.5, 1.5)); // T1   
plane2.matrix.multiply(mat4.makeRotationX(degreesToRadians(0))); // R1
scene.add(plane2)

let plane3 = new THREE.Mesh(planeGeometry, planeMaterial);
plane3.receiveShadow = true;
// Rotate 90 in X and perform a small translation in Y
plane3.matrixAutoUpdate = false;
plane3.matrix.identity();    // resetting matrices
// Will execute R1 and then T1
plane3.matrix.multiply(mat4.makeTranslation(0, 1.5, -1.5)); // T1   
plane3.matrix.multiply(mat4.makeRotationX(degreesToRadians(0))); // R1
scene.add(plane3)

let plane4 = new THREE.Mesh(planeGeometry, planeMaterial);
plane4.receiveShadow = true;
// Rotate 90 in X and perform a small translation in Y
plane4.matrixAutoUpdate = false;
plane4.matrix.identity();    // resetting matrices
// Will execute R1 and then T1
plane4.matrix.multiply(mat4.makeTranslation(0.0, 3.0, 0.0)); // T1   
plane4.matrix.multiply(mat4.makeRotationX(degreesToRadians(-90))); // R1
scene.add(plane4)

let plane5 = new THREE.Mesh(planeGeometry, planeMaterial);
plane5.receiveShadow = true;
// Rotate 90 in X and perform a small translation in Y
plane5.matrixAutoUpdate = false;
plane5.matrix.identity();    // resetting matrices
// Will execute R1 and then T1
plane5.matrix.multiply(mat4.makeTranslation(1.5, 1.5, 0.0)); // T1   
plane5.matrix.multiply(mat4.makeRotationY(degreesToRadians(-90))); // R1
scene.add(plane5)

// Use this to show information onscreen
let controls = new InfoBox();
  controls.add("Basic Scene");
  controls.addParagraph();
  controls.add("Use mouse to interact:");
  controls.add("* Left button to rotate");
  controls.add("* Right button to translate (pan)");
  controls.add("* Scroll to zoom in/out.");
  controls.show();

render();
function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}