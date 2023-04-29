<script setup lang="ts">
const { signOut } = useAuth()
</script>

<template>
  <div>
    <VApp>
      <v-navigation-drawer
        permanent
        :mini-variant="true"
        location="left"
      >
        <template #prepend>
          <v-list-item
            lines="two"
            prepend-avatar="https://randomuser.me/api/portraits/women/81.jpg"
            title="Jane Smith"
            subtitle="Logged in"
          />
        </template>

        <v-divider />

        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-home-city" title="Home" value="home" active-color="primary" />
          <v-list-item prepend-icon="mdi-account" title="My Account" value="account" active-color="primary" />
          <v-list-item prepend-icon="mdi-account-group-outline" title="Users" value="users" active-color="primary" />
        </v-list>
        <template #append>
          <div class="pa-2">
            <v-btn prepend-icon="mdi-logout" title="Выйти" value="logout" active-color="primary" block class="mt-auto" @click="signOut">
              Выйти
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
      <VMain>
        <slot />
      </VMain>
    </VApp>
  </div>
</template>
