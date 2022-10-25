import * as THREE from  'three';
import Stats from '../build/jsm/libs/stats.module.js';
import GUI from '../libs/util/dat.gui.module.js'
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {TeapotGeometry} from '../build/jsm/geometries/TeapotGeometry.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {initRenderer, 
        InfoBox,
        SecondaryBox,
        initDefaultSpotlight,
        createGroundPlane,
        createLightSphere,        
        onWindowResize} from "../libs/util/util.js";

let scene, renderer, camera, stats, light, lightSphere, lightPosition, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer("rgb(30, 30, 42)");    // View function in util/utils
//renderer.shadowMap.enabled = true;
//  renderer.shadowMap.type  = THREE.VSMShadowMap; // default
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.lookAt(0, 0, 0);
  camera.position.set(2.18, 1.62, 3.31);
  camera.up.set( 0, 1, 0 );
orbit = new OrbitControls( camera, renderer.domElement );
stats = new Stats();          // To show FPS information

let ambientColor = "rgb(80,80,80)";
let ambientLight = new THREE.AmbientLight(ambientColor);
scene.add(ambientLight)

let positionDirecional = new THREE.Vector3(2.0,0.5,0.2);
let lightColor = "rgb(255,255,255)";
let direLight = new THREE.DirectionalLight(lightColor, 0.8)
    direLight.position.copy(positionDirecional)
    direLight.castShadow = true;
    direLight.shadow.mapSize.width = 256;
    direLight.shadow.mapSize.height = 256;
    direLight.shadow.camera.near = .1;
    direLight.shadow.camera.far = 6;
    direLight.shadow.camera.left = -2.5;
    direLight.shadow.camera.right = 2.5;
    direLight.shadow.camera.bottom = -2.5;
    direLight.shadow.camera.top = 2.5;
scene.add(direLight)

//lightPosition = new THREE.Vector3(2.5, 0.4, 1.3);
//light = initDefaultSpotlight(scene, lightPosition); // Use default light
//lightSphere = createLightSphere(scene, 0.1, 10, 10, lightPosition);

// To use the keyboard
var keyboard = new KeyboardState();

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

var groundPlane = createGroundPlane(6.0, 4.5, 50, 50); // width and height
  groundPlane.rotateX(THREE.MathUtils.degToRad(-90));
scene.add(groundPlane);

var infoBox = new SecondaryBox("");

//---------------------------------------------------------
// Build Materials

let phongObject, lambertObject, normalObject, normalFlatObject,
    toonObject, basicObject, wireframeObject;

// Teapot basic geometry
let Teapot = new TeapotGeometry(0.5);
let material = new THREE.MeshPhongMaterial({
  color:"rgb(255,20,20)",
  shininess:"200",
  specular:"rgb(255,255,255)"
})
let obj = new THREE.Mesh(Teapot,material)
obj.position.set(0,0.5,0)
obj.castShadow = true
scene.add(obj)

let sphere = new THREE.SphereGeometry( 0.5, 32, 16 )
let material2 = new THREE.MeshLambertMaterial({
  color:"rgb(144,238,144)"
})
let obj2 = new THREE.Mesh(sphere,material2)
obj2.position.set(-1.5,0.5,-1)
obj2.castShadow = true
obj2.receiveShadow = true
scene.add(obj2)

let cylinder = new THREE.CylinderGeometry( 0.1, 0.5, 1.5, 32 );
let material3 = new THREE.MeshPhongMaterial({
  color:"rgb(0,255,255)",
  flatShading: true
})
let obj3 = new THREE.Mesh(cylinder,material3)
obj3.position.set(1.5,0.76,1)
obj3.castShadow = true
obj3.receveShadow = true
scene.add(obj3)

render();

function render()
{
  stats.update();
  requestAnimationFrame(render);
  renderer.render(scene, camera)
}
