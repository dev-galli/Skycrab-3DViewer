import { defineConfig } from 'vite';

export default defineConfig({
    root: '.', // Specifica la cartella radice
    build: {
        outDir: 'dist', // Cartella di output
        assetsDir: 'assets' // Cartella per JS/CSS/immagini
    },
    server: {
        port: 3000 // Cambia la porta se necessario
    }
});