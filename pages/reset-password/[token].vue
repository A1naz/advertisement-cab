<script setup lang="ts">
import { helpers, minLength, required, sameAs } from '@vuelidate/validators'

definePageMeta({
  auth: false,
  title: 'Сброс пароля',
})
const loading = ref(false)
const route = useRoute()
const { token } = route.params

const newPassword = ref('')
const passwordRepeat = ref('')
const { $client } = useNuxtApp()
const rules = {
  newPassword: {
    required: helpers.withMessage('Введите пароль', required),
    minLength: helpers.withMessage(
      'Пароль должен быть длиннее 6 символов',
      minLength(6),
    ),
  },
  passwordRepeat: {
    required: helpers.withMessage('Повторите пароль', required),
    sameAs: helpers.withMessage(
      'Пароли должны совпадать',
      sameAs(newPassword),
    ),
    $lazy: true,
  },
}

const v$ = useVuelidate(rules, { newPassword, passwordRepeat })
async function submit() {
  loading.value = true
  const valid = await v$.value.$validate()
  if (!token || !valid)
    return
  const { data, error } = await useAsyncData(() => $client.auth.resetPassword.mutate({
    password: newPassword.value,
    repeatPassword: passwordRepeat.value,
    token: token.toString(),
  }))
  loading.value = false
  if (data.value) {
    notify({
      type: 'success',
      text: 'Пароль успешно изменен',
    })
    navigateTo('/')
  }
  if (error.value) {
    notify({
      type: 'error',
      title: 'Ошибка',
      text: error.value.message,
    })
  }
}
</script>

<template>
  <v-container class="h-100">
    <div class="d-flex align-center h-100 ma-auto">
      <v-row class="align-center w-100 justify-center">
        <v-col><h2>Сброс пароля</h2></v-col>
        <v-col cols="12">
          <v-text-field
            v-model="newPassword"
            :error-messages="v$.newPassword.$errors.map(e => e.$message)"
            label="Новый пароль"
            type="password"
            @update:model-value="v$.newPassword.$touch"
            @blur="v$.newPassword.$touch"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="passwordRepeat"
            :error-messages="v$.passwordRepeat.$errors.map(e => e.$message)"
            label="Новый пароль еще раз"
            type="password"
            @update:model-value="v$.passwordRepeat.$touch"
            @blur="v$.passwordRepeat.$touch"
          />
        </v-col>
        <v-col class="ms-auto" cols="12" lg="3">
          <v-btn block @click="submit">
            Сохранить
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<style scoped>

</style>
