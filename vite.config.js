import { defineConfig } from 'vite';

export default defineConfig({
    base: '/', // Base URL per il progetto
    server: {
        port: 3000, // Porta del server di sviluppo
    },
    build: {
        rollupOptions: {
            input: {
                main: './index.html', // Punto di ingresso principale
            },
        },
    },
    publicDir: 'models', // Servi la cartella `models` come risorse statiche
});