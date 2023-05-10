<script setup>
import { useNotification } from "@kyvg/vue3-notification";

const campaignStore = useCampaignStore();
const { $client } = useNuxtApp();
const { ruleRequired, ruleNameLen } = useFormRules();
const { notify } = useNotification();

let radios = ref("Карточка товара");
let dialog = ref(false);
const isLoading = ref(false);
const isBtnDisabled = ref(false);
const selectedCategory = ref("");
const selectedArticles = ref([]);
const oldCategory = ref("");
const title = ref("");

function sortItemsByCategory() {
  if (oldCategory.value != selectedCategory.value) {
    selectedArticles.value = [];
  }
  oldCategory.value = selectedCategory.value;
  campaignStore.sortItemsByCategory(selectedCategory.value);
}

async function addCampaign() {
  isBtnDisabled.value = true;
  isLoading.value = true;

  if (
    ruleNameLen(title.value) !== true ||
    ruleRequired(title.value) !== true ||
    ruleRequired(selectedCategory.value) !== true ||
    ruleRequired(selectedArticles.value) !== true ||
    (radios.value !== "Карточка товара" && radios.value !== "Поиск")
  ) {
    notify({
      type: "error",
      text: "Заполните все поля",
    });
    isLoading.value = false;
    isBtnDisabled.value = false;
    return;
  }

  const { data, error } = await useAsyncData(() =>
    $client.campaign.createCampaign.mutate({
      type: radios.value,
      title: title.value,
      category: selectedCategory.value,
      items: selectedArticles.value,
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
    title.value = "";
    selectedCategory.value = "";
    selectedArticles.value = [];
    notify({ type: "success", text: "Кампания создана" });
    campaignStore.getCampaigns();
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
          <v-btn color="primary" class="flex justify-end" v-bind="props">
            Создать новую кампанию
          </v-btn>
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
                <h2 class="ml-2 mb-2">Тип рекламной кампании</h2>
                <v-radio-group inline v-model="radios">
                  <v-radio label="Карточка товара" value="Карточка товара"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  :rules="[ruleRequired, ruleNameLen]"
                  label="Название рекламной кампании"
                  v-model="title"
                  variant="filled"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  @change=""
                  @update:menu="sortItemsByCategory"
                  label="Группа предметов"
                  :items="campaignStore.categories"
                  v-model="selectedCategory"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="selectedArticles"
                  :items="campaignStore.itemsByCategory"
                  label="Предметы"
                  multiple
                  no-data-text="Нет предметов"
                  hint="Выберите один или несколько предметов"
                  persistent-hint
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" @click="addCampaign"> Добавить кампанию </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style scoped></style>
