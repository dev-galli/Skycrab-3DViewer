import * as THREE from 'three';
import { initializeScene, scene, camera, renderer } from './scene.js';
import { setupCameraControls } from './camera-controls.js';
import { setDayLighting, setSunsetLighting, setNightLighting } from './light.js';
import { createPlane } from './plane.js'; 



document.addEventListener('DOMContentLoaded', () => {
    const menuIcon = document.getElementById('menu-icon');
    const menu = document.getElementById('menu');

    // Aggiungi l'evento per aprire/chiudere il menu
    menuIcon.addEventListener('click', () => {
        menu.classList.toggle('visible');
    });

    // Eventi per cambiare modalità
    document.getElementById('day-mode').addEventListener('click', () => {
        setDayLighting(scene);
        menu.classList.remove('visible'); // Chiude il menu
    });

    document.getElementById('sunset-mode').addEventListener('click', () => {
        setSunsetLighting(scene);
        menu.classList.remove('visible'); // Chiude il menu
    });

    document.getElementById('night-mode').addEventListener('click', () => {
        setNightLighting(scene);
        menu.classList.remove('visible'); // Chiude il menu
    });
});

initializeScene().then(() => {
    // Inizializza i controlli della camera
    const controls = setupCameraControls(camera, renderer);
    const plane = createPlane();
    scene.add(plane);
    scene.fog = new THREE.FogExp2(0xffffff, 0.0005); // Nebbia iniziale tenue e neutra


    // Nascondi il loader
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }

    function animate() {
        requestAnimationFrame(animate);
        controls.update(); // Necessario per il damping
        renderer.render(scene, camera);
    }
    animate();

    console.log('Scena e modello pronti!');
}).catch((err) => {
    console.error('Errore inizializzazione scena:', err);
});
