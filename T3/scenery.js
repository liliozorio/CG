import * as THREE from 'three';
import {
    setDefaultMaterial,
} from "../libs/util/util.js";
import {
    createGroundPlaneXZ,
    makeEdges,
    invisibleWay,
    randomCube,
    randomGLTF,
    makePortal,
    makeHiddenCube,
    makeDoor, 
    makeStairs
} from './scenery_aux.js';
import {
    loadGLTFFile,
} from './import_object.js'
// CREATE CHAMBERS
export function createChambers(size_plane, size_obstacle, size_tile, available_space, scene, bbcube, cubeS, bbBox, blockElevationValue, invisibleWayBlocks, id_key, mixer) {
    const pp = {
        p0: { x: 0.0, y: -0.1, z: 0.0, w: size_plane + 1, h: size_plane + 1, textureName:"outdoor_floor_borders.jpg" }, //outdoor_floor_borders
        p1: { x: 0, y: -3, z: -size_plane - 6.4, w: size_plane * 0.7, h: size_plane * 0.9, textureName:"brickFloorBorders.jpg" }, //brickFloor2
        p2: { x: 0.0, y: 3, z: size_plane + 6.5, w: size_plane * 0.7, h: size_plane * 0.9, textureName:"graniteBorders.jpg" }, //brickFloor2
        p3: { x: size_plane + 10.6, y: -3, z: 0.0, w: size_plane * 1.1, h: size_plane * 0.4, textureName:"lava_floor_borders.jpg" }, //granite2
        p4: { x: -size_plane + 3, y: 3, z: 0.0, w: size_plane * 0.4, h: size_plane * 0.4, textureName:"goldenTextureBorders.jpg" }, //granite2
        p5: { x: 0, y: -3, z: -size_plane * 1.89, w: size_plane * 0.4, h: size_plane * 0.4, textureName:"brickFloorBorders.jpg" },
        p6: { x: 0, y: 3, z: size_plane * 1.82, w: size_plane * 0.4, h: size_plane * 0.4, textureName:"graniteBorders.jpg" },
        p7: { x: size_plane * 2, y: -3, z: 0, w: size_plane * 0.4, h: size_plane * 0.4, textureName:"lava_floor_borders.jpg" },
        p8: { x: 0, y: -3, z: -size_plane / 2 - 7, w: 7, h: 2, textureName:"brickFloorBorders.jpg" },
        p9: { x: 0, y: 3, z: size_plane / 2 + 8, w: 7, h: 2, textureName:"graniteBorders.jpg" },
        p10: { x: size_plane / 2 + 8, y: -3, z: 0, w: 2, h: 7, textureName:"lava_floor_borders.jpg" },
        p11: { x: -size_plane / 2 - 8, y: 3, z: 0, w: 2, h: 7, textureName:"goldenTextureBorders.jpg" },
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
    randomCube(auxCdnt.p1, 6, size_obstacle, available_space, bbcube, cubeS, scene, id_key, mixer)
    bbBox = randomGLTF(auxCdnt.p2, 6, size_obstacle, available_space, bbcube, bbBox, scene, id_key, mixer)

    makeEdges({ x: auxCdnt.p0.x1, y: 0.75, z: auxCdnt.p0.z1 }, pp.p0.w - 1, pp.p0.h - 1, 3, { f1: 1, f2: 1, f3: 1, f4: 1 },bbcube, cubeS, scene, "mainWall.jpeg")
    makeEdges({ x: auxCdnt.p1.x1, y: -2.25, z: auxCdnt.p1.z1 }, pp.p1.w, pp.p1.h, 3, { f1: 1, f2: 1, f3: 0, f4: 0 }, bbcube, cubeS, scene, "brickWall.jpeg")
    makeEdges({ x: auxCdnt.p2.x1, y: 3.75, z: auxCdnt.p2.z1 }, pp.p2.w, pp.p2.h, 3, { f1: 1, f2: 1, f3: 0, f4: 0 }, bbcube, cubeS, scene, "stoneWall.jpg")//
    makeEdges({ x: auxCdnt.p3.x1, y: -2.25, z: auxCdnt.p3.z1 }, pp.p3.w, pp.p3.h, 3, { f1: 0, f2: 0, f3: 1, f4: 1 }, bbcube, cubeS, scene, "plankWall.jpg")
    makeEdges({ x: auxCdnt.p4.x1, y: 3.75, z: auxCdnt.p4.z1 }, pp.p4.w, pp.p4.h, 3, { f1: 0, f2: 0, f3: 0, f4: 1 }, bbcube, cubeS, scene, "woodWall.jpg")//
    makeEdges({ x: auxCdnt.p5.x1, y: -2.25, z: auxCdnt.p5.z1 }, pp.p5.w, pp.p5.h, 3, { f1: 0, f2: 1, f3: 0, f4: 0 }, bbcube, cubeS, scene, "brickWall.jpeg")
    makeEdges({ x: auxCdnt.p6.x1, y: 3.75, z: auxCdnt.p6.z1 }, pp.p6.w, pp.p6.h, 3, { f1: -1, f2: 0, f3: 0, f4: 0 }, bbcube, cubeS, scene, "stoneWall.jpg")//
    makeEdges({ x: auxCdnt.p7.x1, y: -2.25, z: auxCdnt.p7.z1 }, pp.p7.w, pp.p7.h, 3, { f1: 0, f2: 0, f3: -1, f4: 0 }, bbcube, cubeS, scene, "plankWall.jpg")
    makeEdges({ x: auxCdnt.p8.x1, y: -2.25, z: auxCdnt.p8.z1 }, pp.p8.w, pp.p8.h, 3, { f1: -1, f2: -1, f3: 0, f4: 0 }, bbcube, cubeS, scene, "brickWall.jpeg")
    makeEdges({ x: auxCdnt.p9.x1, y: 3.75, z: auxCdnt.p9.z1 }, pp.p9.w, pp.p9.h, 3, { f1: -1, f2: -1, f3: 0, f4: 0 },bbcube, cubeS, scene, "stoneWall.jpg")//
    makeEdges({ x: auxCdnt.p10.x1, y: -2.25, z: auxCdnt.p10.z1 }, pp.p10.w, pp.p10.h, 3, { f1: 0, f2: 0, f3: -1, f4: -1 }, bbcube, cubeS, scene, "plankWall.jpg")//
    makeEdges({ x: auxCdnt.p11.x1 + 1.5, y: 3.75, z: auxCdnt.p11.z1 }, pp.p11.w, pp.p11.h, 3, { f1: 0, f2: 0, f3: -1, f4: -1 }, bbcube, cubeS, scene, "woodWall.jpg")

    const invisibleBlocks = {
        i: {rgb: "rgb(152,251,152)", x1: -0.5, x2: 1, z1: auxCdnt["p5"].z2+0.7, z2: auxCdnt["p1"].z1-0.5, y: -2.95 }
    }
    invisibleWay(invisibleBlocks["i"], size_obstacle, size_tile, blockElevationValue, invisibleWayBlocks, bbcube);
    return bbBox;
}

// CREATE LIGHT SWITCH
export function createLightSwitch(x, y, z, z_c, scene, light_switch) {
    let cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    let materialEmissive = setDefaultMaterial("rgb(255,215,0)");
    materialEmissive.emissive.set("rgb(255,215,0)")
    let cubeTest = new THREE.Mesh(cubeGeometry, materialEmissive);
    cubeTest.position.set(x, y, z);
    scene.add(cubeTest)
    let geometry = new THREE.CircleGeometry(3, 32);
    let materialCircle = new THREE.MeshBasicMaterial();
    let circle = new THREE.Mesh(geometry, materialCircle);
    circle.position.set(x, y, z_c)
    circle.rotateX(THREE.MathUtils.degToRad(90))
    light_switch.push(new THREE.Box3().setFromObject(circle));
    scene.add(circle)
}

// RESIZE WINDOW
export function onWindowResize(camera, renderer){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

// INSERT PORTAL IN ITS POSITIONS
export function insertPortal(scene, bbcube, cubeS, bbportal, doors) {
    const posPortal = {
        p1: { x: 0, y: 0, z: -28.5, color: "rgb(46,139,87)", rotation: 0 },
        p2: { x: 0, y: 6, z: 28.4, color: "rgb(25,25,112)", rotation: 0 },
        p3: { x: 28.5, y: 0, z: 0, color: "rgb(165,42,42)", rotation: 90 },
        p4: { x: -28.4, y: 6, z: 0, color: "rgb(255,215,0)", rotation: 90 },
        //p5: { x: 0, y: 0, z: -67.5, color: "rgb(46,139,87)", rotation: 0 },
        p5: { x: 0, y: 6, z: 64.4, color: "rgb(25,25,112)", rotation: 0 },
        p6: { x: 72.5, y: 0, z: 0, color: "rgb(165,42,42)", rotation: 90 },
    }

    for (let i = 1; i < 7; i++) {
        let portalArea = makePortal(posPortal["p" + i].color);
        let doorArea = makeDoor("rgb(119,136,153)");
        portalArea.position.set(posPortal["p" + i].x, posPortal["p" + i].y, posPortal["p" + i].z);
        doorArea.position.set(posPortal["p" + i].x, posPortal["p" + i].y, posPortal["p" + i].z);
        portalArea.rotateY(THREE.MathUtils.degToRad(posPortal["p" + i].rotation));
        doorArea.rotateY(THREE.MathUtils.degToRad(posPortal["p" + i].rotation));
        doorArea.receiveShadow = true;
        doorArea.castShadow = true;
        portalArea.receiveShadow = true;
        portalArea.castShadow = true;
        scene.add(portalArea);
        scene.add(doorArea);
        if (posPortal["p" + i].x == 0) {
            makeHiddenCube(posPortal["p" + i].x - 2.5, posPortal["p" + i].y - 1.5, posPortal["p" + i].z, bbcube, cubeS, scene)
            makeHiddenCube(posPortal["p" + i].x + 2.5, posPortal["p" + i].y - 1.5, posPortal["p" + i].z,bbcube, cubeS, scene)
        }
        else {
            makeHiddenCube(posPortal["p" + i].x, posPortal["p" + i].y - 1.5, posPortal["p" + i].z - 2.5, bbcube, cubeS, scene)
            makeHiddenCube(posPortal["p" + i].x, posPortal["p" + i].y - 1.5, posPortal["p" + i].z + 2.5, bbcube, cubeS, scene)
        }
        bbportal.push(new THREE.Box3().setFromObject(portalArea));
        doors.box.push(new THREE.Box3().setFromObject(doorArea));
        doors.obj.push(doorArea)
    }
}

// INSERT STAIRS IN ITS POSITIONS
export function insertStairs(bbstairs, ListEscadas, scene, size_plane) {
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
    escadaFinal.object.position.set(-size_plane / 2 - 3.5, 0, 0);
    escadaFinal.inclinacao = 'positivo'
    bbstairs.push(new THREE.Box3().setFromObject(escadaFinal.object));
    ListEscadas.push(escadaFinal);
    scene.add(escadaFinal.object);
}

// CREATE BLOCKS THAT WILL BE LOWER TO ACTIVE THE DOOR
export function makePlatforms(p, n, area, bbcube, platforms, scene, objectsArea3) {
    let geometry = new THREE.BoxGeometry(1, 0.5, 1);
    for (let i = 0; i < n; i++, p.x += 8) {
        let material = setDefaultMaterial("rgb(255,99,71)");
        let ptfm = new THREE.Mesh(geometry, material)
        ptfm.position.set(p.x, p.y, p.z);
        ptfm.castShadow = true;
        ptfm.receiveShadow = true;
        bbcube.push(new THREE.Box3().setFromObject(ptfm));
        platforms.box.push(new THREE.Box3().setFromObject(ptfm));
        platforms.object.push(ptfm);
        if (area == 3) {
            ptfm.position.y =  ptfm.position.y - 0.25 ;
            ptfm.visible = false;
            objectsArea3.push(ptfm);
        }
        scene.add(ptfm);
    }

}

// CREATE BARRIER
export function createBarrier(tamx, tamy, tamz, x, y, z, rotateX, rotateY, rotateZ, bbcube, cubeS)
{
    let material1 = setDefaultMaterial("rgb(255,255,255)");
    let cubeGeometry1 = new THREE.BoxGeometry(tamx, tamy, tamz);
    let cube = new THREE.Mesh(cubeGeometry1, material1);
    cube.position.set(x, y, z);
    cube.rotateX(THREE.MathUtils.degToRad(rotateX))
    cube.rotateY(THREE.MathUtils.degToRad(rotateY))
    cube.rotateZ(THREE.MathUtils.degToRad(rotateZ))
    bbcube.push(new THREE.Box3().setFromObject(cube));
    cubeS.push(cube);
}

// CREATE PLATAFORMS FINAL AREA
export function plataformsAreaFinal(scene) {
    let material1 = setDefaultMaterial("rgb(255,215,0)");
    let cubeGeometry1 = new THREE.BoxGeometry(5, 0.1, 5);
    let plataform1 = new THREE.Mesh(cubeGeometry1, material1);
    plataform1.position.set(-38, 3.05, 0);
    plataform1.receiveShadow = true;
    plataform1.name = "final";
    scene.add(plataform1);
    return new THREE.Box3().setFromObject(plataform1);
}

// CREATE CUBES AND PLATAFORMS AREA 3
export function cubesArea3(bbcube, platforms, scene, objectsArea3, bbBox, id_key, mixer) 
{
    let positionCubes = {
        area3_0: new THREE.Vector3(33, -2.5, 4.5),
        area3_1: new THREE.Vector3(43, -2.5, 4.5),
        area3_2: new THREE.Vector3(53, -2.5, 4.5),
        area3_3: new THREE.Vector3(63, -2.5, 4.5),
        area3_4: new THREE.Vector3(33, -2.5, -4.5),
        area3_5: new THREE.Vector3(43, -2.5, -4.5),
        area3_6: new THREE.Vector3(53, -2.5, -4.5),
        area3_7: new THREE.Vector3(63, -2.5, -4.5)
    }
    let positions = [];
    for (let i = 0; i < 4;) {
        let a = Math.floor(Math.random() * 8)
        if (positions.indexOf(a) == -1) {
            positions.push(a);
            i++;
        }
    }
    makePlatforms(positionCubes["area3_" + positions[0]], 1, 3, bbcube, platforms, scene, objectsArea3)
    makePlatforms(positionCubes["area3_" + positions[1]], 1, 3, bbcube, platforms, scene, objectsArea3)
    // let cubeGeometry1 = new THREE.BoxGeometry(1, 1, 1);
    // let aux_bbBox = [];
    for (let i = 2; i < 4; i++) {
        // let material1 = setDefaultMaterial("rgb(222,184,135)");
        // let cube = new THREE.Mesh(cubeGeometry1, material1);
        // cube.position.copy(positionCubes["area3_" + positions[i]]);
        // cube.castShadow = true;
        // cube.name = "randomCube";
        // bbcube.push(new THREE.Box3().setFromObject(cube));
        // cubeS.push(cube);
        // cube.visible = false;
        // objectsArea3.push(cube);
        // scene.add(cube);
        // console.log(positionCubes["area3_" + positions[i]]);

        let assetT = {
            object: null,
            loaded: false,
            bb: new THREE.Box3(),
            obj3D: new THREE.Object3D(),
            selected: false
        }

        loadGLTFFile(assetT, "./asset/totoro.glb", true, positionCubes["area3_" + positions[i]].x, positionCubes["area3_" + positions[i]].y - 0.6, positionCubes["area3_" + positions[i]].z, '', false, null, scene, [], id_key, mixer, true, 1.5);
        bbBox.push(assetT);
    }
    
}