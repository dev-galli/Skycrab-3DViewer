// createPlane.js
import * as THREE from 'three';

export function createPlane() {
    const geometry = new THREE.PlaneGeometry(400, 400);
    const material = new THREE.MeshStandardMaterial({
        color: 0x333344,
        roughness: 0.9,
        metalness: 0,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide,
        depthWrite: true,
        // Se vuoi riflessi: envMap: ...
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 0;
    return plane;
}