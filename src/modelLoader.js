// modelLoader.js
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

export function loadModel(scene, diffuseMap, normalMap) {
    return new Promise((resolve, reject) => {
        const loader = new FBXLoader();
        loader.load(
            'https://demo-skycrab.s3.eu-north-1.amazonaws.com/Cattedrale_decimata.fbx',
            (fbx) => {
                const model = fbx;
                model.traverse((child) => {
                    if (child.isMesh) {
                        if (!child.geometry.hasAttribute('normal')) {
                            child.geometry.computeVertexNormals();
                        }
                        child.material = new THREE.MeshStandardMaterial({
                            map: diffuseMap,
                            normalMap: normalMap,
                            roughness: 0.7,
                            metalness: 0.0,
                            transparent: true,
                            opacity: 0
                        });
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                scene.add(model);
                resolve(model);
            },
            undefined,
            (error) => {
                console.error('Errore durante il caricamento dell’FBX:', error);
                reject(error);
            }
        );
    });
}

export function fadeInModel(model, duration) {
    const start = performance.now();
    const meshes = [];
    model.traverse((child) => {
        if (child.isMesh && child.material) {
            meshes.push(child);
        }
    });

    function animateFade() {
        const now = performance.now();
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);

        meshes.forEach((mesh) => {
            if (mesh.material && mesh.material.transparent) {
                mesh.material.opacity = progress;
            }
        });

        if (progress < 1) {
            requestAnimationFrame(animateFade);
        }
    }

    animateFade();
}