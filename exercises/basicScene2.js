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

let scene, renderer, camera, material, material2, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
material2 = setDefaultMaterial();
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// create the ground plane
let plane = createGroundPlaneXZ(20, 20)
scene.add(plane);
 
var texture = new THREE.TextureLoader();
var wood = texture.load('../assets/textures/wood.png');
material = new THREE.MeshLambertMaterial();
material.side =  THREE.DoubleSide;
material.map = wood

var texture2 = new THREE.TextureLoader();
var woodtop = texture2.load('../assets/textures/woodtop.png');
material2= new THREE.MeshLambertMaterial();
material2.side =  THREE.DoubleSide;
material2.map = woodtop

let CylinderGeometry = new THREE.CylinderGeometry(2, 2, 4, 32, 32, true);

let cylinder = new THREE.Mesh(CylinderGeometry, material);
// position the cube
cylinder.position.set(0.0, 2.0, 0.0);
// add the cube to the scene
scene.add(cylinder);

let CircleGeometry = new THREE.CircleGeometry(2, 32);

let circle = new THREE.Mesh(CircleGeometry, material2);
// position the cube
circle.position.set(0.0, 0.0, 0.0);
circle.rotateX(degreesToRadians(-90))
// add the cube to the scene
scene.add(circle);


let circle2 = new THREE.Mesh(CircleGeometry, material2);
// position the cube
circle2.position.set(0.0, 4.0, 0.0);
circle2.rotateX(degreesToRadians(-90))
// add the cube to the scene
scene.add(circle2);


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