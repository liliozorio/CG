import * as THREE from 'three';
import {
    setDefaultMaterial,
    radiansToDegrees
} from "../libs/util/util.js";
import {
    checkOpenDoorRoom,
    checkCollisions
} from './check.js'

// CREATE DIRECTIONAL LIGHT
export function directionalLight(cameraholder)
{
    let lightColor = "rgb(255,255,255)";
    let positionDirectional = new THREE.Vector3(0, 10, -25)
    let dirLight = new THREE.DirectionalLight(lightColor, 1)
    dirLight.position.copy(positionDirectional);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = .1;
    dirLight.shadow.camera.far = 35;
    dirLight.shadow.camera.left = -20;
    dirLight.shadow.camera.right = 20;
    dirLight.shadow.camera.bottom = -20;
    dirLight.shadow.camera.top = 20;
    cameraholder.add(dirLight.target)
    cameraholder.add(dirLight)
    return dirLight
}

export function createAmbientLight(scene)
{
    let ambientColor = "rgb(80,80,80)";
    let ambientLight = new THREE.AmbientLight(ambientColor, 0.5);
    scene.add(ambientLight)
    return ambientLight
}

// CREATE SPOTLIGHT
export function createSpotLight(x, y, z, scene, spotLight_on) {
    let material = setDefaultMaterial("rgb(205,133,63)");
    let cubeGeometry3 = new THREE.BoxGeometry(0.01, 0.01, 0.01);
    let lightPosition = new THREE.Vector3(0, 5, 0);
    let cubeTest = new THREE.Mesh(cubeGeometry3, material);
    cubeTest.position.set(x, y, z);
    scene.add(cubeTest)
    let spotLight = new THREE.SpotLight("rgb(255,255,255)", 0);
    spotLight.position.copy(lightPosition);

    spotLight.distance = 0;
    spotLight.castShadow = true;
    spotLight.decay = 2;
    spotLight.penumbra = 0.5;
    spotLight.angle = THREE.MathUtils.degToRad(40);

    spotLight.shadow.mapSize.width = 512;
    spotLight.shadow.mapSize.height = 512;
    spotLight.shadow.camera.fov = radiansToDegrees(spotLight.angle);
    spotLight.shadow.camera.near = .2;
    spotLight.shadow.camera.far = 20.0;
    spotLight_on.push(spotLight);
    cubeTest.add(spotLight);
    cubeTest.add(spotLight.target)
}

// CREATE SPOTLIGHT MAN
export function spotLightM(cameraholder)
{
    let spotLightMan = new THREE.SpotLight("rgb(255,255,255)", 0);
    let lightPositionMan = new THREE.Vector3(0, 7, 0);

    spotLightMan.position.copy(lightPositionMan);
    spotLightMan.distance = 0;
    spotLightMan.castShadow = true;
    spotLightMan.decay = 2;
    spotLightMan.penumbra = 0.5;
    spotLightMan.angle = THREE.MathUtils.degToRad(10);

    spotLightMan.shadow.mapSize.width = 512;
    spotLightMan.shadow.mapSize.height = 512;
    spotLightMan.shadow.camera.fov = radiansToDegrees(spotLightMan.angle);
    spotLightMan.shadow.camera.near = .2;
    spotLightMan.shadow.camera.far = 40.0;

    cameraholder.add(spotLightMan)
    cameraholder.add(spotLightMan.target)
    return spotLightMan
}

// ILLUMINATES CHARACTER
export function iluminaMan(intensity, obj) {
    obj.traverse(function (child) {
        if (child.isMesh) {
            let colorMan = child.material.color
            child.material.emissive.set(colorMan)
            child.material.emissiveIntensity = intensity
        }
    });
}

// GET INTENSITY OF EMISSIVE
export function getIntensityEmissive(obj) {
    let intensity = 0
    obj.traverse(function (child) {
        if (child.isMesh) {
            intensity = child.material.emissiveIntensity
        }
    });
    return intensity
}

export function lightTrasition(light_switch, asset, spotLight_on) {
    let desceuPlataform3 = [false, false]
    let open6 = true
    for (let i = 0; i < desceuPlataform3.length; i++) {
        if (!desceuPlataform3[i]) {
            open6 = false
        }
    }
    if (checkOpenDoorRoom(3, 5)) {
        for (let i = 0; i < spotLight_on.length; i++) {
            spotLight_on[i].intensity = 1;
        }
    }
    else if (checkCollisions(light_switch, asset)) {
        let idLightSwitch = getColissionObjectId(light_switch, asset)
        for (let i = 0; i < spotLight_on.length; i++) {
            if (idLightSwitch == i) {
                spotLight_on[idLightSwitch].intensity = 1;
                spotLightMan.intensity = 0;
            }
            else {
                spotLight_on[i].intensity = 0;
            }
        }
    }
    else {
        for (let i = 0; i < spotLight_on.length; i++) {
            spotLight_on[i].intensity = 0;
            if (asset.object != null) {
                if (asset.object.position.y == -3 && asset.object.position.z > -26) {
                    spotLightMan.intensity = 1;
                }
            }
        }
    }
}