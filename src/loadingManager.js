import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

export function setupLoaderManager(scene) {
    const progressText = document.getElementById('progress-text');
    const loadingScreen = document.getElementById('loading-screen');

    // Crea il LoadingManager
    const manager = new THREE.LoadingManager();

    // Callback per il caricamento
    manager.onStart = (url, itemsLoaded, itemsTotal) => {
        console.log(`Inizio caricamento: ${url}`);
        console.log(`File caricati finora: ${itemsLoaded} di ${itemsTotal}`);
        if (progressText) {
            progressText.textContent = 'Caricamento: 0%';
        }
    };

    manager.onProgress = (url, itemsLoaded, itemsTotal) => {
        console.log(`Caricamento in corso: ${url}`);
        const percent = Math.round((itemsLoaded / itemsTotal) * 100);
        if (progressText) {
            progressText.textContent = `Caricamento: ${percent}%`;
        }
    };

    manager.onLoad = () => {
        console.log('Tutti i file caricati con successo!');
        if (progressText) {
            progressText.textContent = 'Caricamento: 100%';
        }

        // Nascondi il loader dopo un breve ritardo
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    };

    manager.onError = (url) => {
        console.error(`Errore nel caricamento della risorsa: ${url}`);
    };

    // Carica le texture
    const textureLoader = new THREE.TextureLoader(manager);
    const diffuseMap = textureLoader.load(
        'https://demo-skycrab.s3.eu-north-1.amazonaws.com/low_Cattedrale_decimata_u0_v0_diffuse.png'
    );
    const normalMap = textureLoader.load(
        'https://demo-skycrab.s3.eu-north-1.amazonaws.com/low_Cattedrale_decimata_u0_v0_normal.png'
    );

    // Carica il modello FBX
    const fbxLoader = new FBXLoader(manager);
    fbxLoader.load(
        'https://demo-skycrab.s3.eu-north-1.amazonaws.com/Cattedrale_decimata.fbx',
        (fbx) => {
            console.log('Modello FBX caricato con successo!');
            fbx.traverse((child) => {
                if (child.isMesh) {
                    console.log('Trovato un Mesh:', child.name);

                    if (!child.geometry.hasAttribute('normal')) {
                        child.geometry.computeVertexNormals();
                        console.log(`Normali calcolate per il mesh ${child.name}`);
                    }

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
            scene.add(fbx);
            fadeInModel(fbx, 2000);
        },
        undefined,
        (error) => {
            console.error('Errore durante il caricamento dell’FBX:', error);
        }
    );

    return manager;
}

// Funzione per il fade-in del modello
function fadeInModel(model, duration) {
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

        if (t < 1) {
            requestAnimationFrame(animate);
        } else {
            console.log('Fade-in completato.');
        }
    }

    animate();
}