import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        onWindowResize} from "../libs/util/util.js";

function createGroundPlaneXZ(width, height, widthSegments = 10, heightSegments = 10, gcolor = null)
{
   if(!gcolor) gcolor = "rgb(210,180,140)";
   let planeGeometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
   let planeMaterial = new THREE.MeshLambertMaterial({color: gcolor,side: THREE.DoubleSide});
   
   let mat4 = new THREE.Matrix4(); // Aux mat4 matrix   
   let plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.receiveShadow = true;   
      // Rotate 90 in X and perform a small translation in Y
      plane.matrixAutoUpdate = false; 
      plane.matrix.identity();    // resetting matrices
      // Will execute R1 and then T1
      plane.matrix.multiply(mat4.makeTranslation(0.0, -0.1, 0.0)); // T1   
      plane.matrix.multiply(mat4.makeRotationX((-90*0.0175))); // R1   

   return plane;
}

let scene, renderer, camera, material, light, orbit;; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 20, 25)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
//orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
let plane = createGroundPlaneXZ(120, 120)
scene.add(plane);

let cubeGeometry = new THREE.BoxGeometry(2, 0.01, 2);
let cubeGeometry2 = new THREE.BoxGeometry(2, 2, 2);
let material1 = setDefaultMaterial("rgb(255,222,173)");

for(let x = -60.0; x<=60.0; x+=2.2)
{
  for(let z = -60.0; z<=60.0; z+=2.2)
  {
    // create a cube
	let cube = new THREE.Mesh(cubeGeometry, material1);
    // position the cube
    cube.position.set(x, 0.05, z);
    // add the cube to the scene
    scene.add(cube);
  }
}

for(let x=-60; x<=60; x+=2.2)
{
    // position the cube
	let cube = new THREE.Mesh(cubeGeometry2, material1);
    cube.position.set(x, 1, -60);
    // add the cube to the scene
    scene.add(cube);
}

for(let x=-60; x<=60; x+=2.2)
{
    // position the cube
	let cube = new THREE.Mesh(cubeGeometry2, material1);
    cube.position.set(x, 1, 60);
    // add the cube to the scene
    scene.add(cube);
}

for(let z=-60; z<=60; z+=2.2)
{
    // position the cube
	let cube = new THREE.Mesh(cubeGeometry2, material1);
    cube.position.set(-60, 1, z);
    // add the cube to the scene
    scene.add(cube);
}

for(let z=-60; z<=60; z+=2.2)
{
    // position the cube
	let cube = new THREE.Mesh(cubeGeometry2, material1);
    cube.position.set(60, 1, z);
    // add the cube to the scene
    scene.add(cube);
}
// Use this to show information onscreen

render();
function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}