import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  ssr: false,

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
    '~/plugins/primevue.ts',
    '~/plugins/auth-dialog.ts',
    '~/plugins/event-bus.ts'
  ],

  compatibilityDate: '2024-12-04',

  nitro: {
    preset: 'vercel',
    prerender: {
      crawlLinks: false,
      routes: []
    }
  },

  vite: {
    optimizeDeps: {
      exclude: ['fsevents'],
      include: ['@rollup/rollup-wasm']
    },
    build: {
      rollupOptions: {
        external: ['@rollup/rollup-linux-x64-gnu']
      }
    }
  },

  runtimeConfig: {
    // 私有配置（僅在伺服器端可用）
    sessionSecret: process.env.SESSION_SECRET,
    // 為了純靜態生成，暫時註釋掉數據庫配置
    /*
    mongodb: {
      uri: process.env.MONGODB_URI
    },
    */
    
    // 公開配置（客戶端和伺服器端都可用）
    public: {
      apiBase: '/api' // 如果API路由也依賴數據庫，可能也需要調整
    }
  }
})