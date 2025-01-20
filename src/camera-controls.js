import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function setupCameraControls(camera, renderer) {
    const controls = new OrbitControls(camera, renderer.domElement);

    // Abilita lo zoom e il pan
    controls.enableZoom = true;
    controls.enablePan = true;

    // Imposta i limiti di rotazione verticale (polar angle)
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI / 2;

    // Imposta i limiti di distanza per lo zoom
    controls.minDistance = 40;
    controls.maxDistance = 110;

    // Imposta il target iniziale della camera
    controls.target.set(0, 20, 0);

    // Abilita lo "smooth damping" per movimenti fluidi
    controls.enableDamping = true;
    controls.dampingFactor = 0.1; // Valore consigliato (più basso = più fluido, più alto = più reattivo)

    // Limiti per il panning
    const panLimits = {
        min: { x: -50, y: 10 }, // Limite minimo per X e Y
        max: { x: 50, y: 40 },  // Limite massimo per X e Y
    };

    function limitPan() {
        const target = controls.target;

        // Applica i limiti al panning
        target.x = Math.max(panLimits.min.x, Math.min(panLimits.max.x, target.x));
        target.y = Math.max(panLimits.min.y, Math.min(panLimits.max.y, target.y));
    }

    // Intercetta l'evento di aggiornamento per limitare il pan
    controls.addEventListener('change', () => {
        limitPan();
    });

    // Per un effetto più fluido, aggiorna i controlli in ogni frame
    function animate() {
        requestAnimationFrame(animate);
        controls.update(); // Aggiorna lo stato dei controlli (richiesto con `enableDamping`)
    }

    animate(); // Avvia l'animazione per aggiornare costantemente i controlli

    return controls;
}