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
    onWindowResize
} from "../libs/util/util.js";
import { CSG } from '../libs/other/CSGMesh.js'

const bbcube = [];
const bbstairs = [];
const ListEscadas = [];
const doors = {box:[], obj:[]};

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
light = initDefaultBasicLight(scene);

keyboard = new KeyboardState();
var clock = new THREE.Clock();

window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

const SIZE_PLANE = 40
const SIZE_TILE = 0.8;
const NUM_CUBES = 0
const SIZE_OBSTACLE = 0.8;
const AVAILABLE_SPACE = SIZE_PLANE - 4;
const WALK_SIZE = 0.06;
let mat4

let plane = createGroundPlaneXZ(SIZE_PLANE + 1, SIZE_PLANE + 1);
mat4 = new THREE.Matrix4();
plane.matrixAutoUpdate = false;
plane.matrix.identity();

plane.matrix.multiply(mat4.makeTranslation(0.0, -0.1, 0.0));
var plano_rad = THREE.MathUtils.degToRad(90);
plane.matrix.multiply(mat4.makeRotationX((plano_rad)));
scene.add(plane);

let plane2 = createGroundPlaneXZ(SIZE_PLANE + 1, SIZE_PLANE + 1);
mat4 = new THREE.Matrix4();
plane2.matrixAutoUpdate = false;
plane2.matrix.identity();

plane2.matrix.multiply(mat4.makeTranslation(46.0, -3, 0.0));
var plano_rad = THREE.MathUtils.degToRad(90);
plane2.matrix.multiply(mat4.makeRotationX((plano_rad)));
scene.add(plane2);

let cubeGeometry = new THREE.BoxGeometry(SIZE_TILE, 0.01, SIZE_TILE);
let cubeGeometry2 = new THREE.BoxGeometry(1, 2, 1);
let material1 = setDefaultMaterial("rgb(255,222,173)");

var playAction;
var mixer = new Array();

function createBBHelper(bb, color) {
    // Create a bounding box helper
    let helper = new THREE.Box3Helper(bb, color);
    scene.add(helper);
    return helper;
}

const lerpConfig = {
	destination: new THREE.Vector3(0.0, -1.0, 0.0),
	alpha: 0.01,
	move: true
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

loadGLTFFile(asset, '../assets/objects/walkingMan.glb', true);
loadGLTFFile(asset2, '../assets/objects/walkingMan.glb', false);

makeEdgeX(-SIZE_PLANE / 2, -SIZE_PLANE / 2);
makeEdgeX(-SIZE_PLANE / 2, SIZE_PLANE / 2);
makeEdgeZ(-SIZE_PLANE / 2, -SIZE_PLANE / 2);
makeEdgeZ(SIZE_PLANE / 2, -SIZE_PLANE / 2);

// CREATE PLANE
function createGroundPlaneXZ(p, widthSegments = 10, heightSegments = 10, gcolor = null) {
    if (!gcolor) gcolor = "rgb(210,180,140)";
    let planeGeometry = new THREE.PlaneGeometry(p.w, p.h, widthSegments, heightSegments);
    let planeMaterial = new THREE.MeshLambertMaterial({ color: gcolor, side: THREE.DoubleSide });

    let mat4 = new THREE.Matrix4();
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    plane.matrixAutoUpdate = false;
    plane.matrix.identity();
    console
    plane.matrix.multiply(mat4.makeTranslation(p.x, p.y, p.z));
    var plano_rad = THREE.MathUtils.degToRad(90);
    plane.matrix.multiply(mat4.makeRotationX((plano_rad)));

    return plane;
}

// CRIA CHÃO
// function makeFloor(p) {
//     for (let x = -SIZE_PLANE / 2; x <= SIZE_PLANE / 2; x += (SIZE_TILE * 1.08)) {
//         for (let z = -SIZE_PLANE / 2; z <= SIZE_PLANE / 2; z += (SIZE_TILE * 1.08)) {
//             let cube = new THREE.Mesh(cubeGeometry, material1);
//             cube.position.set(x, 0.05, z);
//             scene.add(cube);
//         }
//     }
// }
function makeFloor(p) {
    for (let x = p.x1; x <= p.x2; x += (SIZE_TILE * 1.08)) {
        for (let z = p.z1; z <= p.z2; z += (SIZE_TILE * 1.08)) {
            let cube = new THREE.Mesh(cubeGeometry, material1);
            cube.position.set(x, p.y, z);
            scene.add(cube);
        }
    }
}

// CRIA BORDAS PARALELAS AO EIXO X
function makeEdgeX(x, z) {
    for (; x <= -3; x += 1.1) {
        let cube = new THREE.Mesh(cubeGeometry2, material);
        cube.position.set(x, 1, z);
        bbcube.push(new THREE.Box3().setFromObject(cube));
        scene.add(cube);
    }
    for (x = 3.5; x <= (SIZE_PLANE / 2); x += 1.1) {
        let cube = new THREE.Mesh(cubeGeometry2, material);
        cube.position.set(x, 1, z);
        bbcube.push(new THREE.Box3().setFromObject(cube));
        scene.add(cube);
    }
}

// CRIA BORDAS PARALELAS AO EIXO Z
function makeEdgeZ(x, z) {
    for (; z <= -3; z += 1.1) {
        let cube = new THREE.Mesh(cubeGeometry2, material);
        cube.position.set(x, 1, z);
        bbcube.push(new THREE.Box3().setFromObject(cube));
        scene.add(cube);
    }
    for (z = 3.5; z <= SIZE_PLANE / 2; z += 1.1) {
        let cube = new THREE.Mesh(cubeGeometry2, material);
        cube.position.set(x, 1, z);
        bbcube.push(new THREE.Box3().setFromObject(cube));
        scene.add(cube);
    }
}

function createChambers() {
    const pp = {//planePositions
        p0: { x: 0.0, y: -0.1, z: 0.0, w: SIZE_PLANE + 1, h: SIZE_PLANE + 1 },
        p1: { x: 0, y: -3, z: -SIZE_PLANE - 4.4, w: SIZE_PLANE * 0.7, h: SIZE_PLANE * 0.9 },
        p2: { x: 0.0, y: 3, z: SIZE_PLANE + 4.5, w: SIZE_PLANE * 0.7, h: SIZE_PLANE * 0.9 },
        p3: { x: SIZE_PLANE + 0.4, y: -3, z: 0.0, w: SIZE_PLANE * 0.7, h: SIZE_PLANE * 0.9 },
        p4: { x: -SIZE_PLANE - 0.5, y: 3, z: 0.0, w: SIZE_PLANE * 0.7, h: SIZE_PLANE * 0.7 },
        p5: { x: 0, y: -3, z: -75, w: SIZE_PLANE * 0.5, h: SIZE_PLANE * 0.5 },
    };
    for (let i = 0; i < 6; i++) {
        let plane = createGroundPlaneXZ(pp["p" + i]);
        scene.add(plane);
    }
    const auxCdnt = {
        p0: { x1: pp.p0.x - (pp.p0.w / 2 - 0.5), x2: pp.p0.x + pp.p0.w / 2, z1: pp.p0.z - (pp.p0.h / 2 - 0.5), z2: pp.p0.z + (pp.p0.h / 2 - 0.5), y: 0.05 },
        p1: { x1: pp.p1.x - (pp.p1.w / 2), x2: pp.p1.x + pp.p1.w / 2, z1: pp.p1.z - (pp.p1.h / 2), z2: pp.p1.z + (pp.p1.h / 2), y: -2.95 },
        p2: { x1: pp.p2.x - (pp.p2.w / 2), x2: pp.p2.x + pp.p2.w / 2, z1: pp.p2.z - (pp.p2.h / 2), z2: pp.p2.z + (pp.p2.h / 2), y: 3.05 },
        p3: { x1: pp.p3.x - (pp.p3.w / 2), x2: pp.p3.x + pp.p3.w / 2, z1: pp.p3.z - (pp.p3.h / 2), z2: pp.p3.z + (pp.p3.h / 2), y: -2.95 },
        p4: { x1: pp.p4.x - (pp.p4.w / 2), x2: pp.p4.x + pp.p4.w / 2, z1: pp.p4.z - (pp.p4.h / 2), z2: pp.p4.z + (pp.p4.h / 2), y: 3.05 },
        p5: { x1: pp.p5.x - (pp.p5.w / 2), x2: pp.p5.x + pp.p5.w / 2, z1: pp.p5.z - (pp.p5.h / 2), z2: pp.p5.z + (pp.p5.h / 2), y: -2.95 },
    }
    for(let i=0;i<6;i++){
        makeFloor(auxCdnt["p"+i]);
    }
    makeEdgeX(-SIZE_PLANE / 2, -SIZE_PLANE / 2);
    makeEdgeX(-SIZE_PLANE / 2, SIZE_PLANE / 2);
    makeEdgeZ(-SIZE_PLANE / 2, -SIZE_PLANE / 2);
    makeEdgeZ(SIZE_PLANE / 2, -SIZE_PLANE / 2);
}
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
    return csgFinal;
}


// INSERE OS PORTAIS EM SUAS DEVIDAS POSIÇÕES
function insertPortal(){
	let portalAreal = makePortal("rgb(46,139,87)");
	let doorAreal = makeDoor("rgb(0,0,0)");
	portalAreal.position.set(0, 3, -SIZE_PLANE / 2);
	doorAreal.position.set(0, 3, -SIZE_PLANE / 2);
	scene.add(portalAreal);
	scene.add(doorAreal);
	console.log(doorAreal)
	doorAreal.name = "doorAreal";

	doors.box.push(new THREE.Box3().setFromObject(doorAreal));
	doors.obj.push(doorAreal)
	bbcube.push(new THREE.Box3().setFromObject(doorAreal));
    
	let portalArea2 = makePortal("rgb(25,25,112)");
	let doorAreal2 = makeDoor("rgb(0,0,0)");
	portalArea2.position.set(0, 3, SIZE_PLANE / 2);
	doorAreal2.position.set(0, 3, SIZE_PLANE / 2);
	scene.add(portalArea2);
	scene.add(doorAreal2);

	doors.box.push(new THREE.Box3().setFromObject(doorAreal2));
	doors.obj.push(doorAreal2)
	bbcube.push(new THREE.Box3().setFromObject(doorAreal2));

	let portalArea3 = makePortal("rgb(165,42,42)");
	let doorAreal3 = makeDoor("rgb(0,0,0)");
	portalArea3.position.set(SIZE_PLANE / 2, 3, 0);
	doorAreal3.position.set(SIZE_PLANE / 2, 3, 0);
	portalArea3.rotateY(THREE.MathUtils.degToRad(90));
	doorAreal3.rotateY(THREE.MathUtils.degToRad(90));
	scene.add(portalArea3);
	scene.add(doorAreal3)
    
	doors.box.push(new THREE.Box3().setFromObject(doorAreal3));
	doors.obj.push(doorAreal3)
	bbcube.push(new THREE.Box3().setFromObject(doorAreal3));

	let portalFinal = makePortal("rgb(255,215,0)");
	let doorFinal = makeDoor("rgb(0,0,0)");
	portalFinal.position.set(-SIZE_PLANE / 2, 3, 0);
	doorFinal.position.set(-SIZE_PLANE / 2, 3, 0);
	portalFinal.rotateY(THREE.MathUtils.degToRad(90));
	doorFinal.rotateY(THREE.MathUtils.degToRad(90));
	scene.add(portalFinal);
	scene.add(doorFinal);

	doors.box.push(new THREE.Box3().setFromObject(doorFinal));
	doors.obj.push(doorFinal)
	bbcube.push(new THREE.Box3().setFromObject(doorFinal));
}


// CRIA AS PORTAS
insertPortal()
function makeDoor(rgb){
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
    	return csgFinal;
    
}


// FAZ AS ESCADAS
function makeStairs(rgb = undefined) {
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
function insertStairs(){
    let escadaArea1 = makeStairs("rgb(143,188,143)");
    escadaArea1.object.rotateY(THREE.MathUtils.degToRad(180));
    escadaArea1.object.position.set(0, -3, -SIZE_PLANE / 2 - 3.5);
    escadaArea1.inclinacao = 'negativo'
    bbstairs.push(new THREE.Box3().setFromObject(escadaArea1.object));
    ListEscadas.push(escadaArea1);
    scene.add(escadaArea1.object);

    let escadaArea2 = makeStairs("rgb(72,61,139)");
    //escadaArea2.object.rotateY(THREE.MathUtils.degToRad(180));
    escadaArea2.object.position.set(0, 0, SIZE_PLANE / 2 + 3.5);
    escadaArea2.object.rotateY(THREE.MathUtils.degToRad(180));
    escadaArea2.inclinacao = 'positivo'
    bbstairs.push(new THREE.Box3().setFromObject(escadaArea2.object));
    ListEscadas.push(escadaArea2);
    scene.add(escadaArea2.object);

    let escadaArea3 = makeStairs("rgb(128,0,0)");
    escadaArea3.object.rotateY(THREE.MathUtils.degToRad(90));
    escadaArea3.object.position.set(SIZE_PLANE / 2 + 3.5, -3, 0);
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

let randomCoordinate = () => Math.floor((Math.random() * AVAILABLE_SPACE) - AVAILABLE_SPACE / 2)
let randomCoordinate2 = () => (Math.random() * AVAILABLE_SPACE) - AVAILABLE_SPACE / 2
let chooseCoordenate = () => Math.random()

//CRIA CUBOS EM LOCAIS ALEATORIOS
function randomCube() {
    let c = new THREE.BoxGeometry(SIZE_OBSTACLE, SIZE_OBSTACLE, SIZE_OBSTACLE);
    let aux = {
        object: null,
        bb: new THREE.Box3()
    }
    for (let i = 0; i < NUM_CUBES; i++) {
        let x;
        let z;
        if (chooseCoordenate() < 0.5) {
            x = randomCoordinate2();
            z = randomCoordinate();
        } else {
            x = randomCoordinate();
            z = randomCoordinate2();
        }
        let m = setDefaultMaterial("rgb(222,184,135)");
        let cube = new THREE.Mesh(c, m);
        cube.position.set(x, 0.6, z);
        aux.object = cube;
        aux.bb = new THREE.Box3().setFromObject(cube);
        asset2.bb.setFromObject(asset2.object);

        if ((!checkCollisions(aux.bb, asset2)) && (!checkCollisions(bbcube, aux))) {
            bbcube.push(new THREE.Box3().setFromObject(cube));
            cube.name = "randomCube";
            scene.add(cube);
        } else {
            cube.remove();
            i--;
        }
    }
}




// INICIALIZA PERSONEGEM
function loadGLTFFile(asset, file, add_scene) {
    var loader = new GLTFLoader();
    loader.load(file, function (gltf) {
        var obj = gltf.scene;
        obj.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
            }
        });
        obj = normalizeAndRescale(obj, 2);
        obj.updateMatrixWorld(true);
        if (add_scene) {
            scene.add(obj);
        }
        asset.object = gltf.scene;
        var mixerLocal = new THREE.AnimationMixer(obj);
        mixerLocal.clipAction(gltf.animations[0]).play();
        mixer.push(mixerLocal);
    }, () => { }, () => { });
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
function movimentation(angulo_max, camX, camZ, camY, walkZ, walkX, walkY, walkZ_hide, walkX_hide, walkY_hide) {

    var diferenca = 360 + angulo_max - anguloY
    var diferenca2 = anguloY - angulo_max
    if (diferenca > diferenca2) {
        angulo_max = angulo_max;
    }
    else {
        angulo_max = angulo_max + 360;
    }

    if (anguloY < angulo_max) {
        anguloY = anguloY + 5;
        var rad = THREE.MathUtils.degToRad(5);
        asset.object.rotateY(rad);
        asset2.object.rotateY(rad);
    }
    else if (anguloY > angulo_max) {
        anguloY = anguloY - 5;
        var rad = THREE.MathUtils.degToRad(-5);
        asset.object.rotateY(rad);
        asset2.object.rotateY(rad);
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

// TRATA OS MOVIMENTOS COM COLISÃO DO PERSONAGEM
function movimentation_colision(angulo_max, camX, camZ, walkZ, walkX, walkZ_hide, walkX_hide) {
    playAction = true;
    var collision = checkCollisions(bbcube, asset)
    var escada = checkCollisions(bbstairs, asset)
    if (!collision) {
        if(!escada)
        {
            movimentation(angulo_max, camX, camZ, 0, walkZ, walkX, 0, walkZ_hide, walkX_hide, 0);
        }
        else
        {
            let id = getColissionObjectId(bbstairs, asset)
            if(ListEscadas[id].inclinacao == 'positivo')
            {
                movimentation(angulo_max, camX, camZ, 0.024, walkZ, walkX, 0.024, walkZ_hide, walkX_hide, 0.024);
                if(asset.object.position.y>-3)
                {
                    ListEscadas[id].inclinacao = 'positivo';
                }
            }
            else
            {
                movimentation(angulo_max, camX, camZ, -0.024, walkZ, walkX, -0.024, walkZ_hide, walkX_hide, -0.024);
                if(asset.object.position.y<-3)
                {
                    ListEscadas[id].inclinacao = 'negativo';
                }
            }
        }
    }
    else {
        movimentation(angulo_max, 0, 0, 0, 0, walkZ_hide, -0.6);
        collision = checkCollisions(bbcube, asset2);
        if (collision) {
            asset2.object.position.x = asset.object.position.x
            asset2.object.position.z = asset.object.position.z
            asset2.object.position.y = 0;
            asset2.bb.setFromObject(asset2.object);
            movimentation(angulo_max, 0, 0, 0, 0, walkZ_hide, 0.6);
            collision = checkCollisions(bbcube, asset2);
            if (collision) {
                asset2.object.position.x = asset.object.position.x
                asset2.object.position.z = asset.object.position.z
                asset2.object.position.y = 0;
                asset2.bb.setFromObject(asset2.object);
            }
            else {
                asset2.object.position.x = asset.object.position.x
                asset2.object.position.z = asset.object.position.z
                asset2.object.position.y = 0;
                movimentation(angulo_max, camX, camZ, 0, walkZ, walkX, 0, walkZ_hide, walkX_hide, 0);    
            }
        }
        else {
            asset2.object.position.x = asset.object.position.x
            asset2.object.position.z = asset.object.position.z
            asset2.object.position.y = 0;
            movimentation(angulo_max, camX, camZ, 0, walkZ, walkX, 0, walkZ_hide, walkX_hide, 0);
        }
    }
}

// COMANDOS DO TECLADO
function keyboardUpdate() {
    
    keyboard.update()
    if (keyboard.pressed("A") && keyboard.pressed("S") || keyboard.pressed("left") && keyboard.pressed("down")) {
        var rad = THREE.MathUtils.degToRad(anguloY);
        movimentation_colision(0, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0);
    }
    else if (keyboard.pressed("A") && keyboard.pressed("W") || keyboard.pressed("left") && keyboard.pressed("up")) {
        var rad = THREE.MathUtils.degToRad(anguloY);
        movimentation_colision(270, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0);
    }
    else if (keyboard.pressed("D") && keyboard.pressed("S") || keyboard.pressed("right") && keyboard.pressed("down")) {
        var rad = THREE.MathUtils.degToRad(anguloY);
        movimentation_colision(90, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0);
    }
    else if (keyboard.pressed("D") && keyboard.pressed("W") || keyboard.pressed("right") && keyboard.pressed("up")) {
        var rad = THREE.MathUtils.degToRad(anguloY);
        movimentation_colision(180, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0);
    }
    else if (keyboard.pressed("A") || keyboard.pressed("left")) {
        var rad = THREE.MathUtils.degToRad(anguloY);
        movimentation_colision(315, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0);
    }
    else if (keyboard.pressed("D") || keyboard.pressed("right")) {
        var rad = THREE.MathUtils.degToRad(anguloY);
        movimentation_colision(135, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0);
    }
    else if (keyboard.pressed("S") || keyboard.pressed("down")) {
        var rad = THREE.MathUtils.degToRad(anguloY);
        movimentation_colision(45, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0);
    }
    else if (keyboard.pressed("W") || keyboard.pressed("up")) {
        var rad = THREE.MathUtils.degToRad(anguloY);
        movimentation_colision(225, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0);
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
function getColissionObjectId(object, man)
{
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

let colors = ["rgb(222,184,135)", "rgb(165,42,42)"]
function render() {
    if(checkCollisions(doors.box , asset)){
    	let indexDoor = getColissionObjectId(doors.box , asset)
    	lerpConfig.destination = new THREE.Vector3(doors.obj[indexDoor].position.x, -4.0, doors.obj[indexDoor].position.z)
    	doors.obj[indexDoor].position.lerp(lerpConfig.destination, lerpConfig.alpha);
	}
    if (asset2.object && !asset2.loaded) {
        asset2.bb.setFromObject(asset2.object);
        randomCube();
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
    if (click) {
        renderer.render(scene, camera);
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        if (intersects[0].object.name === "randomCube") {
            if (intersects[0].object.material.color.getHexString() == "deb887") {
                intersects[0].object.material.color.set(colors[1]);
            } else {
                intersects[0].object.material.color.set(colors[0]);
            }
        }
        click = false;
    }
}


window.addEventListener('click', clickElement);

render();
