<script setup lang="ts">
import { useNotification } from "@kyvg/vue3-notification";

const userStore = useUserStore();
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

function submitForm() {
  return;
}
</script>

<template>
  <v-row justify="end">
    <v-dialog v-model="dialog" width="1024" transition="fade-transition">
      <v-progress-linear
        :active="isLoading"
        :indeterminate="isLoading"
        color="deep-purple-accent-4"
      ></v-progress-linear>
      <template v-if="!isLoading" v-slot:activator="{ props }">
        <div class="mr-3">
          <v-btn
            v-if="userStore.isClientAdvanced"
            color="primary"
            class="flex justify-end"
            v-bind="props"
          >
            Создать новую кампанию
          </v-btn>
        </div>
      </template>
      <v-form>
        <v-card>
          <v-row>
            <v-col class="text-h6 ml-6 mt-3">
              <span>Создание рекламного кабинета</span>
            </v-col>
            <v-col class="text-end mr-4 mt-1">
              <v-btn
                class="absolute left-3"
                size="large"
                variant="text"
                icon="mdi-close-thick"
                @click="dialog = false"
                rounded="xl"
              />
            </v-col>
          </v-row>
          <v-card-title class="mt-2 ml-2"> </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <h2 class="ml-2 mb-2">Тип рекламной кампании</h2>
                <v-radio-group inline v-model="radios">
                  <v-radio label="Карточка товара" value="Карточка товара"></v-radio>
                  <v-radio label="Поиск" value="Поиск"></v-radio>
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
                  :rules="[ruleRequired]"
                  :items="campaignStore.categories"
                  v-model="selectedCategory"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  :rules="[ruleRequired]"
                  multiple
                  v-model="selectedArticles"
                  :items="campaignStore.itemsByCategory"
                  label="Предметы"
                  closable-chips
                  no-data-text="Нет предметов"
                  hint="Выберите один или несколько предметов"
                  persistent-hint
                >
                  <template v-slot:chip="{ props, item }">
                    <v-img class="w-8 mr-1" :src="findImage(item.title)"> </v-img>
                    <v-chip class="mr-2 mt-1" v-bind="props" :text="item.title"></v-chip>
                  </template>

                  <template v-slot:item="{ props, item }" class="">
                    <v-list-item :title="item.title" v-bind="props"> </v-list-item>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" type="submit" @click="addCampaign"> Добавить кампанию </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-row>
</template>

<style scoped></style>
