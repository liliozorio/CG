import * as THREE from 'three';
import {
    checkCollisions
} from './check.js'
import{
    movimentation_colision,
    movimentation_stairs
} from './movimentation.js';

// KEYBOARD COMMANDS
export function keyboardUpdate(keyboard, bbcube, bbstairs, doors, asset, asset2, cameraholder, playAction, dirLight, ambientLight, anguloY, WALK_SIZE, orthographic, camPosition, s, camera, upVec, lookAtVec, scene) {

    keyboard.update()
    let aux_collision;
    var escada = checkCollisions(bbstairs, asset)
    if (keyboard.pressed("A") && keyboard.pressed("S") || keyboard.pressed("left") && keyboard.pressed("down")) {
        var rad = THREE.MathUtils.degToRad(anguloY.Y);
        if (escada) {
            var select_stairs = getColissionObjectId(bbstairs, asset)
            if (select_stairs == 0) {
                movimentation_stairs(0, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            else if (select_stairs == 1) {
                movimentation_stairs(0, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            if (select_stairs == 2) {
                movimentation_stairs(0, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0, WALK_SIZE, 0, 0, WALK_SIZE, 0, 0, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            else if (select_stairs == 3) {
                movimentation_stairs(0, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0, WALK_SIZE, 0, 0, WALK_SIZE, 0, 0, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
        }
        else {
            movimentation_colision(0, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, false, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder);
        }
    }
    else if (keyboard.pressed("A") && keyboard.pressed("W") || keyboard.pressed("left") && keyboard.pressed("up")) {
        var rad = THREE.MathUtils.degToRad(anguloY.Y);
        if (escada) {
            var select_stairs = getColissionObjectId(bbstairs, asset)
            if (select_stairs == 0) {
                movimentation_stairs(270, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0, WALK_SIZE, 0, 0, WALK_SIZE, 0, 0, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            else if (select_stairs == 1) {
                movimentation_stairs(270, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0, WALK_SIZE, 0, 0, WALK_SIZE, 0, 0, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            if (select_stairs == 2) {
                movimentation_stairs(270, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
                dirLight.intensity = dirLight.intensity + 0.01
                ambientLight.intensity = ambientLight.intensity + 0.01
                if (spotLightMan.intensity > 0) {
                    spotLightMan.intensity = spotLightMan.intensity - 0.01
                }
                if (getIntensityEmissive(asset.object) > 0) {
                    iluminaMan(getIntensityEmissive(asset.object) - 0.01, asset.object)
                }
            }
            else if (select_stairs == 3) {
                movimentation_stairs(270, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
        }
        else {
            movimentation_colision(270, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, false, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder);
        }
    }
    else if (keyboard.pressed("D") && keyboard.pressed("S") || keyboard.pressed("right") && keyboard.pressed("down")) {
        var rad = THREE.MathUtils.degToRad(anguloY.Y);
        if (escada) {
            var select_stairs = getColissionObjectId(bbstairs, asset)
            if (select_stairs == 0) {
                movimentation_stairs(90, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0, WALK_SIZE, 0, 0, WALK_SIZE, 0, 0, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            else if (select_stairs == 1) {
                movimentation_stairs(90, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0, WALK_SIZE, 0, 0, WALK_SIZE, 0, 0, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            if (select_stairs == 2) {
                movimentation_stairs(90, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
                dirLight.intensity = dirLight.intensity - 0.01
                ambientLight.intensity = ambientLight.intensity - 0.01
                if (spotLightMan.intensity < 1) {
                    spotLightMan.intensity = spotLightMan.intensity + 0.01
                }
                if (getIntensityEmissive(asset.object) < 0.15) {
                    iluminaMan(getIntensityEmissive(asset.object) + 0.01, asset.object)
                }
            }
            else if (select_stairs == 3) {
                movimentation_stairs(90, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
        }
        else {
            movimentation_colision(90, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, false, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder);
        }
    }
    else if (keyboard.pressed("D") && keyboard.pressed("W") || keyboard.pressed("right") && keyboard.pressed("up")) {
        var rad = THREE.MathUtils.degToRad(anguloY.Y);
        if (escada) {
            var select_stairs = getColissionObjectId(bbstairs, asset)
            if (select_stairs == 0) {
                movimentation_stairs(180, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            else if (select_stairs == 1) {
                movimentation_stairs(180, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            if (select_stairs == 2) {
                movimentation_stairs(180, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0, WALK_SIZE, 0, 0, WALK_SIZE, 0, 0, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            else if (select_stairs == 3) {
                movimentation_stairs(180, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0, WALK_SIZE, 0, 0, WALK_SIZE, 0, 0, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
        }
        else {
            movimentation_colision(180, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, false, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder);
        }
    }
    else if (keyboard.pressed("A") || keyboard.pressed("left")) {
        var rad = THREE.MathUtils.degToRad(anguloY.Y);
        if (escada) {
            var select_stairs = getColissionObjectId(bbstairs, asset)
            if (select_stairs == 0) {
                movimentation_stairs(315, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            else if (select_stairs == 1) {
                movimentation_stairs(315, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            if (select_stairs == 2) {
                movimentation_stairs(315, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
                dirLight.intensity = dirLight.intensity + 0.01
                ambientLight.intensity = ambientLight.intensity + 0.01
                if (spotLightMan.intensity > 0) {
                    spotLightMan.intensity = spotLightMan.intensity - 0.01
                }
                if (getIntensityEmissive(asset.object) > 0) {
                    iluminaMan(getIntensityEmissive(asset.object) - 0.01, asset.object)
                }
            }
            else if (select_stairs == 3) {
                movimentation_stairs(315, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
        }
        else {
            aux_collision = movimentation_colision(315, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, false, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder);
            if (aux_collision) {
                movimentation_colision(270, Math.sin(THREE.MathUtils.degToRad(270)) * WALK_SIZE, Math.cos(THREE.MathUtils.degToRad(270)) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, true,playAction, asset, asset2, anguloY, bbcube, doors, cameraholder);
                movimentation_colision(0, Math.sin(THREE.MathUtils.degToRad(0)) * WALK_SIZE, Math.cos(THREE.MathUtils.degToRad(0)) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, true, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder);
                movimentation_colision(315, 0, 0, 0, 0, 0, 0, true, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder);
            }
        }
    }
    else if (keyboard.pressed("D") || keyboard.pressed("right")) {
        var rad = THREE.MathUtils.degToRad(anguloY.Y);
        if (escada) {
            var select_stairs = getColissionObjectId(bbstairs, asset)
            if (select_stairs == 0) {
                movimentation_stairs(135, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            else if (select_stairs == 1) {
                movimentation_stairs(135, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            if (select_stairs == 2) {
                movimentation_stairs(135, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
                dirLight.intensity = dirLight.intensity - 0.01
                ambientLight.intensity = ambientLight.intensity - 0.01
                if (spotLightMan.intensity < 1) {
                    spotLightMan.intensity = spotLightMan.intensity + 0.01
                }
                if (getIntensityEmissive(asset.object) < 0.15) {
                    iluminaMan(getIntensityEmissive(asset.object) + 0.01, asset.object)
                }
            }
            else if (select_stairs == 3) {
                movimentation_stairs(135, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
        }
        else {
            aux_collision = movimentation_colision(135, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, false, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder);
            if (aux_collision) {
                movimentation_colision(180, Math.sin(THREE.MathUtils.degToRad(180)) * WALK_SIZE, Math.cos(THREE.MathUtils.degToRad(180)) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, true, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder);
                movimentation_colision(90, Math.sin(THREE.MathUtils.degToRad(90)) * WALK_SIZE, Math.cos(THREE.MathUtils.degToRad(90)) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, true, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder);
                movimentation_colision(135, 0, 0, 0, 0, 0, 0, true, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder);
            }
        }
    }
    else if (keyboard.pressed("S") || keyboard.pressed("down")) {
        var rad = THREE.MathUtils.degToRad(anguloY.Y);
        if (escada) {
            var select_stairs = getColissionObjectId(bbstairs, asset)
            if (select_stairs == 0) {
                movimentation_stairs(45, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            else if (select_stairs == 1) {
                movimentation_stairs(45, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            if (select_stairs == 2) {
                movimentation_stairs(45, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
                dirLight.intensity = dirLight.intensity - 0.01
                ambientLight.intensity = ambientLight.intensity - 0.01
                if (spotLightMan.intensity < 1) {
                    spotLightMan.intensity = spotLightMan.intensity + 0.01
                }
                if (getIntensityEmissive(asset.object) < 0.15) {
                    iluminaMan(getIntensityEmissive(asset.object) + 0.01, asset.object)
                }
            }
            else if (select_stairs == 3) {
                movimentation_stairs(45, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
        }
        else {
            aux_collision = movimentation_colision(45, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, false, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder);
            if (aux_collision) {
                movimentation_colision(0, Math.sin(THREE.MathUtils.degToRad(0)) * WALK_SIZE, Math.cos(THREE.MathUtils.degToRad(0)) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, true, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder);
                movimentation_colision(90, Math.sin(THREE.MathUtils.degToRad(90)) * WALK_SIZE, Math.cos(THREE.MathUtils.degToRad(90)) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, true, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder);
                movimentation_colision(45, 0, 0, 0, 0, 0, 0, true, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder);
            }
        }
    }
    else if (keyboard.pressed("W") || keyboard.pressed("up")) {
        var rad = THREE.MathUtils.degToRad(anguloY.Y);
        if (escada) {
            var select_stairs = getColissionObjectId(bbstairs, asset)
            if (select_stairs == 0) {
                movimentation_stairs(225, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            else if (select_stairs == 1) {
                movimentation_stairs(225, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, -0.025, WALK_SIZE, 0, -0.025, WALK_SIZE, 0, -0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
            if (select_stairs == 2) {
                movimentation_stairs(225, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
                dirLight.intensity = dirLight.intensity + 0.01
                ambientLight.intensity = ambientLight.intensity + 0.01
                if (spotLightMan.intensity > 0) {
                    spotLightMan.intensity = spotLightMan.intensity - 0.01
                }
                if (getIntensityEmissive(asset.object) > 0) {
                    iluminaMan(getIntensityEmissive(asset.object) - 0.01, asset.object)
                }
            }
            else if (select_stairs == 3) {
                movimentation_stairs(225, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, 0.025, WALK_SIZE, 0, 0.025, WALK_SIZE, 0, 0.025, false, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs);
            }
        }
        else {
            aux_collision = movimentation_colision(225, Math.sin(rad) * WALK_SIZE, Math.cos(rad) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, false, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder);
            if (aux_collision) {
                movimentation_colision(270, Math.sin(THREE.MathUtils.degToRad(270)) * WALK_SIZE, Math.cos(THREE.MathUtils.degToRad(270)) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, true, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder);
                movimentation_colision(180, Math.sin(THREE.MathUtils.degToRad(180)) * WALK_SIZE, Math.cos(THREE.MathUtils.degToRad(180)) * WALK_SIZE, WALK_SIZE, 0, WALK_SIZE, 0, true, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder);
                movimentation_colision(225, 0, 0, 0, 0, 0, 0, true, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder);
            }
        }
    }
    else {
        playAction.play = false;
    }
    if (keyboard.down("C")) {
        if (orthographic) {
            camPosition = new THREE.Vector3(14, 12, -14);
            camera = new THREE.PerspectiveCamera(31, window.innerWidth / window.innerHeight, 0.1, s);
            camera.position.copy(camPosition);
            camera.up.copy(upVec);
            camera.lookAt(lookAtVec);

            cameraholder.add(camera);
            scene.add(cameraholder);
            orthographic = false;
        }
        else {
            camPosition = new THREE.Vector3(9, 6, -7);
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

export {keyboardUpdate}