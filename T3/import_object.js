import * as THREE from 'three';
import { GLTFLoader } from '../build/jsm/loaders/GLTFLoader.js'
import {
    setDefaultMaterial,
    getMaxSize
} from "../libs/util/util.js";
import{
    iluminaMan
} from './light.js'

// INITIALIZE CHARACTER
export function loadGLTFFile(asset, file, add_scene, x, y, z, color, iskey, index, scene, bbkey, id_key, mixer) {
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
        iluminaMan(0, obj)
        obj = normalizeAndRescale(obj, 2);
        obj.updateMatrixWorld(true);
        obj.position.x = x
        obj.position.y = y
        obj.position.z = z
        if (add_scene) {
            scene.add(obj);
            scene.add(asset.obj3D)
        }
        asset.object = obj;
        if (iskey) {
            bbkey[index] = new THREE.Box3().setFromObject(asset.object);
            id_key[index] = asset.object
        } else {
            var mixerLocal = new THREE.AnimationMixer(obj);
            mixerLocal.clipAction(gltf.animations[0]).play();
            mixer.push(mixerLocal);
        }
    }, () => { }, () => { });
}

// ADJUST THE SCALES
export function normalizeAndRescale(obj, newScale) {
    var scale = getMaxSize(obj);
    obj.scale.set(newScale * (1.0 / scale),
        newScale * (1.0 / scale),
        newScale * (1.0 / scale));
    return obj;
}