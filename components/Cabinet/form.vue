<script setup>
import { useNotification } from "@kyvg/vue3-notification";

const cabinetStore = useCabinetStore();
const { $client } = useNuxtApp();
const { rulePhone, ruleRequired, ruleNameLen } = useFormRules();
const { notify } = useNotification();

let radios = ref("Через номер телефона");
let dialog = ref(false);
const isLoading = ref(false);
const isBtnDisabled = ref(false);

const cabinetForm = reactive({
  title: "",
  xSupplierID: "",
  apiKeyAdvertisement: "",
  apiKeyStatistic: "",
  phoneNumber: "",
  wbToken: "",
});

async function addCabinet() {
  isBtnDisabled.value = true;
  if (
    ruleNameLen(cabinetForm.title) !== true ||
    ruleRequired(cabinetForm.xSupplierID) !== true ||
    ruleRequired(cabinetForm.apiKeyAdvertisement) !== true ||
    ruleRequired(cabinetForm.apiKeyStatistic) !== true ||
    (radios.value !== "Через номер телефона" && radios.value !== "Через WBToken")
  ) {
    notify({
      type: "error",
      text: "Заполните все поля",
    });
    isBtnDisabled.value = false;
    return;
  }

  if (rulePhone(cabinetForm.phoneNumber) !== true && ruleRequired(cabinetForm.wbToken) !== true) {
    notify({
      type: "error",
      text: "Заполните все поля",
    });
    isBtnDisabled.value = false;
    return;
  }
  isBtnDisabled.value = true;
  isLoading.value = true;

  const { data, error } = await useAsyncData(() =>
    $client.cabinet.createCabinet.mutate({
      title: cabinetForm.title,
      connectingMethod: radios.value,
      phoneNumber: cabinetForm.phoneNumber,
      xSupplierId: cabinetForm.xSupplierID,
      apiKeyAdvertisement: cabinetForm.apiKeyAdvertisement,
      apiKeyStatistic: cabinetForm.apiKeyStatistic,
      wbToken: cabinetForm.wbToken,
    })
  );

  if (error.value) {
    console.log(error);
    notify({
      type: "error",
      text: error.value.message,
    });
  }

  if (data.value) {
    (cabinetForm.title = ""),
      (cabinetForm.xSupplierID = ""),
      (cabinetForm.apiKeyAdvertisement = ""),
      (cabinetForm.apiKeyStatistic = ""),
      (cabinetForm.wbToken = ""),
      notify({ type: "success", text: "Кабинет добавлен" });
    cabinetStore.getCabinets();
  }
  dialog.value = false;
  isBtnDisabled.value = false;
  isLoading.value = false;
}
</script>

<template>
  <v-row justify="end">
    <v-dialog v-model="dialog" width="1024">
      <v-progress-linear
        :active="isLoading"
        :indeterminate="isLoading"
        color="deep-purple-accent-4"
      ></v-progress-linear>
      <template v-if="!isLoading" v-slot:activator="{ props }">
        <div class="mr-3">
          <v-btn color="primary" class="flex justify-end" v-bind="props"> Добавить кабинет </v-btn>
        </div>
      </template>
      <v-card>
        <v-col>
          <span class="text-h6">Подключение рекламного кабинета</span>
        </v-col>
        <v-card-title class="mt-2 ml-2"> </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <h2 class="ml-2">Метод подключения</h2>
                <v-radio-group inline v-model="radios">
                  <v-radio label="Через номер телефона" value="Через номер телефона"></v-radio>
                  <v-radio label="Через WBToken" value="Через WBToken"></v-radio>
                </v-radio-group>
              </v-col>

              <v-col cols="12" v-if="radios === 'Через номер телефона'">
                <v-text-field
                  :rules="[ruleRequired, rulePhone]"
                  label="Номер телефона"
                  v-model="cabinetForm.phoneNumber"
                  variant="underlined"
                ></v-text-field>
              </v-col>

              <v-col cols="12" v-if="radios === 'Через WBToken'">
                <v-text-field
                  :rules="[ruleRequired]"
                  label="WBToken"
                  v-model="cabinetForm.wbToken"
                  variant="underlined"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  :rules="[ruleRequired, ruleNameLen]"
                  label="Название кабинета"
                  v-model="cabinetForm.title"
                  variant="underlined"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  :rules="[ruleRequired]"
                  label="X-Supplier-ID"
                  v-model="cabinetForm.xSupplierID"
                  variant="underlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  :rules="[ruleRequired]"
                  label="API-ключ Реклама"
                  v-model="cabinetForm.apiKeyAdvertisement"
                  variant="underlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  :rules="[ruleRequired]"
                  label="API-ключ Статистика"
                  v-model="cabinetForm.apiKeyStatistic"
                  variant="underlined"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="dialog = false"> Закрыть </v-btn>
          <v-btn :disabled="isBtnDisabled" color="blue-darken-1" variant="text" @click="addCabinet">
            Добавить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style scoped></style>
