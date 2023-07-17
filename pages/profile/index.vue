<script setup lang="ts">
import { useNotification } from "@kyvg/vue3-notification";
const { status } = useAuth();
const userStore = useUserStore();
const campaignStore = useCampaignStore();
if (status.value === "authenticated") userStore.getClient();
let client = userStore.client;
const { $client }: any = useNuxtApp();
const { ruleEmail, rulePassLen, ruleRequired, rulePhone } = useFormRules();
const { notify } = useNotification();

const apiTokenSwitch = ref(false);
apiTokenSwitch.value = client.isApiPlusTokenEnabled;

async function connectWbCabinet() {
  if (ruleRequired(wbForm.apiKeyAdvertisement) !== true) {
    notify({
      type: "error",
      text: "Введите все поля",
    });
    return;
  }

  if (wbForm.apiKeyAdvertisement.includes("*******")) {
    notify({
      type: "error",
      text: "Введите валидный апи ключ рекламы",
    });

    return;
  }

  const { data, error } = await useAsyncData(() =>
    $client.cabinet.createCabinet.mutate({
      apiKeyAdvertisement: wbForm.apiKeyAdvertisement,
      wbToken: wbForm.apiKeyAdvertisement,
      xSupplierId: wbForm.apiKeyAdvertisement,
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
  apiKeyStatistic: client.apiKeyStatistic,
});

const apiForm = reactive({
  wbToken: client.apiKeyAdvertisement,
  xSupplierId: client.apiKeyStatistic,
});

async function savePassword() {
  if (client.hasPassword) {
    if (passwordForm.oldPassword.length < 6) {
      notify({
        type: "error",
        text: "Не менее 6 символов",
      });
      return;
    }
  }
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
    wbForm.apiKeyStatistic === client.apiKeyStatistic
    ? true
    : false;
});
const isBtnConnectApiActive = computed(() => {
  return apiForm.wbToken === client.wbToken && apiForm.xSupplierId === client.xSupplierId
    ? true
    : false;
});

async function turnOnOffApiPlusToken() {
  const { data, error } = await $client.user.turnOnOffApiPlusToken.query();
}

function onTelegramLink(data: any) {
  if (data.status === "ok") {
    notify({
      type: "success",
      text: "Telegram успешно привязан",
    });
  } else {
    notify({
      type: "error",
      text: "Произошла ошибка",
    });
  }
}

async function unLinckTelegram() {
  const { data, error } = await useAsyncData(() => $client.user.unLinkTelegram.query());

  if (error.value) {
    notify({
      type: "error",
      text: error.value.message,
    });
  }
  if (data.value) {
    notify({
      type: "success",
      text: "Telegram успешно отвязан",
    });

    userStore.client.telegram = '';
  }
}
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
      <v-col cols="12">
        <div class="flex">
          <v-text-field
            disabled
            v-model="userStore.client.telegram"
            :rules="[rulePhone]"
            label="Telegram"
            type="text"
            variant="filled"
            class="mr-2"
          />
          <div>
            <LinkTelegram v-if="!userStore.client.telegram" />
            <vBtn v-if="userStore.client.telegram" class="ml-2 px-6 mt-2" @click="unLinckTelegram"
              >Отвязать</vBtn
            >
          </div>
        </div>
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
        <div class="w-40">
          <v-tooltip
            activator="parent"
            text="Для доступа к этой функции необходимо приобрести продвинутый тариф"
            :disabled="userStore.isClientAdvanced"
            transition="fade-transition"
          >
            <template v-slot:activator="{ props }">
              <v-switch
                @update:modelValue="turnOnOffApiPlusToken"
                :disabled="!userStore.isClientAdvanced"
                v-model="apiTokenSwitch"
                label="api + token"
                color="primary"
                inset
                hide-details
              />
            </template>
          </v-tooltip>
        </div>
      </v-col>
    </v-row>

    <v-form @submit.prevent v-if="apiTokenSwitch">
      <v-row>
        <v-col>
          <v-text-field
            variant="filled"
            v-model="apiForm.wbToken"
            :rules="[ruleRequired]"
            label="WB-Token"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            variant="filled"
            :rules="[ruleRequired]"
            v-model="apiForm.xSupplierId"
            label="X-Supplier-Id"
          />
        </v-col>
      </v-row>
      <v-row justify="end">
        <v-col cols="12" lg="3">
          <v-btn block @click="connectWbCabinet" :disabled="isBtnConnectApiActive" type="submit">
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
      <v-col v-if="client.hasPassword">
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
      <v-col>
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
