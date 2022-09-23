import * as THREE from  'three';
import KeyboardState from '../libs/util/KeyboardState.js'
import {TeapotGeometry} from '../build/jsm/geometries/TeapotGeometry.js';
import {initRenderer, 
        initDefaultSpotlight,
        createGroundPlaneXZ,
        SecondaryBox, 
        onWindowResize} from "../libs/util/util.js";

let scene, renderer, light, camera, keyboard;
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // View function in util/utils
light = initDefaultSpotlight(scene, new THREE.Vector3(5.0, 5.0, 5.0)); // Use default light    
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );
keyboard = new KeyboardState();

var groundPlane = createGroundPlaneXZ(10, 10, 40, 40); // width, height, resolutionW, resolutionH
scene.add(groundPlane);

// Create objects
createTeapot( 2.0,  0.4,  0.0, Math.random() * 0xffffff);
createTeapot(0.0,  0.4,  2.0, Math.random() * 0xffffff);  
createTeapot(0.0,  0.4, -2.0, Math.random() * 0xffffff);    

let anguloX = 0
let anguloY = 0
let anguloZ = 0
let camPos  = new THREE.Vector3(3, 4, 8);
let camUp   = new THREE.Vector3(0.0, 1.0, 0.0);
let camLook = new THREE.Vector3(0.0, 0.0, 0.0);
var message = new SecondaryBox("");

// Main camera
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
   camera.position.copy(camPos);
   camera.up.copy( camUp );
   camera.lookAt(camLook);

let cameraholder = new THREE.Object3D();
   cameraholder.add(camera);
scene.add(cameraholder);

render();

function keyboardUpdate() {

   keyboard.update();
   if(keyboard.down("A"))
   {
      cameraholder.translateX(-0.1)
   };
   if(keyboard.down("D"))
   {
      cameraholder.translateX(0.1)
   };
   if(keyboard.down("S"))
   {
      cameraholder.translateY(-0.1)
   };
   if(keyboard.down("W"))
   {
      cameraholder.translateY(0.1)
   };
   if(keyboard.down("space"))
   {
      cameraholder.translateZ(-0.1)
   };
   if(keyboard.down("B"))
   {
      cameraholder.translateZ(0.1)
   };
   if(keyboard.down("up"))
   {
      anguloX = anguloX + 1
      var rad = THREE.MathUtils.degToRad(anguloX)
      cameraholder.rotateY(rad)
      anguloX = 0
   };
   if(keyboard.down("down"))
   {
      anguloX = anguloX - 1
      var rad = THREE.MathUtils.degToRad(anguloX)
      cameraholder.rotateY(rad)
      anguloX = 0
   };
   if(keyboard.down("right"))
   {
      anguloY = anguloY + 1
      var rad = THREE.MathUtils.degToRad(anguloY)
      cameraholder.rotateZ(rad)
      anguloY = 0
   };
   if(keyboard.down("left"))
   {
      anguloY = anguloY - 1
      var rad = THREE.MathUtils.degToRad(anguloY)
      cameraholder.rotateZ(rad)
      anguloY = 0
   };
   if(keyboard.down("Q"))
   {
      anguloZ = anguloZ + 1
      var rad = THREE.MathUtils.degToRad(anguloZ)
      cameraholder.rotateX(rad)
      anguloZ = 0
   };
   if(keyboard.down("E"))
   {
      anguloZ = anguloZ - 1
      var rad = THREE.MathUtils.degToRad(anguloZ)
      cameraholder.rotateX(rad)
      anguloZ = 0
   };
   // DICA: Insira aqui seu código para mover a câmera
}

function createTeapot(x, y, z, color )
{
   var geometry = new TeapotGeometry(0.5);
   var material = new THREE.MeshPhongMaterial({color, shininess:"200"});
      material.side = THREE.DoubleSide;
   var obj = new THREE.Mesh(geometry, material);
      obj.castShadow = true;
      obj.position.set(x, y, z);
   scene.add(obj);
}

function render()
{
   requestAnimationFrame(render);
   keyboardUpdate();
   renderer.render(scene, camera) // Render scene
}