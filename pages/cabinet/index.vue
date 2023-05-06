<script setup lang="ts">
import { useNotification } from "@kyvg/vue3-notification";

const cabinetStore = useCabinetStore();
const { $client } = useNuxtApp();
const { notify } = useNotification();

definePageMeta({
  title: "Рекламный кабинет",
  auth: true,
  layout: "app",
});

async function deleteCabinet(cabinetId: any) {
  const { data, error } = await useAsyncData(() =>
    $client.cabinet.deleteteCabinet.mutate({
      _id: cabinetId,
    })
    );
    await cabinetStore.cabinets()
}
</script>

<template>
  <v-container>
    <div class="pb-5 text-sm text-zinc-400">Здесь отображаются ваши рекламные кабинеты</div>
    <v-row>
      <v-col>
        <h2 class="">Управление кабинетами</h2>
      </v-col>
      <v-col class="flex items-end">
        <CabinetForm />
      </v-col>
    </v-row>
    <v-row class="mx-2 my-5">
      <div class="flex flex-col w-full">
        <v-col v-for="cabinet in cabinetStore.cabinets" class="w-full">
          <v-card :title="cabinet.title" :subtitle="cabinet.status" text="" variant="tonal">
            <v-card-actions class="flex justify-between">
              <div class="flex flex-row">
                <h2 class="mx-2">Кол-во кампании: 0</h2>
                <h2 class="mx-2">Тип управления: {{ cabinet.connectingMethod }}</h2>
              </div>
              <div>
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
