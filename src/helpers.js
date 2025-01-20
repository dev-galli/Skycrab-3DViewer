import * as THREE from 'three';

/**
 * Aggiunge gli helper alle luci nella scena.
 * @param {THREE.Scene} scene - La scena Three.js.
 * @param {Array} lights - Array delle luci per le quali aggiungere gli helper.
 * @returns {Array} - Array degli helper creati.
 */
export function addHelpersToScene(scene, lights) {
    const helpers = [];
    lights.forEach((light, index) => {
        // Helper per le luci
        const lightHelper = new THREE.PointLightHelper(light, 2);
        scene.add(lightHelper);
        helpers.push({ light, helper: lightHelper });

        // Etichetta per la luce
        const sprite = createTextSprite(`Light ${index + 1}`, { fontsize: 32 });
        sprite.position.copy(light.position.clone().add(new THREE.Vector3(0, 2, 0)));
        scene.add(sprite);
        helpers.push({ light, helper: sprite });
    });
    return helpers;
}

/**
 * Aggiorna la posizione degli helper in base alla posizione delle luci.
 * @param {Array} helpers - Array degli helper da aggiornare.
 */
export function updateHelpers(helpers) {
    helpers.forEach(({ light, helper }) => {
        if (helper instanceof THREE.PointLightHelper) {
            helper.update();
        } else if (helper instanceof THREE.Sprite) {
            helper.position.copy(light.position.clone().add(new THREE.Vector3(0, 2, 0)));
        }
    });
}

/**
 * Crea una sprite testuale per etichettare gli oggetti nella scena.
 * @param {string} message - Il testo da visualizzare.
 * @param {Object} parameters - Opzioni per lo stile del testo.
 * @returns {THREE.Sprite} - Sprite contenente il testo.
 */
function createTextSprite(message, parameters = {}) {
    const fontface = parameters.fontface || "Arial";
    const fontsize = parameters.fontsize || 24;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = `${fontsize}px ${fontface}`;
    context.fillStyle = "rgba(255, 255, 255, 1.0)";
    context.fillText(message, 0, fontsize);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(10, 5, 1); // Dimensioni sprite
    return sprite;
}