<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import { useVuelidate } from '@vuelidate/core';
import { email, helpers, minLength, required } from '@vuelidate/validators';

const { status, data, signIn, signOut } = useAuth();

const toast = useToast();
const show = (severity: any, summary: string, detail: string) => {
  toast.add({
    severity: severity,
    summary: summary,
    detail: detail,
    life: 3000,
  });
};

const loading = ref(false);
const dataReactive = reactive({
  login: '',
  password: '',
});

const rules = {
  login: {
    required: helpers.withMessage('Введите email', required),
    email: helpers.withMessage('Введите корректный email', email),
  },
  password: {
    required: helpers.withMessage('Введите пароль', required),
    minLength: helpers.withMessage(
      'Пароль должен быть длиннее 6 символов',
      minLength(6)
    ),
  },
};

const v$ = useVuelidate(rules, dataReactive);

async function handleLogin() {
  const result = await v$.value.$validate();
  if (result) {
    loading.value = true;
    const { error, url } = await signIn('credentials', {
      redirect: false,
      callbackUrl: '/',
      email: dataReactive.login,
      password: dataReactive.password,
    });
    if (error) {
      show('error', 'Ошибка авторизации', 'Неправильный логин или пароль');
    } else {
      show('success', 'Успешный вход', '');
      return navigateTo(url, { external: true });
    }
    loading.value = false;
  }
}
</script>

<template>
  <Toast />
  <div class="flex flex-col items-center justify-center px-0 py-12">
    <form
      class="registration-form flex flex-col justify-center items-center w-128 p-12 shadow-xl rounded-xl mt-7"
    >
      <h3 class="text-center text-xl mb-4 font-bold w-full">Войти в аккаунт</h3>
      <div class="data-input flex flex-col w-64 mb-4">
        <span class="p-float-label flex flex-col">
          <InputText
            id="email"
            v-model="dataReactive.login"
            :class="{
              'p-invalid': v$.login.$error,
            }"
          />
          <label for="email" class="text-l">Email</label>
        </span>
        <small class="p-error" id="text-error">{{
          v$.login.$errors[0]?.$message || '&nbsp;'
        }}</small>
      </div>
      <div class="data-input flex flex-col w-64 mb-4">
        <span class="p-float-label flex flex-col">
          <InputText
            id="password"
            type="password"
            v-model="dataReactive.password"
            :class="{
              'p-invalid': v$.password.$error,
            }"
          />
          <label for="password" class="text-l">Пароль</label>
        </span>
        <small class="p-error" id="text-error">{{
          v$.password.$errors[0]?.$message || '&nbsp;'
        }}</small>
      </div>

      <div class="text-l flex flex-row justify-start">
        <a href="/resetpassword" class="underline">Забыли пароль?</a>
      </div>
      <div class="flex flex-column w-56">
        <Button
          class="mt-4 px-14 w-full"
          label="Войти"
          severity="info"
          @click="handleLogin"
        />
      </div>
      <div class="reg text-l mt-4 flex flex-col">
        <p>Еще не зарегистрированы?&nbsp;</p>
        <a href="/register" class="underline">Регистрация тут </a>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
@media (max-width: 576px) {
  .registration-form {
    display: block;
    width: 100%;
    padding: 2rem;
  }

  .data-input {
    width: 100%;
  }
  .reg {
    flex-direction: column;
  }
}
</style>
