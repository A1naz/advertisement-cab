<script setup lang="ts">
import { useNotification } from '@kyvg/vue3-notification'

const userStore = useUserStore()
const client = userStore.client

const { notify } = useNotification()
async function saveChanges() {
  notify({ type: 'success', title: 'Успешно', text: 'Профиль обновлен' })
}
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
})
definePageMeta({
  title: 'Профиль',
  auth: true,
  layout: 'app',
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <h2 class="">
          Настройки аккаунта
        </h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="client.email"
          label="Email"
          type="email"
        />
      </v-col>
      <v-col>
        <v-text-field
          v-model="client.firstName"
          label="Имя"
          type="text"
        />
      </v-col>
      <v-col>
        <v-text-field
          v-model="client.lastName"
          label="Фамилия"
          type="text"
        />
      </v-col>
    </v-row>
    <v-row justify="end">
      <v-col cols="12" lg="3">
        <v-btn block @click="saveChanges">
          Сохранить
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="mt-6">
      <v-col>
        <h2>Смена пароля</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="6">
        <v-text-field
          v-model="passwordForm.oldPassword"
          label="Старый пароль"
          type="password"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <v-text-field
          v-model="passwordForm.newPassword"
          label="Новый пароль"
          type="password"
        />
      </v-col>
    </v-row>
    <v-row justify="end">
      <v-col cols="12" lg="3">
        <v-btn block @click="saveChanges">
          Изменить
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>
