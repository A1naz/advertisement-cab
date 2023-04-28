<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import { useVuelidate } from '@vuelidate/core';
import {
  email,
  helpers,
  minLength,
  required,
  sameAs,
} from '@vuelidate/validators';

const dataReactive = reactive({
  login: '',
  password: {
    password: '',
    repeatPassword: '',
  },
});

const rules = computed(() => {
  return {
    login: {
      required: helpers.withMessage('Введите email', required),
      email: helpers.withMessage('Введите корректный email', email),
    },
    password: {
      password: {
        required: helpers.withMessage('Введите пароль', required),
        minLength: helpers.withMessage(
          'Пароль должен быть длиннее 6 символов',
          minLength(6)
        ),
      },
      repeatPassword: {
        required: helpers.withMessage('Введите пароль', required),
        sameAs: helpers.withMessage(
          'Пароли не совпадают',
          sameAs(dataReactive.password.password)
        ),
      },
    },
  };
});
const toast = useToast();
const show = (severity: any, summary: any, detail: any) => {
  toast.add({
    severity: severity,
    summary: summary,
    detail: detail,
    life: 3000,
  });
};

const loading = ref(false);

async function register() {
  const result = await v$.value.$validate();

  if (result) {
    try {
      const data = await $fetch('/api/users/register', {
        method: 'POST',
        body: {
          email: dataReactive.login,
          password: dataReactive.password.password,
          repeatPassword: dataReactive.password.repeatPassword,
        },
      });
      if (data) {
        show('success', 'Письмо подтверждения отправлено на ваш email', '');
      }
      if (data === 'error') {
        show('error', 'Пользователь с таким email уже существует', '');
      }
    } catch (error) {
      show('error', 'Пользователь с таким email уже существует', '');
    }
  }
}

const v$ = useVuelidate(rules, dataReactive);
</script>

<template>
  <Toast />
  <div class="flex flex-col items-center justify-center px-0 py-12">
    <form
      class="registration-form flex flex-col justify-center items-center max-w-3xl w-128 p-12 shadow-xl rounded-xl mt-7"
    >
      <h3 class="text-center text-xl font-bold mb-3">Регистрация</h3>
      <div class="data-input flex flex-col w-64 mb-3">
        <span class="p-float-label flex flex-col">
          <InputText
            id="email"
            class="my-1"
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
      <div class="data-input flex flex-col w-64 mb-3">
        <span class="p-float-label flex flex-col">
          <InputText
            id="password"
            class="my-1"
            type="password"
            v-model="dataReactive.password.password"
            :class="{
              'p-invalid': v$.password.password.$error,
            }"
          />
          <label for="password" class="text-l">Пароль</label>
        </span>
        <small class="p-error" id="text-error">{{
          v$.password.password.$errors[0]?.$message || '&nbsp;'
        }}</small>
      </div>
      <div class="data-input flex flex-col w-64 mb-3">
        <span class="p-float-label flex flex-col">
          <InputText
            id="repeatpassword"
            type="password"
            class="my-1"
            v-model="dataReactive.password.repeatPassword"
            :class="{
              'p-invalid': v$.password.repeatPassword.$error,
            }"
          />
          <label for="repeatpassword" class="text-l">Повторите пароль</label>
        </span>
        <small class="p-error" id="text-error">{{
          v$.password.repeatPassword.$errors[0]?.$message || '&nbsp;'
        }}</small>
      </div>
      <div class="reg-btn flex flex-column w-56">
        <Button
          class="mt-3 px-14"
          label="Регистрация"
          severity="info"
          @click="register"
        />
      </div>
      <div class="text-l mt-4 flex flex-row">
        <p>Уже есть аккаунт?&nbsp;</p>
        <a href="/auth" class="underline">Авторизация тут</a>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
// .registration-cssave form h3 {
//   font-weight: bold;
//   margin-bottom: 30px;
// }

@media (max-width: 576px) {
  .registration-form {
    display: block;
    width: 100%;
    padding: 2rem;
  }

  .data-input {
    width: 100%;
  }

  .reg-btn {
    width: 100;
  }
}
</style>
