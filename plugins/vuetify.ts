import { createVuetify } from 'vuetify'
import { md3 } from 'vuetify/blueprints'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: true,
    defaults,
    // add theme
    blueprint: md3,
    theme: {
      defaultTheme: LIGHT_THEME,
      themes: {
        light,
        dark,
      },
      // add color variations
      //   variations: {
      //     colors: ["primary", "secondary"],
      //     lighten: 3,
      //     darken: 3,
      //   },
    },
    // Add the custom iconset
    icons: {
      defaultSet: 'custom',
      aliases,
      sets: {
        custom,
      },
    },
  })

  app.vueApp.use(vuetify)
})
