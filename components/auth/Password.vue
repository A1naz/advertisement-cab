<script setup lang="ts">
import { useToast } from 'primevue/usetoast';

const email = ref('');
const password = ref('');
const repeatPassword = ref('');

const toast = useToast();
const show = () => {
  toast.add({
    severity: 'success',
    summary: 'status',
    detail: 'Письмо смены пароля отправлено',
    life: 3000,
  });
};

const dataReactive = reactive({
  loading: false,
});

async function resetPassword() {
    show()
}
</script>

<template>
  <Toast />
  <div class="flex flex-col items-center justify-center px-0 py-12">
    <form
      class="registration-form flex flex-col justify-center items-center max-w-3xl w-128 p-12 shadow-xl rounded-xl mt-7"
    >
      <h3 class="text-center text-xl font-bold mb-4">Смена пароля</h3>
      <div class="data-input flex flex-col w-64 mb-4">
        <span class="p-float-label flex flex-col">
          <InputText id="username" class="my-1" v-model="email" />
          <label for="username" class="text-l">Email</label>
        </span>
      </div>
      <div class="data-input flex flex-col w-64 mb-4">
        <span class="p-float-label flex flex-col">
          <InputText
            id="username"
            class="my-1"
            type="password"
            v-model="password"
          />
          <label for="username" class="text-l">Пароль</label>
        </span>
      </div>
      <div class="data-input flex flex-col w-64 mb-4">
        <span class="p-float-label flex flex-col">
          <InputText
            id="username"
            type="password"
            class="my-1"
            v-model="repeatPassword"
          />
          <label for="username" class="text-l">Повторите пароль</label>
        </span>
      </div>
      <div class="reg-btn flex flex-column w-56">
        <Button
          class="mt-3 px-14"
          label="Смена пароля"
          severity="info"
          @click="resetPassword"
        />
      </div>
      <div class="text-l mt-4 flex flex-row">
        <p>Вспомнили пароль?&nbsp;</p>
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
