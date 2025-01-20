import * as THREE from 'three';

export function createPlane() {
    const radius = 100; // Raggio del piano circolare
    const segments = 128; // Numero di segmenti per una forma liscia
    const geometry = new THREE.CircleGeometry(radius, segments);

    // Materiale trasparente
    const material = new THREE.MeshStandardMaterial({
        color: 0x000000, // Colore nero
        transparent: true, // Abilita la trasparenza
        opacity: 0, // Imposta l'opacità a 0
    });

    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2; // Ruota il piano per essere orizzontale
    plane.receiveShadow = true; // Abilita la ricezione delle ombre
    return plane;
}