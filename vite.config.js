import { defineConfig } from 'vite';

export default defineConfig({
    base: '/', // Base del progetto
    build: {
        rollupOptions: {
            input: './index.html', // Punto di ingresso del progetto
        },
    },
    server: {
        port: 3000,
    },
});