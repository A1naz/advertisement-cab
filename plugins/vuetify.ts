import { createVuetify, ThemeDefinition } from "vuetify";
import { md3 } from "vuetify/blueprints";

const myCustomLightTheme = {
  dark: false,
  colors: {
    background: '#f5f5f5',  
    surface: '#FFFFFF',
    primary: '#0155bd',
    'primary-darken-1': '#3700B3',
    secondary: '#03DAC6',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
}
const myCustomDarkTheme = {
  dark: true,
  colors: {
    background: '#322c4c', 
    surface: '#2d2845',
    primary: "#ae81fd",
    accent: "#312d4b",
    secondary: "#21dc79",
    success: "#38b062",
    info: "#2e8dd3",
    warning: "#57f000",
    error: "#FF5252"
  },
}

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: true,
    defaults,
    // add theme
    blueprint: md3,
    theme: {
      defaultTheme: 'myCustomDarkTheme',
      themes: {
        light,
        myCustomLightTheme,
        dark,
        myCustomDarkTheme
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
      defaultSet: "custom",
      aliases,
      sets: {
        custom,
      },
    },
  });


  app.vueApp.use(vuetify);
});
