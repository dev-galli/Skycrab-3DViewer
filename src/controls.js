import { updateLighting } from './light.js';

export function setupControls(THREE, scene) {
    document.getElementById('day-mode').addEventListener('click', () => {
        updateLighting(THREE, scene, 0xffffff, 1.0); // Daylight
    });

    document.getElementById('sunset-mode').addEventListener('click', () => {
        updateLighting(THREE, scene, 0xffcc99, 0.7); // Sunset
    });

    document.getElementById('night-mode').addEventListener('click', () => {
        updateLighting(THREE, scene, 0x333366, 0.3); // Night
    });
}