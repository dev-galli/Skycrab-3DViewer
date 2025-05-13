import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

import { cameraPoints } from './cameraPoints.js';
import { createPlane } from './createPlane.js';
import { setupLighting } from './light.js';
import { setupModelLoader, fadeInModel } from './modelLoader.js';
import { setupSmoothScrollParallax } from './scrollEffects.js';
import { initDebugUI } from './debugSystem.js';

// Registra i plugin GSAP
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// === SETUP INIZIALE ===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222231);
scene.fog = new THREE.FogExp2(0x000000, 0.001);

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    5000
);
camera.position.copy(cameraPoints[0].position);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance"
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.9;

// === SETUP CONTAINER ===
const container = document.getElementById('scene-container');
if (!container) {
    console.error('Container element not found!');
    throw new Error('Container element not found!');
}
container.appendChild(renderer.domElement);

// === SETUP LIGHTING ===
const lighting = setupLighting(scene);
const { sunLight, ambientLight } = lighting;

// === SETUP DEBUG UI ===
let debugEnabled = true;
const debugSystem = initDebugUI(scene, camera, {
    sunLight,
    ambientLight
}, renderer);

// Assicurati che il pannello sia visibile all'avvio
debugSystem.toggle(debugEnabled);

// Toggle debug con tasto 'D'
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'd') {
        debugEnabled = !debugEnabled;
        debugSystem.toggle(debugEnabled);
    }
});
// === SETUP PIANO ===
const plane = createPlane();
scene.add(plane);

// === SETUP UI ELEMENTS ===
const overlay = document.querySelector('.text-overlay');
const overlayTitle = document.querySelector('.overlay-title');
const overlayDesc = document.querySelector('.overlay-desc');

// === CAMERA CONTROL ===
let currentPoint = 0;
let target = new THREE.Vector3().copy(cameraPoints[0].target);

function updateOverlayContent(point) {
    if (overlayTitle) overlayTitle.textContent = point.title;
    if (overlayDesc) overlayDesc.textContent = point.description;
}

function gotoPoint(index) {
    if (index < 0 || index >= cameraPoints.length) return;
    const point = cameraPoints[index];
    const LIGHT_TRANSITION_DURATION = 1.5;

    gsap.to(camera.position, {
        x: point.position.x,
        y: point.position.y,
        z: point.position.z,
        duration: LIGHT_TRANSITION_DURATION,
        ease: "power2.inOut"
    });

    gsap.to(target, {
        x: point.target.x,
        y: point.target.y,
        z: point.target.z,
        duration: LIGHT_TRANSITION_DURATION,
        ease: "power2.inOut"
    });

    if (overlay) {
        gsap.timeline()
            .to(overlay, {
                opacity: 0,
                y: 50,
                duration: 0.8,
                ease: "power2.in"
            })
            .call(() => updateOverlayContent(point))
            .to(overlay, {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power2.out"
            });
    }
}

// === CARICAMENTO MODELLO ===
setupModelLoader(scene)
    .then(model => {
        fadeInModel(model, 2000);
    })
    .catch(error => {
        console.error('Errore caricamento modello:', error);
    });

// === GESTIONE SCROLL ===
let isAnimating = false;
const wheelHandler = (e) => {
    if (isAnimating || debugEnabled) return;
    const threshold = 30;
    if (Math.abs(e.deltaY) < threshold) return;

    isAnimating = true;

    if (e.deltaY > 0 && currentPoint < cameraPoints.length - 1) {
        currentPoint++;
        gotoPoint(currentPoint);
    } else if (e.deltaY < 0 && currentPoint > 0) {
        currentPoint--;
        gotoPoint(currentPoint);
    }

    setTimeout(() => { isAnimating = false; }, 2000);
};

window.addEventListener('wheel', wheelHandler, { passive: true });

// === RESPONSIVE ===
const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
};
window.addEventListener('resize', onResize);

// === RENDER LOOP ===
// === RENDER LOOP ===
let lastTime = performance.now();

function animate(currentTime) {
    requestAnimationFrame(animate);

    if (!debugEnabled) {
        camera.lookAt(target);
    }

    if (debugEnabled) {
        debugSystem.update({
            camera,
            target,
            lighting: {
                sunLight,
                ambientLight
            },
            deltaTime: currentTime ? (currentTime - lastTime) / 1000 : 0,
            renderer // Aggiungi il renderer qui
        });
    }

    renderer.render(scene, camera);
    lastTime = currentTime;
}


// === INIZIALIZZAZIONE SCROLL SMOOTHER ===
setupSmoothScrollParallax();
if (ScrollSmoother) {
    ScrollSmoother.create({
        smooth: 1,
        effects: true,
        smoothTouch: 0.1
    });
}

// === CLEANUP ===
function cleanup() {
    window.removeEventListener('resize', onResize);
    window.removeEventListener('wheel', wheelHandler);
    renderer.dispose();
    debugSystem.dispose();
}

// === START ===
animate();

// === EXPORTS ===
export { scene, camera, renderer, cleanup };
