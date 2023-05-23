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

const LKColor = computed(() => {
  if (theme.global.name.value == "myCustomLightTheme") {
    return "gray";
  } else {
    return "white";
  }
});
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
          <v-card @click="$router.push('/profile')">
            <v-card-item>
              <div class="text-center flex justify-between">
                <div class="mt-3 mx-2 text-sm">Личный кабинет</div>
                <v-btn
                  variant="tonal"
                  :active="$route.path === '/profile'"
                  icon="mdi-account"
                  rounded="xl"
                  :color="LKColor"
                />
              </div>
            </v-card-item>

            <v-card-actions class="flex justify-center">
              <v-btn
                @click.stop
                @click="console.log('sdsd')"
                size="x-small"
                block
                :color="LKColor"
                variant="tonal"
              >
                Текущий тариф
              </v-btn>
            </v-card-actions>
          </v-card>

          <v-divider class="mb-2"></v-divider>
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
