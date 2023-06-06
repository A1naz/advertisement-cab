<script setup lang="ts">
import { useNotification } from "@kyvg/vue3-notification";
const { status } = useAuth();
const userStore = useUserStore();
const campaignStore = useCampaignStore();
if (status.value === "authenticated") userStore.getClient();
let client = userStore.client;
const { $client } = useNuxtApp();
const { ruleEmail, rulePassLen, ruleRequired, rulePhone } = useFormRules();
const { notify } = useNotification();

async function connectWbCabinet() {
  if (
    ruleRequired(wbForm.apiKeyAdvertisement) !== true ||
    ruleRequired(wbForm.xSupplierId) !== true ||
    ruleRequired(wbForm.wbToken) !== true
  ) {
    notify({
      type: "error",
      text: "Введите все поля",
    });
    return;
  }

  const { data, error } = await useAsyncData(() =>
    $client.cabinet.createCabinet.mutate({
      apiKeyAdvertisement: wbForm.apiKeyAdvertisement,
      xSupplierId: wbForm.xSupplierId,
      wbToken: wbForm.wbToken,
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

    await userStore.getClient();
    await campaignStore.getCampaigns();
    wbForm.apiKeyAdvertisement = client.apiKeyAdvertisement;
  }
}

async function saveChanges() {
  const { data, error } = await useAsyncData(() =>
    $client.user.editProfile.mutate({
      email: client.email,
      firstName: client.firstName,
      lastName: client.lastName,
      phone: client.phone,
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
  apiKeyAdvertisement: client.apiKeyAdvertisement,
  xSupplierId: client.xSupplierId,
  apiKeyStatistic: client.apiKeyStatistic,
  wbToken: client.wbToken,
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

const show1 = ref(false);
const show2 = ref(false);

const isBtnConnectActive = computed(() => {
  return wbForm.apiKeyAdvertisement === client.apiKeyAdvertisement &&
    wbForm.xSupplierId === client.xSupplierId &&
    wbForm.wbToken === client.wbToken
    ? true
    : false;
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
      <v-col cols="12">
        <v-text-field
          v-model="client.phone"
          :rules="[rulePhone]"
          label="Номер телефона"
          type="text"
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
    <v-form @submit.prevent>
      <v-row>
        <v-col>
          <v-text-field
            variant="filled"
            v-model="wbForm.apiKeyAdvertisement"
            :rules="[ruleRequired]"
            label="Api-ключ Реклама"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="wbForm.wbToken"
            :rules="[ruleRequired]"
            variant="filled"
            label="Wb-Token"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="wbForm.xSupplierId"
            :rules="[ruleRequired]"
            variant="filled"
            label="X-Supplier-Id"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            variant="filled"
            v-model="wbForm.apiKeyStatistic"
            label="Api-ключ Статистика"
          />
        </v-col>
      </v-row>
      <v-row justify="end">
        <v-col cols="12" lg="3">
          <v-btn block @click="connectWbCabinet" :disabled="isBtnConnectActive" type="submit">
            Подключить
          </v-btn>
        </v-col>
      </v-row>
    </v-form>

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
          :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="show1 = !show1"
          :type="show1 ? 'text' : 'password'"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <v-text-field
          variant="filled"
          v-model="passwordForm.newPassword"
          :rules="[ruleRequired, rulePassLen]"
          label="Новый пароль"
          :append-inner-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="show2 = !show2"
          :type="show2 ? 'text' : 'password'"
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
