<script setup lang="ts">
import { useNotification } from "@kyvg/vue3-notification";

const isLoading = ref(true);
const { status } = useAuth();
const campaignStore = useCampaignStore();
if (status.value === "authenticated") await campaignStore.getCampaigns();
isLoading.value = false;
const { $client } = useNuxtApp();
const { notify } = useNotification();
const headers = ref({
  headers: [
    {
      title: "Dessert (100g serving)",
      align: "start",
      sortable: false,
      key: "name",
    },
    { title: "Calories", align: "end", key: "calories" },
    { title: "Fat (g)", align: "end", key: "fat" },
    { title: "Carbs (g)", align: "end", key: "carbs" },
    { title: "Protein (g)", align: "end", key: "protein" },
    { title: "Iron (%)", align: "end", key: "iron" },
  ],
});

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
  <v-container v-if="!isLoading">
    <div class="pb-5 text-sm text-zinc-400">Здесь отображаются ваши рекламные кабинеты</div>
    <v-row class="mb-2">
      <v-col>
        <h2>Управление кампаниями</h2>
      </v-col>
      <v-col class="flex items-end">
        <CampaignCreate />
      </v-col>
    </v-row>
    <v-row class="mx-2 my-5">
      <div class="flex flex-col w-full">
        <v-col v-for="campaign in campaignStore.campaigns" class="w-full">
          <v-card :title="campaign.name" :subtitle="'Дата создания: ' + campaign.createTime" text="" variant="tonal">
            <v-card-actions class="flex justify-between">
              <div class="flex flex-col md:flex-row">
                <h2 class="mx-2">Кол-во кампании: 0</h2>
                <h2 class="mx-2">Тип:</h2>
                {{ campaign }}
              </div>
              <div @click.stop>
                <v-btn prepend-icon="mdi-delete" @click="">Удалить</v-btn>
              </div>
            </v-card-actions>
          </v-card>
      
        </v-col>
      </div>
    </v-row>
  </v-container>
</template>

<style scoped></style>
