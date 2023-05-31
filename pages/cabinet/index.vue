<script setup lang="ts">
import { useNotification } from "@kyvg/vue3-notification";
import { useWindowSize } from "@vueuse/core";
const { status } = useAuth();
const campaignStore = useCampaignStore();
const userStore = useUserStore();
let client = userStore.client;
if (status.value === "authenticated") userStore.getClient();

async function updateCabinetPerInterval() {
  setInterval(() => {
    campaignStore.updateCabinet();
    campaignStore.getCampaigns();
  }, 60000);
}

if (status.value === "authenticated" && client.apiKeyAdvertisement) {
  updateCabinetPerInterval();
}

const { width } = useWindowSize();
const search = ref("");

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
</script>

<template>
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
          clearable
          clear-icon="mdi-close-circle"
          @click:clear="searchCampaigns"
          single-line
          hide-details
          v-model="search"
          @keyup.enter="searchCampaigns"
          class="max-w-xl"
        >
          <template v-slot:append>
            <v-icon style="font-size: 30px;" class="mb-1" @click="searchCampaigns">mdi-magnify</v-icon>
          </template>
        </v-text-field>
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
