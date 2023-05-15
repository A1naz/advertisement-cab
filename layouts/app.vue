<script setup lang="ts">
import { useTheme } from "vuetify";
const { signOut } = useAuth();
const { width, height } = useWindowSize();
const name = useRuntimeConfig().public.NAME;
const drawer = ref(false);
const appbar = ref(width.value < 1280);
const theme = useTheme();
drawer.value = width.value > 1680;

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
  <div>
    <VApp>
      <v-navigation-drawer
      primary
        :absolute="true"
        v-model="drawer"
        location="left"
        :rail="false"
        width="250"
        >
        <template #prepend />

          <v-list density="compact" class="h-auto d-flex flex-column" absolute nav>
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
            <!-- <v-list-item
              prepend-icon="mdi-briefcase "
              title="Статистика"
              value="advertisement"
              :active="$route.path === '/cabinet'"
              active-color="primary"
              to="/cabinet"
            /> -->
          </v-list>

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
  </div>
</template>
