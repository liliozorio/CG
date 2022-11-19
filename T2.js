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
    onWindowResize,
    radiansToDegrees
} from "../libs/util/util.js";
import { CSG } from '../libs/other/CSGMesh.js'

const bbcube = [];
const cubeS = [];
const bbstairs = [];
const bbportal = [];
const ListEscadas = [];
const bbcubeportal = [];
const doors = { box: [], obj: [] };
const bbkey = [];
const get_key = [true,true,true,false]
const id_key = [];
const clickeObjects = { object: [], floor: [], top: [] }
const invisibleBrigde = [];
const blockElevationValue = 1.5;
let scene, renderer, camera, material, light, keyboard, orthographic, anguloY, aux_anguloY;
anguloY = 0;
orthographic = true;
scene = new THREE.Scene();
renderer = initRenderer();



var lookAtVec = new THREE.Vector3(0.0, 0.0, 0.0);
var camPosition = new THREE.Vector3(13, 12, 13);
var upVec = new THREE.Vector3(0.0, 1.0, 0.0);
var s = 105;
camera = new THREE.OrthographicCamera(-window.innerWidth / s, window.innerWidth / s,
    window.innerHeight / s, window.innerHeight / -s, -s, s);

camera.position.copy(camPosition);
camera.up.copy(upVec);
camera.lookAt(lookAtVec);


// GIRAR COM MOUSE
new OrbitControls(camera, renderer.domElement); // Enable mouse rotation, pan, zoom etc.



let cameraholder = new THREE.Object3D();
cameraholder.add(camera);
scene.add(cameraholder);


material = setDefaultMaterial("rgb(205,133,63)");

let ambientColor = "rgb(80,80,80)";
let ambientLight = new THREE.AmbientLight(ambientColor, 0.5);
scene.add(ambientLight)

let lightColor = "rgb(255,255,255)";
let positionDirectional = new THREE.Vector3(0,3,0)
let dirLight = new THREE.DirectionalLight(lightColor, 0.8)
    dirLight.position.copy(positionDirectional);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 256;
    dirLight.shadow.camera.near = .1;
    dirLight.shadow.camera.far = 6;
    dirLight.shadow.camera.left = -2.5;
    dirLight.shadow.camera.right = 2.5;
    dirLight.shadow.camera.bottom = -2.5;
    dirLight.shadow.camera.top = 2.5;
cameraholder.add(dirLight.target)
cameraholder.add(dirLight)

keyboard = new KeyboardState();
var clock = new THREE.Clock();

window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

const SIZE_PLANE = 40;
const SIZE_TILE = 0.8;
const NUM_CUBES = 0
const SIZE_OBSTACLE = 0.8;
const AVAILABLE_SPACE = SIZE_PLANE - 4;
const WALK_SIZE = 0.06;


let cubeGeometry = new THREE.BoxGeometry(SIZE_TILE, 0.01, SIZE_TILE);
let cubeGeometry2 = new THREE.BoxGeometry(1, 2, 1);


var playAction;
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

loadGLTFFile(asset, '../assets/objects/walkingMan.glb', true, 0, 0, 0, '', false);
loadGLTFFile(asset2, '../assets/objects/walkingMan.glb', false, 0, 0, 0, '', false);

loadGLTFFile(key1, './key.glb', true, 0, -2, -77, "rgb(72,61,139)", true);
loadGLTFFile(key2, './key.glb', true, 0, 4, 72, "rgb(128,0,0)", true);
loadGLTFFile(key3, './key.glb', true, 72, -2, 0, "rgb(255,215,0)", true);

// CREATE LIGHT SWITCH

function createLightSwitch(x,y,z)
{
    let cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    let materialEmissive = setDefaultMaterial("rgb(255,215,0)");
        materialEmissive.emissive.set("rgb(255,215,0)")
    let cubeTest = new THREE.Mesh(cubeGeometry, materialEmissive);
        cubeTest.position.set(x, y, z);
    scene.add(cubeTest)
}

createLightSwitch(33, -2, 7.5)
createLightSwitch(43, -2, 7.5)
createLightSwitch(53, -2, 7.5)
createLightSwitch(63, -2, 7.5)
createLightSwitch(33, -2, -7.5)
createLightSwitch(43, -2, -7.5)
createLightSwitch(53, -2, -7.5)
createLightSwitch(63, -2, -7.5)

// CREATE SPOTLIGHT
function createSpotLight(x,y,z)
{
    let cubeGeometry3 = new THREE.BoxGeometry(0.01, 0.01, 0.01);
    let lightPosition = new THREE.Vector3(0, 5, 0);
    let cubeTest = new THREE.Mesh(cubeGeometry3, material);
        cubeTest.position.set(x, y, z);
    scene.add(cubeTest)
    let spotLight = new THREE.SpotLight("rgb(255,255,255)", 1);
    spotLight.position.copy(lightPosition);

    spotLight.distance = 0;
    spotLight.castShadow = true;
    spotLight.decay = 2;
    spotLight.penumbra = 0.5;
    spotLight.angle= THREE.MathUtils.degToRad(30);

    spotLight.shadow.mapSize.width = 512;
    spotLight.shadow.mapSize.height = 512;
    spotLight.shadow.camera.fov = radiansToDegrees(spotLight.angle);
    spotLight.shadow.camera.near = .2;    
    spotLight.shadow.camera.far = 20.0;   
    cubeTest.add(spotLight);     
    cubeTest.add(spotLight.target)
}

createSpotLight(33,0,5)
createSpotLight(43,0,5)
createSpotLight(53,0,5)
createSpotLight(63,0,5)
createSpotLight(33,0,-5)
createSpotLight(43,0,-5)
createSpotLight(53,0,-5)
createSpotLight(63,0,-5)

// CREATE PLANE
function createGroundPlaneXZ(p, widthSegments = 10, heightSegments = 10, gcolor = null) {
    if (!gcolor) gcolor = "rgb(210,180,140)";
    let planeGeometry = new THREE.PlaneGeometry(p.w + 1, p.h + 1, widthSegments, heightSegments);
    let planeMaterial = new THREE.MeshLambertMaterial({ color: gcolor, side: THREE.DoubleSide });

    let mat4 = new THREE.Matrix4();
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    plane.matrixAutoUpdate = false;
    plane.matrix.identity();

    plane.matrix.multiply(mat4.makeTranslation(p.x, p.y, p.z));
    var plano_rad = THREE.MathUtils.degToRad(90);
    plane.matrix.multiply(mat4.makeRotationX((plano_rad)));

    return plane;
}

// CRIA CHÃO
function makeFloor(p) {
    let material1 = setDefaultMaterial(p.rgb);
    for (let x = p.x1; x <= p.x2; x += (SIZE_TILE * 1.08)) {
        for (let z = p.z1; z <= p.z2; z += (SIZE_TILE * 1.08)) {
            let cube = new THREE.Mesh(cubeGeometry, material1);
            cube.receiveShadow = true
            cube.position.set(x, p.y, z);
            scene.add(cube);
        }
    }
}

// CRIA BORDAS
function makeEdges(coor, sizeX, sizeZ, dif, q) {
    let aux1 = (coor.x + sizeX / 2);
    let aux2 = (coor.z + sizeZ / 2);
    let materialEmissive = setDefaultMaterial("rgb(205,133,63)");
        materialEmissive.emissive.set("rgb(205,133,63)")
    if (q.f1 != -1)
        for (let x = coor.x; x <= (coor.x + sizeX); x += 1.1) {
            if (q.f1 && x >= aux1 - dif && x <= aux1 + dif) {
                x = aux1 + 2.5;
                continue;
            }
            let cube = new THREE.Mesh(cubeGeometry2, materialEmissive);
            cube.position.set(x, coor.y, coor.z);
            bbcube.push(new THREE.Box3().setFromObject(cube));
            scene.add(cube);
        }
    if (q.f2 != -1)
        for (let x = coor.x; x <= (coor.x + sizeX); x += 1.1) {
            if (q.f2 && x >= aux1 - dif && x <= aux1 + dif) {
                x = aux1 + 2.5;
                continue;
            }
            let cube = new THREE.Mesh(cubeGeometry2, materialEmissive);
            cube.position.set(x, coor.y, coor.z + sizeZ);
            bbcube.push(new THREE.Box3().setFromObject(cube));
            scene.add(cube);
        }
    if (q.f3 != -1)
        for (let z = coor.z; z <= coor.z + sizeZ; z += 1.1) {
            if (q.f3 && z >= aux2 - dif && z <= aux2 + dif) {
                z = aux2 + 2.5;
                continue;
            }
            let cube = new THREE.Mesh(cubeGeometry2, materialEmissive);
            cube.position.set(coor.x, coor.y, z);
            bbcube.push(new THREE.Box3().setFromObject(cube));
            scene.add(cube);
        }
    if (q.f4 != -1)
        for (let z = coor.z; z <= coor.z + sizeZ; z += 1.1) {
            if (q.f4 && z >= aux2 - dif && z <= aux2 + dif) {
                z = aux2 + 2.5;
                continue;
            }
            let cube = new THREE.Mesh(cubeGeometry2, materialEmissive);
            cube.position.set(coor.x + sizeX, coor.y, z);
            bbcube.push(new THREE.Box3().setFromObject(cube));
            scene.add(cube);
        }
}
function createChambers() {
    const pp = {//planePositions
        p0: { x: 0.0, y: -0.1, z: 0.0, w: SIZE_PLANE + 1, h: SIZE_PLANE + 1 },
        p1: { x: 0, y: -3, z: -SIZE_PLANE - 6.4, w: SIZE_PLANE * 0.7, h: SIZE_PLANE * 0.9 },
        p2: { x: 0.0, y: 3, z: SIZE_PLANE + 6.5, w: SIZE_PLANE * 0.7, h: SIZE_PLANE * 0.9 },
        p3: { x: SIZE_PLANE + 8.6, y: -3, z: 0.0, w: SIZE_PLANE * 1, h: SIZE_PLANE * 0.4 },
        p4: { x: -SIZE_PLANE - 2.5, y: 3, z: 0.0, w: SIZE_PLANE * 0.7, h: SIZE_PLANE * 0.7 },
        p5: { x: 0, y: -3, z: -SIZE_PLANE * 1.89, w: SIZE_PLANE * 0.4, h: SIZE_PLANE * 0.4 },
        p6: { x: 0, y: 3, z: SIZE_PLANE * 1.82, w: SIZE_PLANE * 0.4, h: SIZE_PLANE * 0.4 },
        p7: { x: SIZE_PLANE * 1.82, y: -3, z: 0, w: SIZE_PLANE * 0.4, h: SIZE_PLANE * 0.4 },
        p8: { x: 0, y: -3, z: -SIZE_PLANE / 2 - 7, w: 7, h: 2 },
        p9: { x: 0, y: 3, z: SIZE_PLANE / 2 + 8, w: 7, h: 2 },
        p10: { x: SIZE_PLANE / 2 + 8, y: -3, z: 0, w: 2, h: 7 },
        p11: { x: -SIZE_PLANE / 2 - 8, y: 3, z: 0, w: 2, h: 7 },
    };

    for (let i = 0; i < 12; i++) {
            let plane = createGroundPlaneXZ(pp["p" + i]);
            scene.add(plane);
        
    }

    const auxCdnt = {
        p0: { rgb: "rgb(255,222,173)", x1: pp.p0.x - (pp.p0.w / 2 - 0.5), x2: pp.p0.x + pp.p0.w / 2, z1: pp.p0.z - (pp.p0.h / 2 - 0.5), z2: pp.p0.z + (pp.p0.h / 2 - 0.5), y: 0.05 },
        p1: { rgb: "rgb(152,251,152)", x1: pp.p1.x - (pp.p1.w / 2), x2: pp.p1.x + pp.p1.w / 2, z1: pp.p1.z - (pp.p1.h / 2), z2: pp.p1.z + (pp.p1.h / 2), y: -2.95 },
        p2: { rgb: "rgb(173,216,230)", x1: pp.p2.x - (pp.p2.w / 2), x2: pp.p2.x + pp.p2.w / 2, z1: pp.p2.z - (pp.p2.h / 2), z2: pp.p2.z + (pp.p2.h / 2), y: 3.05 },
        p3: { rgb: "rgb(250,128,114)", x1: pp.p3.x - (pp.p3.w / 2), x2: pp.p3.x + pp.p3.w / 2, z1: pp.p3.z - (pp.p3.h / 2), z2: pp.p3.z + (pp.p3.h / 2), y: -2.95 },
        p4: { rgb: "rgb(240,230,140)", x1: pp.p4.x - (pp.p4.w / 2), x2: pp.p4.x + pp.p4.w / 2, z1: pp.p4.z - (pp.p4.h / 2), z2: pp.p4.z + (pp.p4.h / 2), y: 3.05 },
        p5: { rgb: "rgb(152,251,152)", x1: pp.p5.x - (pp.p5.w / 2), x2: pp.p5.x + pp.p5.w / 2, z1: pp.p5.z - (pp.p5.h / 2), z2: pp.p5.z + (pp.p5.h / 2), y: -2.95 },
        p6: { rgb: "rgb(173,216,230)", x1: pp.p6.x - (pp.p6.w / 2), x2: pp.p6.x + pp.p6.w / 2, z1: pp.p6.z - (pp.p6.h / 2), z2: pp.p6.z + (pp.p6.h / 2), y: 3.05 },
        p7: { rgb: "rgb(250,128,114)", x1: pp.p7.x - (pp.p7.w / 2), x2: pp.p7.x + pp.p7.w / 2, z1: pp.p7.z - (pp.p7.h / 2), z2: pp.p7.z + (pp.p7.h / 2), y: -2.95 },
        p8: { rgb: "rgb(152,251,152)", x1: pp.p8.x - (pp.p8.w / 2), x2: pp.p8.x + pp.p8.w / 2, z1: pp.p8.z - (pp.p8.h / 2), z2: pp.p8.z + (pp.p8.h / 2), y: -2.95 },
        p9: { rgb: "rgb(173,216,230)", x1: pp.p9.x - (pp.p9.w / 2), x2: pp.p9.x + pp.p9.w / 2, z1: pp.p9.z - (pp.p9.h / 2), z2: pp.p9.z + (pp.p9.h / 2), y: 3.05 },
        p10: { rgb: "rgb(250,128,114)", x1: pp.p10.x - (pp.p10.w / 2), x2: pp.p10.x + pp.p10.w / 2, z1: pp.p10.z - (pp.p10.h / 2), z2: pp.p10.z + (pp.p10.h / 2), y: -2.95 },
        p11: { rgb: "rgb(240,230,140)", x1: pp.p11.x - (pp.p11.w / 2) - 0.5, x2: pp.p11.x + pp.p11.w / 2 + 0.5, z1: pp.p11.z - (pp.p11.h / 2), z2: pp.p11.z + (pp.p11.h / 2), y: 3.05 },
    }
    for (let i = 0; i < 12; i++) {
        if (i == 1 || i == 5) {
            makeFloor(auxCdnt["p" + i]);
            randomCube(auxCdnt["p" + i], 6);
        }
        else
            makeFloor(auxCdnt["p" + i]);
    }
    makeEdges({ x: auxCdnt.p0.x1, y: 1, z: auxCdnt.p0.z1 }, pp.p0.w - 1, pp.p0.h - 1, 3, { f1: 1, f2: 1, f3: 1, f4: 1 })
    makeEdges({ x: auxCdnt.p1.x1, y: -2, z: auxCdnt.p1.z1 }, pp.p1.w, pp.p1.h, 3, { f1: 1, f2: 1, f3: 0, f4: 0 })
    makeEdges({ x: auxCdnt.p2.x1, y: 4, z: auxCdnt.p2.z1 }, pp.p2.w, pp.p2.h, 3, { f1: 1, f2: 1, f3: 0, f4: 0 })
    makeEdges({ x: auxCdnt.p3.x1, y: -2, z: auxCdnt.p3.z1 }, pp.p3.w, pp.p3.h, 3, { f1: 0, f2: 0, f3: 1, f4: 1 })
    makeEdges({ x: auxCdnt.p4.x1, y: 4, z: auxCdnt.p4.z1 }, pp.p4.w, pp.p4.h, 3, { f1: 0, f2: 0, f3: 0, f4: 1 })
    makeEdges({ x: auxCdnt.p5.x1, y: -2, z: auxCdnt.p5.z1 }, pp.p5.w, pp.p5.h, 3, { f1: 0, f2: 1, f3: 0, f4: 0 })
    makeEdges({ x: auxCdnt.p6.x1, y: 4, z: auxCdnt.p6.z1 }, pp.p6.w, pp.p6.h, 3, { f1: -1, f2: 0, f3: 0, f4: 0 })
    makeEdges({ x: auxCdnt.p7.x1, y: -2, z: auxCdnt.p7.z1 }, pp.p7.w, pp.p7.h, 3, { f1: 0, f2: 0, f3: -1, f4: 0 })
    makeEdges({ x: auxCdnt.p8.x1, y: -2, z: auxCdnt.p8.z1 }, pp.p8.w, pp.p8.h, 3, { f1: -1, f2: -1, f3: 0, f4: 0 })
    makeEdges({ x: auxCdnt.p9.x1, y: 4, z: auxCdnt.p9.z1 }, pp.p9.w, pp.p9.h, 3, { f1: -1, f2: -1, f3: 0, f4: 0 })
    makeEdges({ x: auxCdnt.p10.x1, y: -2, z: auxCdnt.p10.z1 }, pp.p10.w, pp.p10.h, 3, { f1: 0, f2: 0, f3: -1, f4: -1 })
    makeEdges({ x: auxCdnt.p11.x1 + 1.5, y: 4, z: auxCdnt.p11.z1 }, pp.p11.w, pp.p11.h, 3, { f1: 0, f2: 0, f3: -1, f4: -1 })

}

let randomCoordinate = () => Math.floor((Math.random() * AVAILABLE_SPACE) - AVAILABLE_SPACE / 2)
let randomCoordinate2 = () => (Math.random() * AVAILABLE_SPACE) - AVAILABLE_SPACE / 2
let chooseCoordenate = () => Math.random()


createChambers()

// CRIA PORTAL
function makePortal(rgb) {
    let cube1 = new THREE.Mesh(new THREE.BoxGeometry(6, 6, 1));
    let cube2 = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 1));
    let cylinder = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 1, 32));

    cube2.position.set(0, -1, 0);
    cube2.matrixAutoUpdate = false;
    cube2.updateMatrix();

    cylinder.position.set(0, 0.7, 0);
    cylinder.rotateX(THREE.MathUtils.degToRad(90))
    cylinder.matrixAutoUpdate = false;
    cylinder.updateMatrix();

    let cubeCSG1 = CSG.fromMesh(cube1);
    let cubeCSG2 = CSG.fromMesh(cube2);
    let sphereCSG = CSG.fromMesh(cylinder);
    let csgObject = cubeCSG1.subtract(cubeCSG2);
    csgObject = csgObject.subtract(sphereCSG);
    let csgFinal = CSG.toMesh(csgObject, new THREE.Matrix4());
    csgFinal.material = new THREE.MeshPhongMaterial({ color: rgb });
    csgFinal.material.emissive.set(rgb)
    return csgFinal;
}

function makeHiddenCube(x, y, z) {
    let cubeGeometry = new THREE.BoxGeometry(0.8, 3, 0.8);
    let hiddenCube = new THREE.Mesh(cubeGeometry, material);
    hiddenCube.position.set(x, y, z);
    bbcube.push(new THREE.Box3().setFromObject(hiddenCube));
    scene.add(hiddenCube);
}

// INSERE OS PORTAIS EM SUAS DEVIDAS POSIÇÕES
function insertPortal() {
    const posPortal = {
        p1: { x: 0, y: 0, z: -28.5, color: "rgb(46,139,87)", rotation: 0 },
        p2: { x: 0, y: 6, z: 28.4, color: "rgb(25,25,112)", rotation: 0 },
        p3: { x: 28.5, y: 0, z: 0, color: "rgb(165,42,42)", rotation: 90 },
        p4: { x: -28.4, y: 6, z: 0, color: "rgb(255,215,0)", rotation: 90 },
        p5: { x: 0, y: 0, z: -68, color: "rgb(46,139,87)", rotation: 0 },
        p6: { x: 0, y: 6, z: 64.5, color: "rgb(25,25,112)", rotation: 0 },
        p7: { x: 68.4, y: 0, z: 0, color: "rgb(165,42,42)", rotation: 90 },
    }

    for (let i = 1; i < 8; i++) {
        let portalArea = makePortal(posPortal["p" + i].color);
        let doorArea = makeDoor("rgb(0,0,0)");
        portalArea.position.set(posPortal["p" + i].x, posPortal["p" + i].y, posPortal["p" + i].z);
        doorArea.position.set(posPortal["p" + i].x, posPortal["p" + i].y, posPortal["p" + i].z);
        portalArea.rotateY(THREE.MathUtils.degToRad(posPortal["p" + i].rotation));
        doorArea.rotateY(THREE.MathUtils.degToRad(posPortal["p" + i].rotation));
        scene.add(portalArea);
        scene.add(doorArea);
        if (posPortal["p" + i].x == 0) {
            makeHiddenCube(posPortal["p" + i].x - 2.5, posPortal["p" + i].y - 1.5, posPortal["p" + i].z)
            makeHiddenCube(posPortal["p" + i].x + 2.5, posPortal["p" + i].y - 1.5, posPortal["p" + i].z)
        }
        else {
            makeHiddenCube(posPortal["p" + i].x, posPortal["p" + i].y - 1.5, posPortal["p" + i].z - 2.5)
            makeHiddenCube(posPortal["p" + i].x, posPortal["p" + i].y - 1.5, posPortal["p" + i].z + 2.5)
        }
        bbportal.push(new THREE.Box3().setFromObject(portalArea));
        doors.box.push(new THREE.Box3().setFromObject(doorArea));
        doors.obj.push(doorArea)
    }
}

insertPortal()

// CRIA AS PORTAS
function makeDoor(rgb) {
    let cube2 = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 1));
    let cylinder = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 1, 32));

    cube2.position.set(0, -1, 0);
    cube2.matrixAutoUpdate = false;
    cube2.updateMatrix();

    cylinder.position.set(0, 0.7, 0);
    cylinder.rotateX(THREE.MathUtils.degToRad(90))
    cylinder.matrixAutoUpdate = false;
    cylinder.updateMatrix();

    let cubeCSG2 = CSG.fromMesh(cube2);
    let sphereCSG = CSG.fromMesh(cylinder);
    let csgObject = cubeCSG2.union(sphereCSG);
    let csgFinal = CSG.toMesh(csgObject, new THREE.Matrix4());
    csgFinal.material = new THREE.MeshPhongMaterial({ color: rgb });
    csgFinal.material.emissive.set(rgb)
    return csgFinal;

}

// FAZ AS ESCADAS
function makeStairs(rgb) {
    let stairs = {
        object: null,
        inclinacao: null
    }
    let cube = new THREE.Mesh(new THREE.BoxGeometry(6, 3, 6));
    let rectangle = new THREE.Mesh(new THREE.BoxGeometry(7, 0.25, 0.5));
    cube.position.set(0, 1.5, 0)
    cube.matrixAutoUpdate = false;
    cube.updateMatrix();

    let cubeCSG = CSG.fromMesh(cube);
    let rectangleCSG = CSG.fromMesh(rectangle);
    let csgObject;
    let z = -2.25, y = 2.88;
    for (let aux = 2.88; aux >= 0; aux -= 0.25) {
        for (let y = 2.88; y >= aux; y -= 0.25) {
            rectangle.position.set(0, y, z)
            rectangle.matrixAutoUpdate = false;
            rectangle.updateMatrix();
            rectangleCSG = CSG.fromMesh(rectangle);
            if (csgObject == undefined) {
                csgObject = cubeCSG.subtract(rectangleCSG);
            }
            else {
                csgObject = csgObject.subtract(rectangleCSG);
            }
        }
        z += 0.5
    }
    let csgFinal = CSG.toMesh(csgObject, new THREE.Matrix4());
    csgFinal.material = new THREE.MeshPhongMaterial({ color: rgb });
    stairs.object = csgFinal;
    return stairs;
}

// INSERE AS ESCADAS EM SUAS DEVIDAS POSICOES
function insertStairs() {
    let escadaArea1 = makeStairs("rgb(143,188,143)");
    escadaArea1.object.rotateY(THREE.MathUtils.degToRad(180));
    escadaArea1.object.position.set(0, -3, -23.5);
    escadaArea1.inclinacao = 'negativo'
    bbstairs.push(new THREE.Box3().setFromObject(escadaArea1.object));
    ListEscadas.push(escadaArea1);
    scene.add(escadaArea1.object);
    let escadaArea2 = makeStairs("rgb(72,61,139)");
    escadaArea2.object.rotateY(THREE.MathUtils.degToRad(180));
    escadaArea2.object.position.set(0, 0, 23.5);
    escadaArea2.inclinacao = 'positivo'
    bbstairs.push(new THREE.Box3().setFromObject(escadaArea2.object));
    ListEscadas.push(escadaArea2);
    scene.add(escadaArea2.object);
    let escadaArea3 = makeStairs("rgb(128,0,0)");
    escadaArea3.object.rotateY(THREE.MathUtils.degToRad(90));
    escadaArea3.object.position.set(23.5, -3, 0);
    escadaArea3.inclinacao = 'negativo'
    bbstairs.push(new THREE.Box3().setFromObject(escadaArea3.object));
    ListEscadas.push(escadaArea3);
    scene.add(escadaArea3.object);
    let escadaFinal = makeStairs("rgb(255,215,0)");
    escadaFinal.object.rotateY(THREE.MathUtils.degToRad(90));
    escadaFinal.object.position.set(-SIZE_PLANE / 2 - 3.5, 0, 0);
    escadaFinal.inclinacao = 'positivo'
    bbstairs.push(new THREE.Box3().setFromObject(escadaFinal.object));
    ListEscadas.push(escadaFinal);
    scene.add(escadaFinal.object);
}

insertStairs();

//CRIA CUBOS EM LOCAIS ALEATORIOS
function randomCube(p, numB) {
    let c = new THREE.BoxGeometry(SIZE_OBSTACLE, SIZE_OBSTACLE, SIZE_OBSTACLE);
    let aux = {
        object: null,
        bb: new THREE.Box3()
    }
    for (let i = 0; i < numB; i++) {
        let x;
        let z;
        if (chooseCoordenate() < 0.5) {
            x = p.x1 + Math.abs(randomCoordinate2(Math.abs(p.x1 - p.x2)));
            z = p.z1 + Math.abs(randomCoordinate(Math.abs(p.z1 - p.z2)));

        } else {
            x = p.x1 + Math.abs(randomCoordinate(Math.abs(p.x1 - p.x2)));
            z = p.z1 + Math.abs(randomCoordinate2(Math.abs(p.z1 - p.z2)));
        }
        let m = setDefaultMaterial("rgb(222,184,135)");
        let cube = new THREE.Mesh(c, m);
        cube.position.set(x, p.y + 0.6, z);
        aux.object = cube;
        aux.bb = new THREE.Box3().setFromObject(cube);
        //asset2.bb.setFromObject(asset2.object);

        if ((!checkCollisions(bbcube, aux))) {
            cube.name = "randomCube";
            bbcube.push(new THREE.Box3().setFromObject(cube));
            cubeS.push(cube);
            scene.add(cube);
        } else {
            cube.remove();
            i--;
        }
    }
}

// CREATE CUBES AREA 3
function cubesArea3()
{
    
}

let spotLightMan = new THREE.SpotLight("rgb(255,255,255)", 0);
let lightPositionMan = new THREE.Vector3(0, 7, 0);

    spotLightMan.position.copy(lightPositionMan);
    spotLightMan.distance = 0;
    spotLightMan.castShadow = true;
    spotLightMan.decay = 2;
    spotLightMan.penumbra = 0.5;
    spotLightMan.angle= THREE.MathUtils.degToRad(10);

    spotLightMan.shadow.mapSize.width = 512;
    spotLightMan.shadow.mapSize.height = 512;
    spotLightMan.shadow.camera.fov = radiansToDegrees(spotLightMan.angle);
    spotLightMan.shadow.camera.near = .2;    
    spotLightMan.shadow.camera.far = 20.0; 
    
    cameraholder.add(spotLightMan)
    cameraholder.add(spotLightMan.target)

// INICIALIZA PERSONEGEM
function loadGLTFFile(asset, file, add_scene, x, y, z, color, iskey) {
    var loader = new GLTFLoader();
    loader.load(file, function (gltf) {
        var obj = gltf.scene;
        obj.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                if (color != '') {
                    child.material = setDefaultMaterial(color);
                }
            }
        });
        obj = normalizeAndRescale(obj, 2);
        obj.updateMatrixWorld(true);
        obj.position.x = x
        obj.position.y = y
        obj.position.z = z

        if (add_scene) {
            scene.add(obj);
            //scene.add(asset.object);
        }
        asset.object = gltf.scene;
        if (iskey) {
            bbkey.push(new THREE.Box3().setFromObject(asset.object));
            id_key.push(asset.object)
        }
        var mixerLocal = new THREE.AnimationMixer(obj);
        mixerLocal.clipAction(gltf.animations[0]).play();
        mixer.push(mixerLocal); 
    }, () => {}, () => {});
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
function movimentation(angulo_max, camX, camZ, camY, walkZ, walkX, walkY, walkZ_hide, walkX_hide, walkY_hide, deslisa) {

    if(angulo_max > anguloY)
    {
        var dif = angulo_max - anguloY
        var dif2 = 360 - angulo_max + anguloY
        if(dif2 < dif)
        {
            anguloY = anguloY + 360
        }
    }
    else
    {
        var dif = anguloY - angulo_max
        var dif2 = 360 - anguloY + angulo_max
        if(dif2 < dif)
        {
            angulo_max = angulo_max + 360
        }
    }  
    if (anguloY < angulo_max && !deslisa) {
        anguloY = anguloY + 5;
        var rad = THREE.MathUtils.degToRad(5);
        asset.object.rotateY(rad);
        asset2.object.rotateY(rad);
        if(anguloY > 360)
        {
            anguloY = anguloY -360
        }
    }
    else if (anguloY > angulo_max && !deslisa) {
        anguloY = anguloY - 5;
        var rad = THREE.MathUtils.degToRad(-5);
        asset.object.rotateY(rad);
        asset2.object.rotateY(rad);
        if(anguloY > 360)
        {
            anguloY = anguloY -360
        }
    }
    else if (deslisa)
    {
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
    }
    cameraholder.translateX(camX);
    cameraholder.translateZ(camZ);
    cameraholder.translateY(camY);
    asset.object.translateZ(walkZ);
    asset.object.translateX(walkX);
    asset.object.translateY(walkY);
    asset2.object.translateZ(walkZ_hide);
    asset2.object.translateX(walkX_hide);
    asset2.object.translateY(walkY_hide);
    asset.bb.setFromObject(asset.object);
    asset2.bb.setFromObject(asset2.object);
}

function movimentation_stairs(angulo_max, camX, camZ, camY, walkZ, walkX, walkY, walkZ_hide, walkX_hide, walkY_hide, deslisa)
{
    playAction = true;
    let id = getColissionObjectId(bbstairs, asset)
    movimentation(angulo_max, camX, camZ, camY, walkZ, walkX, walkY, walkZ_hide, walkX_hide, walkY_hide, deslisa);
    let collision = checkCollisions(bbstairs, asset)
    if(asset.object.position.y > 0 && asset.object.position.y < 1 && !collision)
    {
        asset.object.position.y = 0
        asset2.object.position.y = 0
        cameraholder.position.y = 0
        dirLight.intensity = 0.8
        ambientLight.intensity = 0.5
        //spotLightMan.intensity = 0
    }
    else if(asset.object.position.y < 0 && asset.object.position.y >-1 && !collision)
    {
        asset.object.position.y = 0
        asset2.object.position.y = 0
        cameraholder.position.y = 0
        dirLight.intensity = 0.8
        ambientLight.intensity = 0.5
        //spotLightMan.intensity = 0
    }
    else if(asset.object.position.y < -2 && !collision)
    {
        asset.object.position.y = -3
        asset2.object.position.y = -3
        cameraholder.position.y = -3
    }
    else if(asset.object.position.y > 2 && !collision)
    {
        asset.object.position.y = 3
        asset2.object.position.y = 3
        cameraholder.position.y = 3
    }
}

// TRATA OS MOVIMENTOS COM COLISÃO DO PERSONAGEM
function movimentation_colision(angulo_max, camX, camZ, walkZ, walkX, walkZ_hide, walkX_hide, deslisa) {
    playAction = true;
    var collision = checkCollisions(bbcube, asset)
    var collision_door = checkCollisions(doors.box, asset)
    var collision_portal = checkCollisions(bbportal, asset)
    if (!collision && !collision_door) {
        movimentation(angulo_max, camX, camZ, 0, walkZ, walkX, 0, walkZ_hide, walkX_hide, 0, deslisa);
    }
    else {
        movimentation(angulo_max, 0, 0, 0, 0, 0, 0, walkZ_hide, -0.6, 0, deslisa);
        collision = checkCollisions(bbcube, asset2);
        collision_door = checkCollisions(doors.box, asset2);
        collision_portal = checkCollisions(bbportal, asset2);
        var collision_cylinder = checkCollisions(bbcubeportal, asset2)
        if (collision || collision_door) {
            asset2.object.position.x = asset.object.position.x
            asset2.object.position.z = asset.object.position.z
            asset2.object.position.y = asset.object.position.y;
            asset2.bb.setFromObject(asset2.object);
            movimentation(angulo_max, 0, 0, 0, 0, 0, 0, walkZ_hide, 0.6, 0, deslisa);
            collision = checkCollisions(bbcube, asset2);
            if (collision || collision_door) {
                asset2.object.position.x = asset.object.position.x
                asset2.object.position.z = asset.object.position.z
                asset2.object.position.y = asset.object.position.y;
                asset2.bb.setFromObject(asset2.object);
            }
            else {
                asset2.object.position.x = asset.object.position.x
                asset2.object.position.z = asset.object.position.z
                asset2.object.position.y = asset.object.position.y;
                movimentation(angulo_max, camX, camZ, 0, walkZ, walkX, 0, walkZ_hide, walkX_hide, 0, deslisa);
            }
        }
        else {
            asset2.object.position.x = asset.object.position.x
            asset2.object.position.z = asset.object.position.z
            asset2.object.position.y = asset.object.position.y;
            movimentation(angulo_max, camX, camZ, 0, walkZ, walkX, 0, walkZ_hide, walkX_hide, 0, deslisa);
        }
    }
    return collision
}

// COMANDOS DO TECLADO
function keyboardUpdate() {

    keyboard.update()
    let aux_collision;
    var escada = checkCollisions(bbstairs, asset)
    if (keyboard.pressed("A") && keyboard.pressed("S") || keyboard.pressed("left") && keyboard.pressed("down")) {
        var rad = THREE.MathUtils.degToRad(anguloY);
        if(escada)
        {
            var select_stairs = getColissionObjectId(bbstairs, asset)
            if(select_stairs == 0)
            {
                movimentation_stairs(0, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false);
            }
            else if(select_stairs == 1)
            {
                movimentation_stairs(0, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false);
            }
            if(select_stairs == 2)
            {
                movimentation_stairs(0, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0, WALK_SIZE, 0, 0, WALK_SIZE, 0, 0, false);
            } 
            else if(select_stairs == 3)
            {
                movimentation_stairs(0, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0, WALK_SIZE, 0, 0, WALK_SIZE, 0, 0, false);
            }
        }
        else
        {
            movimentation_colision(0, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, false);
        }
    }
    else if (keyboard.pressed("A") && keyboard.pressed("W") || keyboard.pressed("left") && keyboard.pressed("up")) {
        var rad = THREE.MathUtils.degToRad(anguloY);
        if(escada)
        {
            var select_stairs = getColissionObjectId(bbstairs, asset)
            if(select_stairs == 0)
            {
                movimentation_stairs(270, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0, WALK_SIZE, 0, 0,WALK_SIZE, 0, 0, false);
            }
            else if(select_stairs == 1)
            {
                movimentation_stairs(270, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0, WALK_SIZE, 0, 0, WALK_SIZE, 0, 0, false);
            }
            if(select_stairs == 2)
            {
                movimentation_stairs(270, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false);
                dirLight.intensity = dirLight.intensity + 0.01
                ambientLight.intensity = ambientLight.intensity + 0.01
                if(spotLightMan.intensity > 0)
                {
                    spotLightMan.intensity = spotLightMan.intensity - 0.01
                }
            }
            else if(select_stairs == 3)
            {
                movimentation_stairs(270, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false);
            }
        }
        else
        {
            movimentation_colision(270, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, false);
        }
    }
    else if (keyboard.pressed("D") && keyboard.pressed("S") || keyboard.pressed("right") && keyboard.pressed("down")) {
        var rad = THREE.MathUtils.degToRad(anguloY);
        if(escada)
        {
            var select_stairs = getColissionObjectId(bbstairs, asset)
            if(select_stairs == 0)
            {
                movimentation_stairs(90, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0, WALK_SIZE, 0, 0, WALK_SIZE, 0, 0, false);
            }
            else if(select_stairs == 1)
            {
                movimentation_stairs(90, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0, WALK_SIZE, 0, 0, WALK_SIZE, 0, 0, false);
            }
            if(select_stairs == 2)
            {
                movimentation_stairs(90, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false);
                dirLight.intensity = dirLight.intensity - 0.01
                ambientLight.intensity = ambientLight.intensity - 0.01
                if(spotLightMan.intensity <1)
                {
                    spotLightMan.intensity = spotLightMan.intensity + 0.01
                }
            }
            else if(select_stairs == 3)
            {
                movimentation_stairs(90, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false);
            }
        }
        else
        {
            movimentation_colision(90, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, false);
        }
    }
    else if (keyboard.pressed("D") && keyboard.pressed("W") || keyboard.pressed("right") && keyboard.pressed("up")) {
        var rad = THREE.MathUtils.degToRad(anguloY);
        if(escada)
        {
            var select_stairs = getColissionObjectId(bbstairs, asset)
            if(select_stairs == 0)
            {
                movimentation_stairs(180, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false);
            }
            else if(select_stairs == 1)
            {
                movimentation_stairs(180, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false);
            }
            if(select_stairs == 2)
            {
                movimentation_stairs(180, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0, WALK_SIZE, 0, 0, WALK_SIZE, 0, 0, false);
            }
            else if(select_stairs == 3)
            {
                movimentation_stairs(180, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0, WALK_SIZE, 0, 0, WALK_SIZE, 0, 0, false);
            }
        }
        else
        {
            movimentation_colision(180, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, false);
        }
    }
    else if (keyboard.pressed("A") || keyboard.pressed("left")) {
        var rad = THREE.MathUtils.degToRad(anguloY);
        if(escada)
        {
            var select_stairs = getColissionObjectId(bbstairs, asset)
            if(select_stairs == 0)
            {
                movimentation_stairs(315, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false);
            }
            else if(select_stairs == 1)
            {
                movimentation_stairs(315, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false);
            }
            if(select_stairs == 2)
            {
                movimentation_stairs(315, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false);
                dirLight.intensity = dirLight.intensity + 0.01
                ambientLight.intensity = ambientLight.intensity + 0.01
                if(spotLightMan.intensity > 0)
                {
                    spotLightMan.intensity = spotLightMan.intensity - 0.01
                }
            }
            else if(select_stairs == 3)
            {
                movimentation_stairs(315, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false);
            }
        }
        else
        {
            aux_collision = movimentation_colision(315, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, false);
            if(aux_collision)
            {
                movimentation_colision(270, Math.sin(THREE.MathUtils.degToRad(270)) * WALK_SIZE, Math.cos(THREE.MathUtils.degToRad(270)) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, true);
                movimentation_colision(0, Math.sin(THREE.MathUtils.degToRad(0)) * WALK_SIZE, Math.cos(THREE.MathUtils.degToRad(0)) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, true);
                movimentation_colision(315, 0, 0, 0, 0, 0, 0, true);
            }
        }
    }
    else if (keyboard.pressed("D") || keyboard.pressed("right")) {
        var rad = THREE.MathUtils.degToRad(anguloY);
        if(escada)
        {
            var select_stairs = getColissionObjectId(bbstairs, asset)
            if(select_stairs == 0)
            {
                movimentation_stairs(135, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false);
            }
            else if(select_stairs == 1)
            {
                movimentation_stairs(135, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false);
            }
            if(select_stairs == 2)
            {
                movimentation_stairs(135, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false);
                dirLight.intensity = dirLight.intensity - 0.01
                ambientLight.intensity = ambientLight.intensity - 0.01
                if(spotLightMan.intensity<1)
                {
                    spotLightMan.intensity = spotLightMan.intensity + 0.01
                }
            }
            else if(select_stairs == 3)
            {
                movimentation_stairs(135, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false);
            }
        }
        else
        {
            aux_collision = movimentation_colision(135, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, false);
            if(aux_collision)
            {
                movimentation_colision(180, Math.sin(THREE.MathUtils.degToRad(180)) * WALK_SIZE, Math.cos(THREE.MathUtils.degToRad(180)) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, true);
                movimentation_colision(90, Math.sin(THREE.MathUtils.degToRad(90)) * WALK_SIZE, Math.cos(THREE.MathUtils.degToRad(90)) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, true);
                movimentation_colision(135, 0, 0, 0, 0, 0, 0, true);
            }
        }
    }
    else if (keyboard.pressed("S") || keyboard.pressed("down")) {
        var rad = THREE.MathUtils.degToRad(anguloY);
        if(escada)
        {
            var select_stairs = getColissionObjectId(bbstairs, asset)
            if(select_stairs == 0)
            {
                movimentation_stairs(45, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false);
            }
            else if(select_stairs == 1)
            {
                movimentation_stairs(45, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false);
            }
            if(select_stairs == 2)
            {
                movimentation_stairs(45, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false);
                dirLight.intensity = dirLight.intensity - 0.01
                ambientLight.intensity = ambientLight.intensity - 0.01
                if(spotLightMan.intensity<1)
                {
                    spotLightMan.intensity = spotLightMan.intensity + 0.01
                }
            }
            else if(select_stairs == 3)
            {
                movimentation_stairs(45, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false);
            }
        }
        else
        {
            aux_collision = movimentation_colision(45, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, false);
            if(aux_collision)
            {
                movimentation_colision(0, Math.sin(THREE.MathUtils.degToRad(0)) * WALK_SIZE, Math.cos(THREE.MathUtils.degToRad(0)) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, true);
                movimentation_colision(90, Math.sin(THREE.MathUtils.degToRad(90)) * WALK_SIZE, Math.cos(THREE.MathUtils.degToRad(90)) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, true);
                movimentation_colision(45, 0, 0, 0, 0, 0, 0, true);
            }
        }
    }
    else if (keyboard.pressed("W") || keyboard.pressed("up")) {
        var rad = THREE.MathUtils.degToRad(anguloY);
        if(escada)
        {
            var select_stairs = getColissionObjectId(bbstairs, asset)
            if(select_stairs == 0)
            {
                movimentation_stairs(225, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false);
            }
            else if(select_stairs == 1)
            {
                movimentation_stairs(225, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false);
            }
            if(select_stairs == 2)
            {
                movimentation_stairs(225, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false);
                dirLight.intensity = dirLight.intensity + 0.01
                ambientLight.intensity = ambientLight.intensity + 0.01
                if(spotLightMan.intensity > 0)
                {
                    spotLightMan.intensity = spotLightMan.intensity - 0.01
                }
            }
            else if(select_stairs == 3)
            {
                movimentation_stairs(225, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false);
            }
        }
        else
        {
            aux_collision = movimentation_colision(225, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, false);
            if(aux_collision)
            {
                movimentation_colision(270, Math.sin(THREE.MathUtils.degToRad(270)) * WALK_SIZE, Math.cos(THREE.MathUtils.degToRad(270)) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, true);
                movimentation_colision(180, Math.sin(THREE.MathUtils.degToRad(180)) * WALK_SIZE, Math.cos(THREE.MathUtils.degToRad(180)) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, true);
                movimentation_colision(225, 0, 0, 0, 0, 0, 0, true);
            }
        }
    }
    else {
        playAction = false;
    }
    if (keyboard.down("C")) {
        if (orthographic) {
            camPosition = new THREE.Vector3(14, 12, 14);
            camera = new THREE.PerspectiveCamera(31, window.innerWidth / window.innerHeight, 0.1, s);
            camera.position.copy(camPosition);
            camera.up.copy(upVec);
            camera.lookAt(lookAtVec);

            cameraholder.add(camera);
            scene.add(cameraholder);
            orthographic = false;
        }
        else {
            camPosition = new THREE.Vector3(13, 12, 13);
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

// PEGA O OBJETO COLIDIDO
function getColissionObjectId(object, man) {
    for (var i = 0; i < object.length; i++) {
        let collision = man.bb.intersectsBox(object[i]);
        if (collision) {
            return i;
        }
    }
}

// CHECA SE EXISTE COLISÃO
function checkCollisions(object, man) {
    try {
        let collision = man.bb.intersectsBox(object);
        if (collision) {
            return true;
        }
    }
    catch (e) {

        for (var i = 0; i < object.length; i++) {
            let collision = man.bb.intersectsBox(object[i]);
            if (collision) {
                return true;
            }
        }
    }
    return false
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// CHECA CLIQUE NO BLOCO
let click = false;
function clickElement(events) {
    pointer.x = (events.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (events.clientY / window.innerHeight) * 2 + 1;
    click = true;
}

let indexDoor
let colors = ["rgb(222,184,135)", "rgb(165,42,42)"];
function render() {
    if (checkCollisions(doors.box, asset)) {
        indexDoor = getColissionObjectId(doors.box , asset)
    }
    if(get_key[indexDoor])
    {
        lerpConfig.destination = new THREE.Vector3(doors.obj[indexDoor].position.x, -6.0, doors.obj[indexDoor].position.z)
        doors.obj[indexDoor].position.lerp(lerpConfig.destination, lerpConfig.alpha);
        doors.box[indexDoor] = new THREE.Box3().setFromObject(doors.obj[indexDoor]);
    }
    if (checkCollisions(bbkey, asset))
    {
        let indexkey = getColissionObjectId(bbkey, asset)
        id_key[indexkey].removeFromParent()
        get_key[indexkey+1] = true
    }
    if (asset2.object && !asset2.loaded) {
        asset2.bb.setFromObject(asset2.object);
        asset2.loaded = true;
        asset.loaded = true;
    }
    var delta = clock.getDelta();
    requestAnimationFrame(render);
    keyboardUpdate();
    renderer.render(scene, camera) // Render scene
    if (playAction) {
        for (var i = 0; i < mixer.length; i++)
            mixer[i].update(delta * 2.3);
    };
    /*if (click) {
        renderer.render(scene, camera);
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        // const test = raycaster.intersectObjects(scene.children)
        const blockFromAsset = 2;
        

        if (intersects[0].object.name === "randomCube") {
            let isNear = Math.pow(intersects[0].object.position.x - asset.object.position.x, 2) + Math.pow(intersects[0].object.position.z - asset.object.position.z, 2);
            isNear = Math.sqrt(isNear);
            if (intersects[0].object.material.color.getHexString() == "deb887" && isNear <=2) {
                
                cubeS.forEach((bloco, indexRandomBlock) => {
                    if (bloco.uuid && bloco.uuid == intersects[0].object.uuid) {
                        var indexCube = new THREE.Box3().setFromObject(bloco);
                        let counter = 0;
                        bbcube.forEach((bloco,indexbbCube)=>{
                            counter++;
                            if(bloco.max && bloco.min && bloco.max.x == indexCube.max.x && bloco.max.z == indexCube.max.z &&
                                bloco.min.x == indexCube.min.x && bloco.min.x == indexCube.min.x){
                                    cubeS.splice(indexRandomBlock,1)
                                    bbcube.splice(indexbbCube,1)
                            }
                        })
                    }
                })
                
                
                let sqrtPosition = Math.pow(intersects[0].object.position.x - cameraholder.position.x, 2) + Math.pow(intersects[0].object.position.z - cameraholder.position.z, 2);
                sqrtPosition = Math.sqrt(sqrtPosition);
                
                
                
                
                
                intersects[0].object.rotation.set(0, 0, 0);
                intersects[0].object.position.set(
                    0,
                    0.65,
                    blockFromAsset,
                );

                asset.obj3D.add(intersects[0].object);
                //jeito errado de selecionar blocos

                //registra elemento(s) clicado(s) . Objetos que devem ser elevados
                clickeObjects.object.push(intersects[0].object)
                clickeObjects.floor.push(intersects[0].object.position.y)
                clickeObjects.top.push(intersects[0].object.position.y + blockElevationValue)

                //altera a cor ao clicar
                intersects[0].object.material.color.set(colors[1]);
            } else if (intersects[0].object.material.color.getHexString() != "deb887") {
                intersects[0].object.material.color.set(colors[0]);
                asset.obj3D.remove(intersects[0].object)

                scene.add(intersects[0].object)
                // cameraholder.remove(intersects[0].object)
                intersects[0].object.position.set(
                    asset.object.position.x + (blockFromAsset * Math.sin(THREE.MathUtils.degToRad(anguloY))),
                    intersects[0].object.position.y + asset.object.position.y,
                    asset.object.position.z + (blockFromAsset * Math.cos(THREE.MathUtils.degToRad(anguloY)))
                )
                intersects[0].object.rotateY(THREE.MathUtils.degToRad(anguloY));
                bbcube.push(new THREE.Box3().setFromObject(intersects[0].object));
                cubeS.push(intersects[0].object)
                

                //registra elemento(s) clicado(s) . Objetos que devem ser colocados no chao
                clickeObjects.object.push(intersects[0].object)
                clickeObjects.floor.push(intersects[0].object.position.y - blockElevationValue)
                clickeObjects.top.push(intersects[0].object.position.y)
            }
        }
        click = false;
    }*/
    /*if (clickeObjects.object.length) {
        for (i = 0; i < clickeObjects.object.length; i++) {

            if (clickeObjects.object[i].material.color.getHexString() == "deb887") {
                if (clickeObjects.object[i].position.y > clickeObjects.floor[i]) {

                    lerpConfig.destination = new THREE.Vector3(clickeObjects.object[i].position.x, clickeObjects.floor[i], clickeObjects.object[i].position.z)
                    clickeObjects.object[i].position.lerp(lerpConfig.destination, lerpConfig.alpha );
                    let quat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(45));
                    clickeObjects.object[i].quaternion.slerp(quat, lerpConfig.alpha)
                } else {
                    clickeObjects.object.splice(i, 1);
                    clickeObjects.floor.splice(i, 1);
                    clickeObjects.top.splice(i, 1);
                }
            } else {
                if (clickeObjects.object[i].position.y < clickeObjects.top[i]) {
                    lerpConfig.destination = new THREE.Vector3(clickeObjects.object[i].position.x, clickeObjects.top[i], clickeObjects.object[i].position.z)
                    clickeObjects.object[i].position.lerp(lerpConfig.destination, lerpConfig.alpha + 0.3);
                } else {
                    clickeObjects.object.splice(i, 1);
                    clickeObjects.floor.splice(i, 1);
                    clickeObjects.top.splice(i, 1);
                }
            }
        }

    }*/
}

window.addEventListener('click', clickElement);

render();