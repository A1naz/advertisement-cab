import vuetify from 'vite-plugin-vuetify'

// PWA Config
const title = process.env.NAME
const shortTitle = process.env.NAME
const description
  = 'Рекламный кабинет Wildberries'
const image = 'https://i.imgur.com/TuGniGD.png'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  // import styles
  css: ['@/assets/main.scss'],
  // enable takeover mode
  typescript: { shim: false },
  build: { transpile: ['vuetify', 'trpc-nuxt'] },
  modules: [
    '@kevinmarrec/nuxt-pwa',
    '@sidebase/nuxt-auth',
    '@pinia/nuxt',
    '@vueuse/nuxt',

    async (options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', config =>
        // @ts-expect-error some
        config.plugins.push(vuetify()),
      )
    },
  ],
  nitro: {
    plugins: ['~/server/index.ts'],
  },
  auth: {
    origin: process.env.PUBLIC_SITE_URL,
    enableGlobalAppMiddleware: true,
  },
  ssr: true,
  extends: [
    'nuxt-seo-kit',
  ],
  runtimeConfig: {
    public: {
      NAME: process.env.NAME,
      titleSeparator: '|',
      siteName: process.env.NAME,
      trailingSlash: true,
      siteDescription: 'Рекламный кабинет Wildberries',
      language: 'ru',
      PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL,
    },
    MONGO_URI: process.env.MONGO_URI,
    SECRET: process.env.SECRET,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    smtpPass: process.env.smtpPass,
    smtpPort: process.env.smtpPort,
    smtpUser: process.env.smtpUser,
    smtpHost: process.env.smtpHost,
  },
  app: {
    pageTransition: { name: 'fade', mode: 'out-in' },
    layoutTransition: {
      name: 'slide',
      mode: 'out-in',
    },
    head: {
      title: process.env.NAME,
      titleTemplate: '%pageTitle %titleSeparator %siteName',

      link: [
        { rel: 'stylesheet', href: 'https://rsms.me/inter/inter.css' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: process.env.PUBLIC_SITE_URL },
      ],
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
        { property: 'og:site_name', content: title },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        {
          hid: 'og:url',
          property: 'og:url',
          content: process.env.PUBLIC_SITE_URL,
        },
        {
          hid: 'og:image:secure_url',
          property: 'og:image:secure_url',
          content: image,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: image,
        },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        {
          hid: 'twitter:url',
          name: 'twitter:url',
          content: process.env.PUBLIC_SITE_URL,
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: title,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: description,
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: image,
        },
      ],
    },
  },

  pwa: {
    meta: {
      name: shortTitle,
      author: 'Behon Baker',
      theme_color: '#4f46e5',
      description,
    },
    manifest: {
      name: shortTitle,
      short_name: shortTitle,
      theme_color: '#4f46e5',
      description,
    },
  },
})
