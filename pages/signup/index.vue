<script setup>
import { useNotification } from '@kyvg/vue3-notification'

definePageMeta({
  auth: {
    unAuthenticatedOnly: true,
    navigateAuthenticatedTo: '/profile',
  },
  title: 'Регистрация',
})
const { $client } = useNuxtApp()

const name = ref('')
const email = ref('')
const password = ref('')
const { ruleEmail, rulePassLen, ruleRequired } = useFormRules()
const { notify } = useNotification()
async function submit() {
  if (ruleEmail(email.value) !== true || rulePassLen(password.value) !== true || ruleRequired(name.value) !== true)
    return

  const { data, error } = await useAsyncData(() => $client.auth.register.mutate({
    username: name.value,
    email: email.value,
    password: password.value,
  }))
  if (error.value) {
    notify({
      type: 'error',
      title: 'Ошибка',
      text: error.value.message,
    })
  }
  if (data.value) {
    notify({
      type: 'success',
      title: 'Пользователь успешно зарегистрирован',
      text: 'Для активации аккаунта перейдите по ссылке в письме.',
    })
  }
}
</script>

<template>
  <VContainer fluid class="fill-height">
    <VRow no-gutters align="center" justify="center" class="fill-height">
      <VCol cols="12" md="6" lg="5" sm="6">
        <VRow no-gutters align="center" justify="center">
          <VCol cols="12" md="6">
            <h1>Регистрация</h1>

            <VForm class="mt-7" @submit.prevent="submit">
              <div>
                <label class="label text-grey-darken-2" for="name">Имя</label>
                <VTextField
                  id="name"
                  v-model="name"
                  :rules="[ruleRequired]"
                  prepend-inner-icon="fluent:person-24-regular"
                  name="name"
                />
              </div>
              <div class="mt-1">
                <label class="label text-grey-darken-2" for="email">Email</label>
                <VTextField
                  id="email"
                  v-model="email"
                  :rules="[ruleRequired, ruleEmail]"
                  type="email"
                  prepend-inner-icon="fluent:mail-24-regular"
                  name="email"
                />
              </div>
              <div class="mt-1">
                <label class="label text-grey-darken-2" for="password">Пароль</label>
                <VTextField
                  id="password"
                  v-model="password"
                  :rules="[ruleRequired, rulePassLen]"
                  type="password"
                  prepend-inner-icon="fluent:password-20-regular"
                  name="password"
                />
              </div>
              <div class="mt-5">
                <VBtn type="submit" block min-height="45" class="gradient bg-primary">
                  Создать аккаунт
                </VBtn>
              </div>
            </VForm>
            <p class="text-body-2 mt-10">
              <span>Уже зарегистрированы?
                <NuxtLink to="/" class="font-weight-bold text-primary">Войти</NuxtLink></span>
            </p>
          </VCol>
        </VRow>
      </VCol>
      <VCol class="hidden-md-and-down fill-height" md="6" lg="7">
        <VImg
          src="https://wallpaper.dog/large/5557744.jpg"
          cover
          class="h-100 rounded-xl d-flex align-center justify-center"
        >
          <div class="text-center w-50 text-white mx-auto">
            <h2 class="mb-4">
              Start your journey today
            </h2>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Asperiores, inventore quia.
              Dolorum dolores ad ipsum voluptatum rem, hic placeat, odio, odit numquam quod
              veritatis accusantium assumenda! Sequi, provident in! Iure!
            </p>
          </div>
        </VImg>
      </VCol>
    </VRow>
  </VContainer>
</template>
