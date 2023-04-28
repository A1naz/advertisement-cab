import { resolve } from 'path';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@sidebase/nuxt-auth', '@pinia/nuxt',],
  // alias: {
  //   '@': resolve(__dirname, '/'),
  // },
  css: [
    '~/assets/main.scss',
    'primevue/resources/themes/saga-blue/theme.css',
    'primevue/resources/primevue.css',
    'primeicons/primeicons.css',
    'primeflex/primeflex.css',
  ],
  build: {
    transpile: ['primevue'],
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  nitro: {
    plugins: ['~/server/index.ts'],
  },
  auth: {
    enableGlobalAppMiddleware: true,
    origin: 'http://localhost:3000',
  },
  ssr: false,
  runtimeConfig: {
    mongoDbUri: process.env.MONGO_URI,
    jwtAccessSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    SECRET: process.env.SECRET,
  },
  app: {
    pageTransition: { name: 'fade', mode: 'out-in' },
    layoutTransition: {
      name: 'slide',
      mode: 'out-in',
    },
  },
});
