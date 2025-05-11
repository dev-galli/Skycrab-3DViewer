import * as THREE from 'three';

export function setupLighting(scene) {
    // Configurazione luci principali
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.6); // Più intensa
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xFFFACD, 2.2); // Più intensa
    sunLight.position.set(50, 120, 50); // Un po’ più alta di default
    sunLight.castShadow = true;

    // Configurazione ombre
    sunLight.shadow.mapSize.width = 4096;
    sunLight.shadow.mapSize.height = 4096;
    sunLight.shadow.camera.near = 0.1;
    sunLight.shadow.camera.far = 1000;
    sunLight.shadow.camera.left = -200;
    sunLight.shadow.camera.right = 200;
    sunLight.shadow.camera.top = 200;
    sunLight.shadow.camera.bottom = -200;
    sunLight.shadow.bias = -0.0001;
    sunLight.shadow.radius = 2;

    scene.add(sunLight);

    // Luce di riempimento più presente
    const fillLight = new THREE.DirectionalLight(0x4B6EA8, 0.8);
    fillLight.position.set(-50, 40, -50);
    scene.add(fillLight);

    // Funzione di animazione della luce
    const animateLight = (speed = 0.2) => { // speed > 0.1 = ciclo giorno più veloce!
        const time = Date.now() * 0.001 * speed;

        // Movimento del sole più rapido e resta alto nel cielo
        const x = Math.sin(time) * 200;
        // Maggiore "altezza" minima: la luce non scende mai troppo bassa
        const y = Math.abs(Math.cos(time)) * 80 + 100; // tra 100 e 180
        const z = Math.cos(time * 0.5) * 100;

        sunLight.position.set(x, y, z);

        // Intensità sempre almeno su 0.6, mai troppo basso
        const intensity = THREE.MathUtils.clamp(y / 120, 0.6, 2.2);
        sunLight.intensity = intensity;

        // Colore e intensità fillLight variano con l'altezza
        if (y < 120) {
            sunLight.color.setHex(0xFF8000); // Più arancione per il tramonto
            fillLight.intensity = 0.2;
        } else if (y < 160) {
            sunLight.color.setHex(0xFFD700); // Giallo caldo
            fillLight.intensity = 0.4;
        } else {
            sunLight.color.setHex(0xFFFACD); // Luce diurna
            fillLight.intensity = 0.6;
        }

        ambientLight.intensity = THREE.MathUtils.clamp(intensity * 0.5, 0.3, 1.2);
    };

    return {
        sunLight,
        ambientLight,
        fillLight,
        animateLight // Importante: esporta la funzione di animazione
    };
}
