import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
let plane = createGroundPlaneXZ(20, 20)
scene.add(plane);

// create a cube
let cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
let cube = new THREE.Mesh(cubeGeometry, material);
// position the cube
cube.position.set(0.0, 0.0, 0.0);

// create a cylinder
let cylinderGeometry1 = new THREE.CylinderGeometry(1, 1, 1, 64);
let cylinder1 = new THREE.Mesh(cylinderGeometry1, material);
// position the cylinder
cylinder1.position.set(0.0, 0.0, 0.0);

// create a cylinder
let cylinderGeometry2 = new THREE.CylinderGeometry(1, 1, 1, 64);
let cylinder2 = new THREE.Mesh(cylinderGeometry2, material);
// position the cylinder
cylinder2.position.set(0.0, 0.0, 0.0);

// create a cylinder
let cylinderGeometry3 = new THREE.CylinderGeometry(1, 1, 1, 64);
let cylinder3 = new THREE.Mesh(cylinderGeometry3, material);
// position the cylinder
cylinder3.position.set(0.0, 0.0, 0.0);

// create a cylinder
let cylinderGeometry4 = new THREE.CylinderGeometry(1, 1, 1, 64);
let cylinder4 = new THREE.Mesh(cylinderGeometry4, material);
// position the cylinder
cylinder4.position.set(0.0, 0.0, 0.0);

// add the cube to the scene
scene.add(cube);

//add the cylinder1 to the scene
scene.add(cylinder1);

//add the cylinder2 to the scene
scene.add(cylinder2);

//add the cylinder3 to the scene
scene.add(cylinder3);

//add the cylinder4 to the scene
scene.add(cylinder4);

//change scale cylinder1
cylinder1.scale.x = 0.2;
cylinder1.scale.y = 3;
cylinder1.scale.z = 0.2;

//change scale cylinder2
cylinder2.scale.x = 0.2;
cylinder2.scale.y = 3;
cylinder2.scale.z = 0.2;

//change scale cylinder3
cylinder3.scale.x = 0.2;
cylinder3.scale.y = 3;
cylinder3.scale.z = 0.2;

//change scale cylinder4
cylinder4.scale.x = 0.2;
cylinder4.scale.y = 3;
cylinder4.scale.z = 0.2;

//change scale cube
cube.scale.x = 11;
cube.scale.y = 0.3;
cube.scale.z = 6;

//translate cube
cube.translateY(3.15);

//translate cylinder1
cylinder1.translateX(-5.3);
cylinder1.translateY(1.5);
cylinder1.translateZ(-2.8);

//translate cylinder1
cylinder2.translateX(-5.3);
cylinder2.translateY(1.5);
cylinder2.translateZ(2.8);

//translate cylinder3
cylinder3.translateX(5.3);
cylinder3.translateY(1.5);
cylinder3.translateZ(-2.8);

//translate cylinder4
cylinder4.translateX(5.3);
cylinder4.translateY(1.5);
cylinder4.translateZ(2.8);

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