import * as THREE from 'three';
import {
    checkCollisions
} from './check.js'
import{
    iluminaMan
} from './light.js'

// GENERATES THE MOVEMENT OF THE CHARACTER
export function movimentation(angulo_max, camX, camZ, camY, walkZ, walkX, walkY, walkZ_hide, walkX_hide, walkY_hide, deslisa, asset, asset2, anguloY, cameraholder) {
    if(asset.object != null)
    {if (angulo_max > anguloY.Y) {
        var dif = angulo_max - anguloY.Y
        var dif2 = 360 - angulo_max + anguloY.Y
        if (dif2 < dif) {
            anguloY.Y = anguloY.Y + 360
        }
    }
    else {
        var dif = anguloY.Y - angulo_max
        var dif2 = 360 - anguloY.Y + angulo_max
        if (dif2 < dif) {
            angulo_max = angulo_max + 360
        }
    }
    if (anguloY.Y < angulo_max && !deslisa) {
        anguloY.Y = anguloY.Y + 5;
        var rad = THREE.MathUtils.degToRad(5);
        asset.object.rotateY(rad);
        asset2.object.rotateY(rad);
        asset.obj3D.rotateY(rad);
        if (anguloY.Y > 360) {
            anguloY.Y = anguloY.Y - 360
        }
    }
    else if (anguloY.Y > angulo_max && !deslisa) {
        anguloY.Y = anguloY.Y - 5;
        var rad = THREE.MathUtils.degToRad(-5);
        asset.object.rotateY(rad);
        asset2.object.rotateY(rad);
        asset.obj3D.rotateY(rad);
        if (anguloY.Y > 360) {
            anguloY.Y = anguloY.Y - 360
        }
    }
    else if (deslisa) {
        if (anguloY.Y < angulo_max) {
            while (anguloY.Y < angulo_max) {
                anguloY.Y = anguloY.Y + 1;
                var rad = THREE.MathUtils.degToRad(1);
                asset.object.rotateY(rad);
                asset2.object.rotateY(rad);
                asset.obj3D.rotateY(rad);
            }
        }
        if (anguloY.Y > angulo_max) {
            while (anguloY.Y > angulo_max) {
                anguloY.Y = anguloY.Y - 1;
                var rad = THREE.MathUtils.degToRad(-1);
                asset.object.rotateY(rad);
                asset2.object.rotateY(rad);
                asset.obj3D.rotateY(rad);
                }
            }
        }
        cameraholder.translateX(camX);
        cameraholder.translateZ(camZ);
        cameraholder.translateY(camY);
        asset.object.translateZ(walkZ);
        asset.object.translateX(walkX);
        asset.object.translateY(walkY);
        asset.obj3D.translateZ(walkZ);
        asset.obj3D.translateX(walkX);
        asset.obj3D.translateY(walkY);
        asset2.object.translateZ(walkZ_hide);
        asset2.object.translateX(walkX_hide);
        asset2.object.translateY(walkY_hide);
        asset.bb.setFromObject(asset.object);
        asset2.bb.setFromObject(asset2.object);
    }
}

export function movimentation_stairs(angulo_max, camX, camZ, camY, walkZ, walkX, walkY, walkZ_hide, walkX_hide, walkY_hide, deslisa, bbcube, doors, anguloY, asset, asset2, cameraholder, playAction, dirLight, ambientLight, bbstairs) {
    playAction.play = true;
    var collision = checkCollisions(bbcube, asset)
    var collision_door = checkCollisions(doors.box, asset)
    if (!collision && !collision_door) {
        movimentation(angulo_max, camX, camZ, camY, walkZ, walkX, walkY, walkZ_hide, walkX_hide, walkY_hide, deslisa, asset, asset2, anguloY, cameraholder);
    }
    else {
        movimentation(angulo_max, 0, 0, 0, 0, 0, 0, walkZ_hide, -0.6, 0, deslisa,asset, asset2, anguloY, cameraholder);
        collision = checkCollisions(bbcube, asset2);
        collision_door = checkCollisions(doors.box, asset2);
        if (collision || collision_door) {
            asset2.object.position.x = asset.object.position.x
            asset2.object.position.z = asset.object.position.z
            asset2.object.position.y = asset.object.position.y;
            asset2.bb.setFromObject(asset2.object);
            movimentation(angulo_max, 0, 0, 0, 0, 0, 0, walkZ_hide, 0.6, 0, deslisa, asset, asset2, anguloY, cameraholder);
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
                movimentation(angulo_max, camX, camZ, camY, walkZ, walkX, walkY, walkZ_hide, walkX_hide, walkY_hide, deslisa, asset, asset2, anguloY, cameraholder);
            }
        }
        else {
            asset2.object.position.x = asset.object.position.x
            asset2.object.position.z = asset.object.position.z
            asset2.object.position.y = asset.object.position.y;
            movimentation(angulo_max, camX, camZ, camY, walkZ, walkX, walkY, walkZ_hide, walkX_hide, walkY_hide, deslisa, asset, asset2, anguloY, cameraholder);
        }
    }
    collision = checkCollisions(bbstairs, asset)
    if (asset.object.position.y > 0 && asset.object.position.y < 1 && !collision) {
        asset.object.position.y = 0
        asset2.object.position.y = 0
        cameraholder.position.y = 0
        dirLight.intensity = 0.8
        ambientLight.intensity = 0.5
        iluminaMan(0, asset.object)
    }
    else if (asset.object.position.y < 0 && asset.object.position.y > -1 && !collision) {
        asset.object.position.y = 0
        asset2.object.position.y = 0
        cameraholder.position.y = 0
        dirLight.intensity = 0.8
        ambientLight.intensity = 0.5
        iluminaMan(0, asset.object)
    }
    else if (asset.object.position.y < -2 && !collision) {
        asset.object.position.y = -3
        asset2.object.position.y = -3
        cameraholder.position.y = -3
    }
    else if (asset.object.position.y > 2 && !collision) {
        asset.object.position.y = 3
        asset2.object.position.y = 3
        cameraholder.position.y = 3
    }
}

// TREAT MOVEMENTS WITH CHARACTER COLLISION
export function movimentation_colision(angulo_max, camX, camZ, walkZ, walkX, walkZ_hide, walkX_hide, deslisa, playAction, asset, asset2, anguloY, bbcube, doors, cameraholder, bbGLTF) {
    playAction.play = true;
    var collision = checkCollisions(bbcube, asset)
    var collision_door = checkCollisions(doors.box, asset)
    var collision_GLTF = checkCollisions(bbGLTF, asset)
    if (!collision && !collision_door && !collision_GLTF) {
        movimentation(angulo_max, camX, camZ, 0, walkZ, walkX, 0, walkZ_hide, walkX_hide, 0, deslisa, asset, asset2, anguloY, cameraholder);
    }
    else {
        movimentation(angulo_max, 0, 0, 0, 0, 0, 0, walkZ_hide, -0.6, 0, deslisa, asset, asset2, anguloY, cameraholder);
        collision = checkCollisions(bbcube, asset2);
        collision_door = checkCollisions(doors.box, asset2);
        collision_GLTF = checkCollisions(bbGLTF, asset2)
        if (collision || collision_door || collision_GLTF) {
            asset2.object.position.x = asset.object.position.x
            asset2.object.position.z = asset.object.position.z
            asset2.object.position.y = asset.object.position.y;
            asset2.bb.setFromObject(asset2.object);
            movimentation(angulo_max, 0, 0, 0, 0, 0, 0, walkZ_hide, 0.6, 0, deslisa, asset, asset2, anguloY, cameraholder);
            collision = checkCollisions(bbcube, asset2);
            collision_GLTF = checkCollisions(bbGLTF, asset2)
            if (collision || collision_door || collision_GLTF) {
                asset2.object.position.x = asset.object.position.x
                asset2.object.position.z = asset.object.position.z
                asset2.object.position.y = asset.object.position.y;
                asset2.bb.setFromObject(asset2.object);
            }
            else {
                asset2.object.position.x = asset.object.position.x
                asset2.object.position.z = asset.object.position.z
                asset2.object.position.y = asset.object.position.y;
                movimentation(angulo_max, camX, camZ, 0, walkZ, walkX, 0, walkZ_hide, walkX_hide, 0, deslisa, asset, asset2, anguloY, cameraholder);
            }
        }
        else {
            asset2.object.position.x = asset.object.position.x
            asset2.object.position.z = asset.object.position.z
            asset2.object.position.y = asset.object.position.y;
            movimentation(angulo_max, camX, camZ, 0, walkZ, walkX, 0, walkZ_hide, walkX_hide, 0, deslisa, asset, asset2, anguloY, cameraholder);
        }
    }
    return collision || collision_GLTF
}