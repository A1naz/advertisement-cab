<script setup lang="ts">
const email = ref('')

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/profile',
  },
  title: 'Восстановление пароля',
})
const loading = ref(false)
const disabled = ref(false)
const { $client } = useNuxtApp()
const { ruleEmail, ruleRequired } = useFormRules()
async function submit() {
  if (ruleEmail(email.value) !== true)
    return
  loading.value = true
  const { data, error } = await useAsyncData(() => $client.auth.sendResetPasswordMail.mutate({
    email: email.value,
  }))
  if (data.value) {
    notify({
      type: 'success',
      text: 'Инструкции были отправлены на ваш email',
    })
    disabled.value = true
  }
  if (error.value) {
    notify({
      type: 'error',
      title: 'Ошибка',
      text: error.value.message[0],
    })
  }
  loading.value = false
}
</script>

<template>
  <VContainer fluid class="fill-height">
    <VRow no-gutters align="center" justify="center" class="fill-height">
      <VCol cols="12" md="6" lg="5" sm="6">
        <VRow no-gutters align="center" justify="center">
          <VCol cols="12" md="6">
            <h1>Восстановление пароля</h1>

            <VForm class="mt-7" @submit.prevent="submit">
              <div class="mt-1">
                <label class="label text-grey-darken-2" for="email">Email</label>
                <VTextField
                  id="email"
                  v-model="email"
                  :rules="[ruleRequired, ruleEmail]"
                  prepend-inner-icon="fluent:mail-24-regular"
                  name="email"
                  type="email"
                />
              </div>
              <div class="mt-5">
                <VBtn :disabled="disabled" :loading="loading" type="submit" block min-height="44" class="gradient bg-primary">
                  Отправить инструкции
                </VBtn>
              </div>
            </VForm>
            <p class="text-body-2 mt-10">
              <span>Вспомнили пароль?
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
