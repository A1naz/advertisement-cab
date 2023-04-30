<script setup lang="ts">
const { signOut } = useAuth();
const { width, height } = useWindowSize();
const name = useRuntimeConfig().public.NAME;
const drawer = ref(false);
const appbar = ref(width.value < 1280);
drawer.value = width.value > 1280;
</script>

<template>
  <div>
    <VApp>
      <v-navigation-drawer v-model="drawer" location="left">
        <template #prepend />

        <v-list density="compact" class="h-auto d-flex flex-column" nav>
          <v-list-item
            prepend-icon="mdi-account"
            title="Профиль"
            value="profile"
            :active="$route.path === '/profile'"
            active-color="primary"
          />
        </v-list>
      </v-navigation-drawer>
      <v-app-bar density="compact" primary>
        <template #prepend>
          <v-app-bar-nav-icon @click="drawer = !drawer" />
        </template>
        <v-app-bar-title>{{ name }}</v-app-bar-title>
        <template #append>
          <v-btn prepend-icon="fluent:sign-out-24-filled" @click="signOut"> Выйти </v-btn>
        </template>
      </v-app-bar>
      <VMain>
        <slot />
      </VMain>
    </VApp>
  </div>
</template>
