// 1) Crea un LoadingManager
const manager = new THREE.LoadingManager();

// Questi callback servono se vuoi aggiungere una barra di progresso
manager.onStart = (url, itemsLoaded, itemsTotal) => {
    console.log(`Inizio caricamento: ${url}`);
};
manager.onLoad = () => {
    console.log('Tutti i file caricati!');
};
manager.onProgress = (url, itemsLoaded, itemsTotal) => {
    console.log(`Caricamento file: ${url} (${itemsLoaded} / ${itemsTotal})`);
};
manager.onError = (url) => {
    console.log('Errore nel caricamento di', url);
};

// 2) Crea un TextureLoader che utilizza il manager
const textureLoader = new THREE.TextureLoader(manager);

// 3) Carica le texture necessarie
const diffuseMap = textureLoader.load('/models/Cattedrale_decimata_u0_v0_diffuse.png');
const normalMap = textureLoader.load('/models/Cattedrale_decimata_u0_v0_normal.png');

// 4) Una volta che TUTTI i file passati al manager sono caricati, manager.onLoad verrà chiamato.
//    A quel punto puoi caricare il modello FBX sapendo che le texture sono già disponibili.
manager.onLoad = () => {
    const loader = new FBXLoader();
    loader.load(
        'https://demo-skycrab.s3.eu-north-1.amazonaws.com/Cattedrale_decimata.fbx', // Nuovo URL su S3
        (fbx) => {
            model = fbx;
            model.traverse((child) => {
                if (child.isMesh) {
                    if (!child.geometry.hasAttribute('normal')) {
                        child.geometry.computeVertexNormals();
                    }

                    child.material = new THREE.MeshStandardMaterial({
                        map: diffuseMap,
                        normalMap: normalMap,
                        roughness: 0.7,
                        metalness: 0.0,
                        transparent: true,   // abilita la trasparenza
                        opacity: 0           // inizia invisibile
                    });

                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            scene.add(model);
            resolve();

            // Avvia il fade-in del modello dopo un breve ritardo
            fadeInModel(model, 2000); // 2 secondi per il fade-in
        },
        undefined,
        (error) => {
            console.error('Errore durante il caricamento dell’FBX:', error);
            reject(error);
        }
    );
};