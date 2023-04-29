<script setup lang="ts">
definePageMeta({
  auth: false,
  title: 'Сброс пароля',
})
const route = useRoute()
const token = route.params.token
const passwordForm = reactive({
  newPassword: '',
  newPasswordRepeat: '',
})
</script>

<template>
  <v-container class="h-100">
    <div class="d-flex align-center h-100">
      <v-row items="center">
        <v-col><h2>Сброс пароля</h2></v-col>
        <v-col cols="12">
          <v-text-field
            v-model="passwordForm.newPassword"
            label="Новый пароль"
            type="password"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="passwordForm.newPasswordRepeat"
            label="Новый пароль еще раз"
            type="password"
          />
        </v-col>
        <v-col class="ms-auto" cols="12" lg="3">
          <v-btn block>
            Изменить
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<style scoped>

</style>
