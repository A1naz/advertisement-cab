<script setup>
definePageMeta({
  title: "Проверка ставок",
  auth: true,
  layout: "app",
});
</script>
<template>
  <v-container>
    <div class="pb-5 text-sm text-zinc-400">Здесь отображаются ваши рекламные кабинеты</div>
    <v-row>
      <v-col>
        <h2>Управление кампаниями</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <ActualStatsTable />
      </v-col>
    </v-row>
  </v-container>
</template>
