const progressText = document.getElementById('progress-text');
const loadingScreen = document.getElementById('loading-screen');

// 1) Crea un LoadingManager
const manager = new THREE.LoadingManager();

// Callback per monitorare il progresso del caricamento
manager.onStart = (url, itemsLoaded, itemsTotal) => {
    console.log(`Inizio caricamento: ${url}`);
    console.log(`File caricati: ${itemsLoaded}/${itemsTotal}`);
    progressText.textContent = 'Caricamento: 0%';
};

manager.onProgress = (url, itemsLoaded, itemsTotal) => {
    const percent = Math.round((itemsLoaded / itemsTotal) * 100);
    console.log(`Caricamento file: ${url} (${itemsLoaded} / ${itemsTotal})`);
    progressText.textContent = `Caricamento: ${percent}%`;
};

manager.onLoad = () => {
    console.log('Tutti i file caricati con successo!');
    progressText.textContent = 'Caricamento: 100%';

    // Nascondi il loading screen dopo un breve delay
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);
};

manager.onError = (url) => {
    console.error('Errore nel caricamento di:', url);
};

// Carica le risorse con il TextureLoader e il modello FBX come già definito

// 3) Crea un TextureLoader che utilizza il manager
const textureLoader = new THREE.TextureLoader(manager);

// Carica le texture necessarie
const diffuseMap = textureLoader.load(
    'https://demo-skycrab.s3.eu-north-1.amazonaws.com/low_Cattedrale_decimata_u0_v0_diffuse.png',
    () => console.log('Texture diffuseMap caricata con successo!'),
    undefined,
    (error) => console.error('Errore nel caricamento della diffuseMap:', error)
);

const normalMap = textureLoader.load(
    'https://demo-skycrab.s3.eu-north-1.amazonaws.com/low_Cattedrale_decimata_u0_v0_normal.png',
    () => console.log('Texture normalMap caricata con successo!'),
    undefined,
    (error) => console.error('Errore nel caricamento della normalMap:', error)
);

// 4) Una volta che tutte le risorse sono caricate, carica il modello FBX
manager.onLoad = () => {
    console.log('Tutte le texture sono state caricate, procedo con il modello FBX.');

    const loader = new FBXLoader();
    loader.load(
        'https://demo-skycrab.s3.eu-north-1.amazonaws.com/Cattedrale_decimata.fbx',
        (fbx) => {
            console.log('Modello FBX caricato con successo!');
            model = fbx;
            model.traverse((child) => {
                if (child.isMesh) {
                    console.log('Trovato un Mesh:', child.name);

                    if (!child.geometry.hasAttribute('normal')) {
                        child.geometry.computeVertexNormals();
                        console.log(`Normali calcolate per il mesh ${child.name}`);
                    }

                    child.material = new THREE.MeshStandardMaterial({
                        map: diffuseMap,
                        normalMap: normalMap,
                        roughness: 0.7,
                        metalness: 0.0,
                        transparent: true,
                        opacity: 0,
                    });

                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            scene.add(model);
            console.log('Modello aggiunto alla scena.');

            fadeInModel(model, 2000);
        },
        undefined,
        (error) => {
            console.error('Errore durante il caricamento dell’FBX:', error);
        }
    );
};

// Funzione per il fade-in del modello
function fadeInModel(model, duration) {
    const startOpacity = 0;
    const endOpacity = 1;
    const startTime = performance.now();

    function animate() {
        const elapsedTime = performance.now() - startTime;
        const t = Math.min(elapsedTime / duration, 1);
        const currentOpacity = startOpacity + (endOpacity - startOpacity) * t;

        model.traverse((child) => {
            if (child.isMesh && child.material) {
                child.material.opacity = currentOpacity;
                child.material.transparent = true;
            }
        });

        if (t < 1) {
            requestAnimationFrame(animate);
        } else {
            console.log('Fade-in completato.');
        }
    }

    animate();
}