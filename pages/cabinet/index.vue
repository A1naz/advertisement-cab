<script setup lang="ts">
import { useNotification } from "@kyvg/vue3-notification";
import { useWindowSize } from "@vueuse/core";

const isLoading = ref(true);
const { width, height } = useWindowSize();
const search = ref("");

const { status } = useAuth();
const campaignStore = useCampaignStore();
if (status.value === "authenticated") await campaignStore.getCampaigns();
isLoading.value = false;
const { $client } = useNuxtApp();
const { notify } = useNotification();

function searchCampaigns() {
campaignStore.searchCampaign(search.value)
}

definePageMeta({
  title: "Рекламный кабинет",
  auth: true,
  layout: "app",
});

function routeTo(id: string) {
  return navigateTo(`/cabinet/${id}`);
}

async function deleteCabinet(cabinetId: any) {
  isLoading.value = true;
  const { data, error } = await useAsyncData(() =>
    $client.cabinet.deleteteCabinet.mutate({
      _id: cabinetId,
    })
  );

  if (error.value) {
    notify({
      type: "error",
      text: "Произошла ошибка",
    });
  }

  if (data.value) {
    await campaignStore.getCampaigns();
    notify({
      type: "success",
      text: "Кабинет удален",
    });
  }
  isLoading.value = false;
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
        <v-card class="mx-6" max-width="600">
          <v-card-text>
            <v-text-field
              density="compact"
              variant="solo"
              label="Введите название кампании или ID"
              append-inner-icon="mdi-magnify"
              single-line
              hide-details
              v-model="search"
              @input="searchCampaigns"
              class="max-w-xl"
            ></v-text-field>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="width < 1200">
        <CampaignCart />
      </v-col>
      <v-col v-if="width >= 1200">
        <div>
          <CampaignTable />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
