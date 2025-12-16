import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src')
        }
    },
    logLevel: 'info',
    publicDir: 'public',
    base: './',
    build: {
        assetsDir: 'assets',
        manifest: true,
        rollupOptions: {
            output: {
                // Configure asset file names
                assetFileNames: (assetInfo) => {
                    const info = assetInfo.names[0].split('.')
                    const extType = info[info.length - 1]

                    if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
                        return `assets/images/[name]-[hash][extname]`
                    }

                    if (/css/i.test(extType)) {
                        return `assets/css/[name]-[hash][extname]`
                    }

                    return `assets/[name]-[hash][extname]`
                },
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js'
            }
        },
        emptyOutDir: true,
        sourcemap: false
    },
    server: {
        port: 3000,
        open: true
    },
    preview: {
        port: 8080
    }
})