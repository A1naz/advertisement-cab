<script setup lang="ts">
import { useTheme } from "vuetify";
import { useScrollLock } from "@vueuse/core";
const { signOut } = useAuth();
const { width, height } = useWindowSize();
const name = useRuntimeConfig().public.NAME;
const drawer = ref(false);
const appbar = ref(width.value < 1280);
const theme = useTheme();
drawer.value = width.value > 1680;
const dialog = ref(true);
const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
  localStorage.setItem("theme", theme.global.name.value);
};

onMounted(() => {
  theme.global.name.value = localStorage.getItem("theme") || "light";
});
``;
</script>

<template>
  <VApp>
    <v-navigation-drawer
      style="position: fixed"
      v-model="drawer"
      app
      fixed
      left
      location="left"
      width="230"
    >
      <v-list density="compact" nav>
        <v-divider></v-divider>
        <v-list-item
          prepend-icon="mdi-account"
          title="Профиль"
          value="profile"
          :active="$route.path === '/profile'"
          active-color="primary"
          to="/profile"
        />

        <v-list-item
          prepend-icon="mdi-briefcase "
          title="Рекламные кампании"
          value="advertisement"
          :active="$route.path === '/cabinet'"
          active-color="primary"
          to="/cabinet"
        />

        <v-list-item
          prepend-icon="mdi-trending-up "
          title="Проверка ставок"
          value="betStats"
          :active="$route.path === '/actualstats'"
          active-color="primary"
          to="/actualstats"
        />
      </v-list>
    </v-navigation-drawer>
    <v-app-bar density="compact" primary>
      <template #prepend>
        <v-app-bar-nav-icon @click="drawer = !drawer" />
      </template>
    </v-app-bar>
    <VMain>
      <slot />
    </VMain>
  </VApp>
</template>
