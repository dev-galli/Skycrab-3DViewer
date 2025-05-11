// main.js

import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

import { cameraPoints } from './cameraPoints.js';
import { createPlane } from './createPlane.js';
import { setupLighting } from './light.js';
import { setupModelLoader, fadeInModel } from './modelLoader.js';
import { setupSmoothScrollParallax } from './scrollEffects.js';

// Registra i plugin GSAP
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// === SCENA & RENDERER ===
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
renderer.toneMappingExposure = 0.8;

// Assicurati che l'elemento container esista
const container = document.getElementById('scene-container');
if (!container) {
    console.error('Container element not found!');
    throw new Error('Container element not found!');
}
container.appendChild(renderer.domElement);

// === LUCI ===
const lighting = setupLighting(scene);

// === PIANO ===
const plane = createPlane();
scene.add(plane);

// === OVERLAY E TEXT ELEMENTS ===
const overlay = document.querySelector('.text-overlay');
const overlayTitle = document.querySelector('.overlay-title');
const overlayDesc = document.querySelector('.overlay-desc');

// === CAMERA, TARGET, ANIMAZIONI ===
let currentPoint = 0;
let target = new THREE.Vector3().copy(cameraPoints[0].target);

function updateOverlayContent(point) {
    if (overlayTitle) overlayTitle.textContent = point.title;
    if (overlayDesc) overlayDesc.textContent = point.description;
}

function gotoPoint(index) {
    if (index < 0 || index >= cameraPoints.length) return;
    const point = cameraPoints[index];
    gsap.to(camera.position, {
        x: point.position.x,
        y: point.position.y,
        z: point.position.z,
        duration: 3,
        ease: "power2.inOut"
    });
    gsap.to(target, {
        x: point.target.x,
        y: point.target.y,
        z: point.target.z,
        duration: 3,
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
    if (isAnimating) return;
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

// === PERFORMANCE MONITORING ===
let lastTime = 0;
const fpsElement = document.getElementById('fps');
function updateFPS(currentTime) {
    if (fpsElement) {
        const delta = (currentTime - lastTime) / 1000;
        const fps = 1 / delta;
        fpsElement.textContent = `FPS: ${Math.round(fps)}`;
        lastTime = currentTime;
    }
}

// === RENDER LOOP ===
function animate(currentTime) {
    requestAnimationFrame(animate);

    
    if (lighting && lighting.animateLight) {
        lighting.animateLight(0.003);
    }

    camera.lookAt(target);
    renderer.render(scene, camera);

    updateFPS(currentTime);
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

// === CLEANUP FUNCTION ===
function cleanup() {
    window.removeEventListener('resize', onResize);
    window.removeEventListener('wheel', wheelHandler);
    renderer.dispose();
    // Dispose delle geometrie e dei materiali se necessario
}

// === START ANIMATION ===
animate();

// Esporta le funzioni necessarie
export { scene, camera, renderer, cleanup };
