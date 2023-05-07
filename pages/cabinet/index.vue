<script setup lang="ts">
import { useNotification } from "@kyvg/vue3-notification";

const isLoading = ref(true);
const { status } = useAuth();
const cabinetStore = useCabinetStore();
if (status.value === "authenticated") await cabinetStore.getCabinets();
isLoading.value = false;
const { $client } = useNuxtApp();
const { notify } = useNotification();

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
    await cabinetStore.getCabinets();
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
        <h2>Управление кабинетами</h2>
      </v-col>
      <v-col class="flex items-end">
        <CabinetForm />
      </v-col>
    </v-row>
    <v-row class="mx-2 my-5">
      <div class="flex flex-col w-full">
        <v-col v-for="cabinet in cabinetStore.cabinets" class="w-full">
          <v-card
            @click="routeTo(cabinet._id)"
            :title="cabinet.title"
            :subtitle="cabinet.status"
            text=""
            variant="tonal"
          >
            <v-card-actions class="flex justify-between">
              <div class="flex flex-col md:flex-row">
                <h2 class="mx-2">Кол-во кампании: 0</h2>
                <h2 class="mx-2">Тип: {{ cabinet.connectingMethod }}</h2>
              </div>
              <div @click.stop>
                <v-btn prepend-icon="mdi-delete" @click="deleteCabinet(cabinet._id)">Удалить</v-btn>
              </div>
            </v-card-actions>
          </v-card>
        </v-col>
      </div>
    </v-row>
  </v-container>
</template>

<style scoped></style>
