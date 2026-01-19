// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  nitro: {
    preset: 'vercel'
  },
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@pinia/nuxt'],
  
  compatibilityDate: '2025-01-20',

  css: [
    '~/assets/main.css',
    '~/assets/base.css'
  ],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001'
    }
  },
  
  srcDir: 'src/',

  imports: {
    dirs: ['stores']
  }
})
