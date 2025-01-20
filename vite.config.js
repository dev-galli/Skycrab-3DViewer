import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        port: 3000,
    },
    base: './',
    publicDir: 'models', // Assicura che la directory 'models/' venga servita
});