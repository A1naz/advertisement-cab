<script setup>
definePageMeta({
  title: "Рекламный кабинет",
  auth: true,
  layout: "app",
});
</script>
<template>
  <v-container>
    <div class="pb-5 text-sm text-zinc-400">Здесь отображаются ваши рекламные кампании</div>
    <v-row class="mb-2">
      <v-col>
        <NuxtLink to="/cabinet">
          <vBtn> Назад </vBtn>
        </NuxtLink>
      </v-col>
      <v-col class="flex items-end">
        <CampaignCreate />
      </v-col>
    </v-row>
    <v-row class="mx-2 my-5">
      <div class="flex flex-col w-full">
        <div>{{ $route.params.id }}</div>
      </div>
    </v-row>
  </v-container>
</template>
