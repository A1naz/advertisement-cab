<script setup lang="ts">
import { useNotification } from "@kyvg/vue3-notification";
import { useWindowSize } from "@vueuse/core";
const { status } = useAuth();
const campaignStore = useCampaignStore();
const userStore = useUserStore();
let client = userStore.client;
if (status.value === "authenticated") userStore.getClient()

function updateCabinet() {
  setInterval(() => {
    campaignStore.updateCabinet();
    campaignStore.getCampaigns();
  }, 60000);
}

if (status.value === "authenticated" && client.apiKeyAdvertisement) {
  campaignStore.updateCabinet();
  campaignStore.getCampaigns();
  updateCabinet();
}

const isLoading = ref(true);
const { width, height } = useWindowSize();
const search = ref("");

isLoading.value = false;
const { $client } = useNuxtApp();
const { notify } = useNotification();

function searchCampaigns() {
  campaignStore.searchCampaign(search.value);
}

definePageMeta({
  title: "Рекламный кабинет",
  auth: true,
  layout: "app",
});

function routeTo(id: string) {
  return navigateTo(`/cabinet/${id}`);
}
</script>

<template>
  <v-progress-linear
    :active="isLoading"
    :indeterminate="isLoading"
    color="deep-purple-accent-4"
  ></v-progress-linear>
  <v-container>
    <div class="pb-5 text-sm text-zinc-400">Здесь отображаются ваши рекламные кабинеты</div>
    <v-row class="">
      <v-col>
        <h2>Управление кампаниями</h2>
      </v-col>
      <v-col class="flex items-end">
        <CampaignCreate />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          density="compact"
          variant="filled"
          label="Введите название кампании или ID"
          append-inner-icon="mdi-magnify"
          single-line
          hide-details
          v-model="search"
          @input="searchCampaigns"
          class="max-w-xl"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div v-if="width < 1200">
          <CampaignCart />
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div v-if="width >= 1200">
          <CampaignTable />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
