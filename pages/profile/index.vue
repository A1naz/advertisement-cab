<script setup lang="ts">
import { useNotification } from "@kyvg/vue3-notification";

const userStore = useUserStore();
const client = userStore.client;
const { $client } = useNuxtApp();
const { ruleEmail, rulePassLen, ruleRequired } = useFormRules();
const { notify } = useNotification();

async function connectApiKeyAdvertisement() {
  const { data, error } = await useAsyncData(() =>
    $client.cabinet.createCabinet.mutate({
      apiKeyAdvertisement: client.apiKeyAdvertisement,
    })
  );

  if (error.value) {
    notify({
      type: "error",
      text: error.value.message,
    });
  }

  if (data.value) {
    notify({ type: "success", text: "Личный кабинет подключен" });
  }

  await userStore.client;
}

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
      text: error.value.message,
    });
  }

  if (data.value) {
    notify({ type: "success", text: "Профиль обновлен" });
  }
}

const passwordForm = reactive({
  oldPassword: "",
  newPassword: "",
});

const wbForm = reactive({
  apiKeyAdvertisement: "",
  xSupplierId: "",
  apiKeyStatistic: "",
});

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
      text: error.value.message,
    });
  }
  if (data.value) notify({ type: "success", text: "Пароль обновлен" });
}

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
          v-model="client.email"
          :rules="[ruleRequired, ruleEmail]"
          label="Email"
          type="email"
          variant="filled"
        />
      </v-col>
      <v-col>
        <v-text-field
          v-model="client.firstName"
          variant="filled"
          :rules="[ruleRequired]"
          label="Имя"
          type="text"
        />
      </v-col>
      <v-col>
        <v-text-field
          v-model="client.lastName"
          :rules="[ruleRequired]"
          label="Фамилия"
          type="text"
          variant="filled"
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
        <h2>Подключение личного кабинета пользователя</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          v-model="client.xSupplierId"
          variant="filled"
          :rules="[ruleRequired]"
          label="X-Supplier-Id"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          variant="filled"
          v-model="client.apiKeyAdvertisement"
          :rules="[ruleRequired]"
          label="Api-ключ Реклама"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          variant="filled"
          v-model="client.apiKeyStatistic"
          :rules="[ruleRequired]"
          label="Api-ключ Статистика"
        />
      </v-col>
    </v-row>
    <v-row justify="end">
      <v-col cols="12" lg="3">
        <v-btn block @click="connectApiKeyAdvertisement"> Подключить </v-btn>
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
          variant="filled"
          v-model="passwordForm.oldPassword"
          :rules="[ruleRequired, rulePassLen]"
          label="Старый пароль"
          type="password"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <v-text-field
          variant="filled"
          v-model="passwordForm.newPassword"
          :rules="[ruleRequired, rulePassLen]"
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
