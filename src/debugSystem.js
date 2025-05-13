import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function initDebugUI(scene, camera, lighting, renderer) {
    const debugContainer = document.createElement('div');
    debugContainer.id = 'debug-container';
    // Struttura HTML
    debugContainer.innerHTML = `
        <div class="debug-title"><h3>Debug Panel</h3>
        <p class="debug-text">Controllo interattivo luci e camera • Aggiornamento live</p></div>
        <hr>
        <div class="controls-section">
            <div class="control-group">
                <label>Sun Light Intensity</label>
                <div class="slider-row">
                    <input type="range" id="sunIntensity" min="0" max="10" step="0.1" value="${lighting.sunLight.intensity}">
                    <span class="value-display">${lighting.sunLight.intensity}</span>
                </div>
            </div>

            <div class="control-group">
                <label>Ambient Light Intensity</label>
                <div class="slider-row">
                    <input type="range" id="ambientIntensity" min="0" max="4" step="0.1" value="${lighting.ambientLight.intensity}">
                    <span class="value-display">${lighting.ambientLight.intensity}</span>
                </div>
            </div>

            <div class="control-group">
                <label>Camera Position X</label>
                <div class="slider-row">
                    <input type="range" id="cameraX" min="-200" max="200" step="0.1" value="${camera.position.x}">
                    <span class="value-display">${camera.position.x.toFixed(2)}</span>
                </div>
            </div>

            <div class="control-group">
                <label>Camera Position Y</label>
                <div class="slider-row">
                    <input type="range" id="cameraY" min="-200" max="200" step="0.1" value="${camera.position.y}">
                    <span class="value-display">${camera.position.y.toFixed(2)}</span>
                </div>
            </div>

            <div class="control-group">
                <label>Camera Position Z</label>
                <div class="slider-row">
                    <input type="range" id="cameraZ" min="-200" max="200" step="0.1" value="${camera.position.z}">
                    <span class="value-display">${camera.position.z.toFixed(2)}</span>
                </div>
            </div>
        </div>

        <div id="info-container"></div>
        <button id="copy-camera" class="copy-button">📸 Copy Camera</button>
    `;

    document.body.appendChild(debugContainer);

    // Event Listeners per gli slider
    const sunSlider = debugContainer.querySelector('#sunIntensity');
    const ambientSlider = debugContainer.querySelector('#ambientIntensity');
    const cameraXSlider = debugContainer.querySelector('#cameraX');
    const cameraYSlider = debugContainer.querySelector('#cameraY');
    const cameraZSlider = debugContainer.querySelector('#cameraZ');

    sunSlider.addEventListener('input', (e) => {
        lighting.sunLight.intensity = parseFloat(e.target.value);
        e.target.nextElementSibling.textContent = e.target.value;
    });

    ambientSlider.addEventListener('input', (e) => {
        lighting.ambientLight.intensity = parseFloat(e.target.value);
        e.target.nextElementSibling.textContent = e.target.value;
    });

    cameraXSlider.addEventListener('input', (e) => {
        camera.position.x = parseFloat(e.target.value);
        e.target.nextElementSibling.textContent = parseFloat(e.target.value).toFixed(2);
    });

    cameraYSlider.addEventListener('input', (e) => {
        camera.position.y = parseFloat(e.target.value);
        e.target.nextElementSibling.textContent = parseFloat(e.target.value).toFixed(2);
    });

    cameraZSlider.addEventListener('input', (e) => {
        camera.position.z = parseFloat(e.target.value);
        e.target.nextElementSibling.textContent = parseFloat(e.target.value).toFixed(2);
    });

    // Resto del codice originale
    const infoContainer = debugContainer.querySelector('#info-container');
    const copyButton = debugContainer.querySelector('#copy-camera');
    const controls = new OrbitControls(camera, document.body);
    controls.enabled = false;

    document.body.appendChild(debugContainer);
    console.log('Debug container added to DOM');


    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 0;

    function vectorToString(v, precision = 2) {
        return `x: ${v.x.toFixed(precision)}, y: ${v.y.toFixed(precision)}, z: ${v.z.toFixed(precision)}`;
    }

    function updateFPS() {
        frameCount++;
        const currentTime = performance.now();
        if (currentTime - lastTime >= 1000) {
            fps = frameCount;
            frameCount = 0;
            lastTime = currentTime;
        }
        return fps;
    }

    copyButton.addEventListener('click', () => {
        const cameraInfo = {
            position: camera.position.toArray(),
            rotation: camera.rotation.toArray(),
            target: controls.target.toArray()
        };
        navigator.clipboard.writeText(JSON.stringify(cameraInfo, null, 2));

        copyButton.textContent = '✓ Copied!';
        setTimeout(() => {
            copyButton.textContent = '📸 Copy Camera';
        }, 1000);
    });

    function update(data) {
        const currentFPS = updateFPS();

        infoContainer.innerHTML = `
        <div class="info-row">FPS: ${currentFPS}</div>
        <div class="info-header">CAMERA</div>
        <div class="info-row">Position: ${vectorToString(data.camera.position)}</div>
        <div class="info-row">Rotation: ${vectorToString(data.camera.rotation)}</div>
        <div class="info-row">Target: ${vectorToString(data.target || new THREE.Vector3())}</div>
        
        <div class="info-header">LIGHTING</div>
        <div class="info-row">Sun Color: ${data.lighting.sunLight.color.getHexString()}</div>
        <div class="info-row">Sun Intensity: ${data.lighting.sunLight.intensity.toFixed(2)}</div>
        <div class="info-row">Ambient Intensity: ${data.lighting.ambientLight.intensity.toFixed(2)}</div>
        
        <div class="info-header">PERFORMANCE</div>
        <div class="info-row">Delta Time: ${(data.deltaTime * 1000).toFixed(2)}ms</div>
        <div class="info-row">Draw Calls: ${data.renderer.info.render.calls}</div>
        <div class="info-row">Triangles: ${data.renderer.info.render.triangles}</div>
    `;
    }

    function toggle(enabled) {
        const debugContainer = document.getElementById('debug-container');
        if (debugContainer) {
            debugContainer.style.display = enabled ? 'block' : 'none';
            controls.enabled = enabled;
        }
    }


    return {
        update,
        toggle,
        controls
    };
}
