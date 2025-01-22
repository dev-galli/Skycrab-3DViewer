import * as THREE from 'three';
import { initializeScene, scene, camera, renderer } from './scene.js';
import { setupCameraControls } from './camera-controls.js';
import { setDayLighting, setSunsetLighting, setNightLighting } from './light.js';
import { createPlane } from './plane.js';
import { setupLoaderManager } from './loadingManager.js';

document.addEventListener('DOMContentLoaded', () => {
    const menuIcon = document.getElementById('menu-icon');
    const menu = document.getElementById('menu');
    const buttons = menu.querySelectorAll('.menu-button');

    // Aggiungi l'evento per aprire/chiudere il menu
    menuIcon.addEventListener('click', () => {
        menu.classList.toggle('visible');
    });

    // Funzione per rimuovere la classe attiva da tutti i pulsanti
    const clearActiveState = () => {
        buttons.forEach((button) => button.classList.remove('active'));
    };

    // Eventi per cambiare modalità e aggiungere classe attiva
    document.getElementById('day-mode').addEventListener('click', () => {
        setDayLighting(scene);
        clearActiveState();
        document.getElementById('day-mode').classList.add('active');
        menu.classList.remove('visible'); // Chiude il menu
    });

    document.getElementById('sunset-mode').addEventListener('click', () => {
        setSunsetLighting(scene);
        clearActiveState();
        document.getElementById('sunset-mode').classList.add('active');
        menu.classList.remove('visible'); // Chiude il menu
    });

    document.getElementById('night-mode').addEventListener('click', () => {
        setNightLighting(scene);
        clearActiveState();
        document.getElementById('night-mode').classList.add('active');
        menu.classList.remove('visible'); // Chiude il menu
    });
});

// Configura il LoaderManager e inizializza la scena
setupLoaderManager(scene);

initializeScene().then(() => {
    // Inizializza i controlli della camera
    const controls = setupCameraControls(camera, renderer);
    const plane = createPlane();
    scene.add(plane);
    scene.fog = new THREE.FogExp2(0xffffff, 0.0005); // Nebbia iniziale tenue e neutra

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