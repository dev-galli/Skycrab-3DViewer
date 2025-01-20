// light.js
import * as THREE from 'three';
let ambientLight, directionalLight;

export function setupLighting(scene) {
    // Imposta la luce ambientale
    ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    // Imposta la luce direzionale
    directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    scene.add(directionalLight);
}

function transitionLighting(params, duration) {
    const {
        ambientColor, ambientIntensity,
        directionalColor, directionalIntensity, directionalPosition,
    } = params;

    const startAmbientColor = ambientLight.color.clone();
    const startAmbientIntensity = ambientLight.intensity;
    const startDirectionalColor = directionalLight.color.clone();
    const startDirectionalIntensity = directionalLight.intensity;
    const startDirectionalPosition = directionalLight.position.clone();

    const targetAmbientColor = new THREE.Color(ambientColor);
    const targetDirectionalColor = new THREE.Color(directionalColor);

    const startTime = performance.now();

    function animateTransition() {
        const now = performance.now();
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);

        ambientLight.color.copy(startAmbientColor).lerp(targetAmbientColor, t);
        ambientLight.intensity = startAmbientIntensity + (ambientIntensity - startAmbientIntensity) * t;

        directionalLight.color.copy(startDirectionalColor).lerp(targetDirectionalColor, t);
        directionalLight.intensity = startDirectionalIntensity + (directionalIntensity - startDirectionalIntensity) * t;
        directionalLight.position.lerpVectors(startDirectionalPosition, directionalPosition, t);

        if (t < 1) {
            requestAnimationFrame(animateTransition);
        } else {
            ambientLight.color.copy(targetAmbientColor);
            ambientLight.intensity = ambientIntensity;
            directionalLight.color.copy(targetDirectionalColor);
            directionalLight.intensity = directionalIntensity;
            directionalLight.position.copy(directionalPosition);
            directionalLight.shadow.needsUpdate = true;
        }
    }

    animateTransition();
}

// Definizioni degli scenari di illuminazione
export function setDayLighting(scene) {
    transitionLighting({
        ambientColor: 0xffffff,
        ambientIntensity: 1.0,
        directionalColor: 0xffffff,
        directionalIntensity: 2.0,
        directionalPosition: new THREE.Vector3(10, 10, 10),
    }, 3000);
}

export function setSunsetLighting(scene) {
    transitionLighting({
        ambientColor: 0xffa07a, // Arancione tenue
        ambientIntensity: 0.6,
        directionalColor: 0xffd27f, // Colore caldo ma non eccessivo
        directionalIntensity: 1.7,
        directionalPosition: new THREE.Vector3(-15, 5, 15), // Posizione laterale e più bassa
    }, 3000);

    // Aggiungi la nebbia in transizione
    transitionFog(scene, 0xffb482, 0.003, 3000); // Nebbia arancione tenue con densità moderata
}

export function setNightLighting(scene) {
    transitionLighting({
        ambientColor: 0x000022,       // Colore molto scuro con una tinta blu
        ambientIntensity: 1.4,        // Bassa intensità ambientale
        directionalColor: 0x666688,   // Luce direzionale con tonalità blu/grigio, come la luce lunare
        directionalIntensity: 1.5,    // Bassa intensità per simulare la luce della luna
        directionalPosition: new THREE.Vector3(-50, 40, -50),  // Posizione della luce per simulare la luna alta nel cielo
    }, 3000);
    transitionFog(scene, 0x000022, 0.007, 3000); // Nebbia arancione tenue con densità moderata

}

// Funzione per gestire la transizione della nebbia
function transitionFog(scene, targetColor, targetDensity, duration) {
    const startFogColor = scene.fog.color.clone();
    const startFogDensity = scene.fog.density;

    const targetFogColor = new THREE.Color(targetColor);

    const startTime = performance.now();

    function animateFog() {
        const now = performance.now();
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);

        // Interpola il colore e la densità della nebbia
        scene.fog.color.copy(startFogColor).lerp(targetFogColor, t);
        scene.fog.density = startFogDensity + (targetDensity - startFogDensity) * t;

        if (t < 1) {
            requestAnimationFrame(animateFog);
        }
    }

    animateFog();
}