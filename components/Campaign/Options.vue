<script setup>
import { any } from "zod";

const dialog = ref(false);
defineProps({
  campaign: Object,
});
</script>
<template>
  <v-dialog v-model="dialog" width="1024" :scrim="0">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" border class="text-none" prepend-icon="mdi-cog" variant="text">
        {{ campaign.isAdjusted ? "Настроена" : "Не настроена" }} ></v-btn
      >
    </template>
    <v-card>
      <v-card-title class="text-sm">
        <v-row class="flex justify-center">
          <v-col>
            <span class="text-h10">Опции "{{ campaign.name }}" </span>
          </v-col>
          <v-col class="text-end">
            <v-btn
              color="blue-lighten-2"
              size="large"
              variant="text"
              icon="mdi-close-thick"
              @click="dialog = false"
            ></v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field variant="filled" label="Бюджет" prefix="₽"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>s1dsd </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="dialog = false"> Сохранить </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
