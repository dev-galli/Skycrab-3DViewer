// scene.js
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { setupLighting } from './light.js';
import { createPlane } from './plane.js';
import { loadModel, fadeInModel } from './modelLoader.js';
import { AxesHelper } from 'three';

let scene, camera, renderer, model;

export function initializeScene() {
    return new Promise((resolve, reject) => {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        scene.fog = new THREE.FogExp2(0x000000, 0.007);

        setupLighting(scene);
        // Aggiungi il piano alla scena
        const plane = createPlane();
        scene.add(plane);

        camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(80, 50, 40);
        camera.lookAt(0, 0, 0);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.useLegacyLights = false;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMappingExposure = 0.5;
        document.getElementById('scene-container').appendChild(renderer.domElement);

        window.addEventListener('resize', () => {
            if (!camera || !renderer) return;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        const manager = new THREE.LoadingManager();
        const textureLoader = new THREE.TextureLoader(manager);
        const diffuseMap = textureLoader.load('/models/low_Cattedrale_decimata_u0_v0_diffuse.png');
        const normalMap = textureLoader.load('/models/low_Cattedrale_decimata_u0_v0_normal.png');

        manager.onLoad = () => {
            loadModel(scene, diffuseMap, normalMap).then((loadedModel) => {
                model = loadedModel;
                resolve();
                fadeInModel(model, 2000);
            }).catch((error) => {
                reject(error);
            });
        };

        manager.onError = (url) => {
            console.error('Errore nel caricamento di:', url);
        };
    });
}

export { scene, camera, renderer };