<script setup lang="ts">
import { useNotification } from "@kyvg/vue3-notification";

const userStore = useUserStore();
const client = userStore.client;
const { $client } = useNuxtApp();
const { ruleEmail, rulePassLen, ruleRequired } = useFormRules();
const { notify } = useNotification();

async function saveChanges() {
  const { data, error } = await useAsyncData(() =>
    $client.user.editProfile.mutate({
      email: client.email,
      firstName: client.firstName,
      lastName: client.lastName,
    })
  );

  if (error.value) {
    notify({
      type: "error",
      title: "Ошибка",
      text: error.value.message,
    });
  }

  if (data.value) {
    notify({ type: "success", title: "Успешно", text: "Профиль обновлен" });
  }
}

async function savePassword() {
  const { data, error } = await useAsyncData(() =>
    $client.user.editPassword.mutate({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
    })
  );

  if (error.value) {

    notify({
      type: "error",
      title: "Ошибка",
      text: error.value.message,
    });
  }
  if (data.value) {
    notify({ type: "success", title: "Успешно", text: "Пароль обновлен" });
  }
}

const passwordForm = reactive({
  oldPassword: "",
  newPassword: "",
});

const userForm = reactive({
  email: "",
  firstName: "",
  lastName: "",
});

definePageMeta({
  title: "Профиль",
  auth: true,
  layout: "app",
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <h2 class="">Настройки аккаунта</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-text-field
          :rules="[ruleRequired, ruleEmail]"
          v-model="client.email"
          label="Email"
          type="email"
        />
      </v-col>
      <v-col>
        <v-text-field :rules="[ruleRequired]" v-model="client.firstName" label="Имя" type="text" />
      </v-col>
      <v-col>
        <v-text-field
          :rules="[ruleRequired]"
          v-model="client.lastName"
          label="Фамилия"
          type="text"
        />
      </v-col>
    </v-row>
    <v-row justify="end">
      <v-col cols="12" lg="3">
        <v-btn block @click="saveChanges"> Сохранить </v-btn>
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
          :rules="[ruleRequired, rulePassLen]"
          v-model="passwordForm.oldPassword"
          label="Старый пароль"
          type="password"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <v-text-field
          :rules="[ruleRequired, rulePassLen]"
          v-model="passwordForm.newPassword"
          label="Новый пароль"
          type="password"
        />
      </v-col>
    </v-row>
    <v-row justify="end">
      <v-col cols="12" lg="3">
        <v-btn block @click="savePassword"> Изменить </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
