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
  theme.global.name.value = theme.global.current.value.dark
    ? "myCustomLightTheme"
    : "myCustomDarkTheme";
  localStorage.setItem("theme", theme.global.name.value);
};

onMounted(() => {
  theme.global.name.value = localStorage.getItem("theme") || "myCustomLightTheme";
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
      <div class="flex flex-col">
        <v-list density="compact" nav>
          <v-divider></v-divider>
          <v-list-item
            prepend-icon="mdi-account"
            title="Личный кабинет"
            value="profile"
            :active="$route.path === '/profile'"
            active-color="primary"
            to="/profile"
          >
            <div @click.stop>
              <v-btn @click.stop density="compact" class="text-xs">Текущий тариф</v-btn>
            </div>
          </v-list-item>
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
      </div>
    </v-navigation-drawer>
    <v-app-bar density="compact" primary>
      <template #prepend>
        <v-app-bar-nav-icon @click="drawer = !drawer" />
      </template>
      <v-app-bar-title>{{ name }}</v-app-bar-title>
      <template #append>
        <v-btn @click="toggleTheme" icon="mdi-theme-light-dark "></v-btn>
        <v-btn prepend-icon="fluent:sign-out-24-filled" @click="signOut"> Выйти </v-btn>
      </template>
    </v-app-bar>
    <VMain>
      <slot />
    </VMain>
  </VApp>
</template>
