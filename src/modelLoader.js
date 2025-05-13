// modelLoader.js
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

export function setupModelLoader(scene) {
    const progressText = document.getElementById('progress-text');
    const loadingScreen = document.getElementById('loading-screen');
    const manager = new THREE.LoadingManager();

    manager.onStart = (url, itemsLoaded, itemsTotal) => {
        if (progressText) progressText.textContent = 'Caricamento: 0%';
    };

    manager.onProgress = (url, itemsLoaded, itemsTotal) => {
        const percent = Math.round((itemsLoaded / itemsTotal) * 100);
        if (progressText) progressText.textContent = `Caricamento: ${percent}%`;
    };

    manager.onLoad = () => {
        if (progressText) progressText.textContent = 'Caricamento: 100%';
        if (loadingScreen) setTimeout(() => { loadingScreen.style.display = 'none'; }, 500);
    };

    manager.onError = (url) => {
        console.error(`Errore nel caricamento della risorsa: ${url}`);
    };

    const textureLoader = new THREE.TextureLoader(manager);
    const diffuseMap = textureLoader.load('/models/low_Cattedrale_decimata_u0_v0_diffuse.png');
    const normalMap = textureLoader.load('/models/low_Cattedrale_decimata_u0_v0_normal.png');

    return new Promise((resolve, reject) => {
        const fbxLoader = new FBXLoader(manager);
        fbxLoader.load(
            '/models/Cattedrale_decimata.fbx',
            (fbx) => {
                fbx.traverse((child) => {
                    if (child.isMesh) {
                        if (!child.geometry.hasAttribute('normal')) child.geometry.computeVertexNormals();
                        child.material = new THREE.MeshStandardMaterial({
                            map: diffuseMap,
                            normalMap: normalMap,
                            roughness: 0.7,
                            metalness: 0.0,
                            transparent: true,
                            opacity: 0,
                        });
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                // 1. Scala il modello per evitare che sia gigante
                fbx.scale.set(0.01, 0.01, 0.01); // PROVA questo valore, eventualmente modificalo
                // Converti gradi in radianti
                fbx.rotation.y = THREE.MathUtils.degToRad(140); // Rotazione di 45 gradi

                // 2. Centra il modello sul piano
                // Calcola bounding box del modello
                const box = new THREE.Box3().setFromObject(fbx);
                const size = new THREE.Vector3();
                const center = new THREE.Vector3();
                box.getSize(size);
                box.getCenter(center);

                // Sposta il modello affinché la base tocchi y=0 (il piano)
                const yOffset = box.min.y;  // quanto sotto lo zero va la mesh
                fbx.position.y -= yOffset;
                scene.add(fbx);
                resolve(fbx);
            },
            undefined,
            error => reject(error)
        );

    });
}

export function fadeInModel(model, duration) {
    const startOpacity = 0;
    const endOpacity = 1;
    const startTime = performance.now();

    function animate() {
        const elapsedTime = performance.now() - startTime;
        const t = Math.min(elapsedTime / duration, 1);
        const currentOpacity = startOpacity + (endOpacity - startOpacity) * t;

        model.traverse((child) => {
            if (child.isMesh && child.material) {
                child.material.opacity = currentOpacity;
                child.material.transparent = true;
            }
        });

        if (t < 1) requestAnimationFrame(animate);
    }
    animate();
}
