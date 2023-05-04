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

  if (data.value) notify({ type: "success", title: "Успешно", text: "Профиль обновлен" });
}

const passwordForm = reactive({
  oldPassword: "",
  newPassword: "",
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
      title: "Ошибка",
      text: error.value.message,
    });
  }
  if (data.value) notify({ type: "success", title: "Успешно", text: "Пароль обновлен" });
}

definePageMeta({
  title: "Рекламные кампании",
  auth: true,
  layout: "app",
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <h2 class="">Управление кампаниями</h2>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
