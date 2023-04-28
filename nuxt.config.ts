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
    origin: process.env.AUTH_ORIGIN,
  },
  ssr: false,
  runtimeConfig: {
    mongoDbUri: process.env.MONGO_URI,
    SECRET: process.env.SECRET,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  },
  app: {
    pageTransition: { name: 'fade', mode: 'out-in' },
    layoutTransition: {
      name: 'slide',
      mode: 'out-in',
    },
  },
});
