<script setup>
import { useNotification } from "@kyvg/vue3-notification";

const campaignStore = useCampaignStore();
const { $client } = useNuxtApp();
const { rulePhone, ruleRequired, ruleNameLen } = useFormRules();
const { notify } = useNotification();

let radios = ref("Через номер телефона");
let dialog = ref(false);
const isLoading = ref(false);
const isBtnDisabled = ref(false);
const selectedCategory = ref("");
const selectedArticles = ref([]);

function sortItemsByCategory() {
  campaignStore.sortItemsByCategory(selectedCategory.value);
}

const campaignForm = reactive({
  title: "",
  category: "",
});
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
                  <v-radio label="Карточка товара" value="Через номер телефона"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  :rules="[]"
                  label="Название рекламной кампании"
                  v-model="campaignForm.title"
                  variant="underlined"
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
                  hint="Выберите один или несколько предметов"
                  persistent-hint
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1"> Добавить кампанию </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style scoped></style>
