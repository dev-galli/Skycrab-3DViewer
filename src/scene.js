import * as THREE from 'three';
import { setupLighting } from './light.js';
import { createPlane } from './plane.js';
import { loadModel, fadeInModel } from './modelLoader.js';

export async function initializeScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.007);

    setupLighting(scene);

    const plane = createPlane();
    scene.add(plane);

    const camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(80, 50, 40);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.useLegacyLights = false;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMappingExposure = 0.5;
    document.getElementById('scene-container').appendChild(renderer.domElement);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Loading
    const { model } = await loadModel(scene);
    fadeInModel(model, 2000);

    return { scene, camera, renderer };
}
