<script setup lang="ts">
import { reactive } from 'vue'
import { useDialog } from '../DialogProvider'
import { useLoadingOverlay } from '../LoadingOverlayProvider'

const dialog = useDialog()
const overlay = useLoadingOverlay()
const menu = reactive(
  [
    { icon: 'mdi-account-box-outline', key: 'menu.profile', link: '/apps/manager-user/edit' },
    { icon: 'mdi-format-list-checkbox', key: 'menu.todo', link: '/apps/todo' },
    { icon: 'mdi-email-outline', key: 'menu.board', link: '/apps/board' },
    { icon: 'mdi-forum-outline', key: 'menu.chat', link: '/apps/chat-channel/' },
  ],
)

const auth = useAuth()

function logout() {
  dialog.show({
    title: 'Logo out',
    main: 'Are you sure logo out?',
    confirm: () => {
      overlay.show()
      setTimeout(() => {
        auth.signOut()
      }, 1000)
    },

  })
}
</script>

<template>
  <v-menu offset-y location="left" transition="slide-y-transition">
    <template #activator="{ props }">
      <v-btn icon size="small" class="elevation-2" v-bind="props">
        <v-badge
          color="success"
          dot
          bordered
        >
          <v-avatar size="40" class="bg-grey" />
        </v-badge>
      </v-btn>
    </template>

    <!-- user menu list -->
    <v-list density="compact" nav>
      <v-list-item
        v-for="(item, index) in menu"
        :key="index"
        :to="item.link"
        link
      >
        <template #prepend>
          <v-icon size="small" :icon="item.icon" />
        </template>
        <v-list-item-title>{{ item.key }}</v-list-item-title>
      </v-list-item>

      <v-divider class="my-1" />

      <v-list-item prepend-icon="fluent:sign-out-24-filled" title="Выйти" @click="logout" />
    </v-list>
  </v-menu>
</template>
