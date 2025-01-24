import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],

  imports: {
    dirs: ['stores']
  },

  css: [
    '@/assets/css/main.css',
    '@/assets/css/primevue.css',
    'primeicons/primeicons.css'
  ],

  build: {
    transpile: ['primevue']
  },

  plugins: [
    '~/plugins/primevue.ts'
  ],

  compatibilityDate: '2024-12-04'
})