import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
    root: path.resolve(__dirname, 'src'),
    server: {
        port: 8000,
        hot: true,
    },
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            'bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
            'hammerjs': path.resolve(__dirname, 'node_modules/hammerjs'),
            'showdown': path.resolve(__dirname, 'node_modules/showdown'),
            '@capacitor/core': path.resolve(__dirname, 'node_modules/@capacitor/core'),
        }
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return id.toString().split('node_modules/')[1].split('/')[0].toString();
                    }
                }
            }
        }
    }
})
