import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    resolve: {
        extensions: ['.js', '.jsx']
    },
    build: {
        assetsInlineLimit: 0, // Disabilita l'inlining delle risorse
        rollupOptions: {
            output: {
                assetFileNames: '[name].[ext]', // Mantieni i nomi dei file
            },
        },
    },
    server: {
        host: '0.0.0.0', // Permette l'accesso da qualsiasi IP nella rete locale
        port: 3000, // Specifica la porta da usare
        strictPort: true, // Fallisce se la porta è occupata
        open: false, // Evita di aprire automaticamente il browser
    },
});