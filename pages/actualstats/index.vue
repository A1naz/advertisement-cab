<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
const { $client } = useNuxtApp();
const campaignStore = useCampaignStore();
const { status } = useAuth();
await campaignStore.getCampaigns();
const stats = ref<any>([]);
const article = ref("");
const loading = ref(false);
const items = ref<any>([]);
campaignStore.items.forEach((el: any) => {
  if (!items.value.includes(el.nms)) {
    items.value.push(...el.nms);
  }
});
async function findCampaignStats() {
  loading.value = true;
  const { data, error } = await useAsyncData(() =>
    $client.campaign.campgaignStats.query(article.value.toString())
  );

  if (error.value) {
    loading.value = false;
    notify({ type: "error", text: error.value.message });
  }

  if (data.value) {
    stats.value = data.value;
  }
  loading.value = false;
}

function openArticlePage(nm: any) {
  window.open(`https://www.wildberries.ru/catalog/${nm}/detail.aspx`);
}

definePageMeta({
  title: "Проверка ставок",
  auth: true,
  layout: "app",
});
</script>
<template>
  <v-container>
    <div class="pb-5 text-sm text-zinc-400">
      Актуальные ставки по рекламе обычно ниже заявленных ставок по WB
    </div>
    <v-row>
      <v-col>
        <h2>Актуальные ставки</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-autocomplete
          v-model="article"
          :items="items"
          no-data-text="Нет предметов"
          class="max-w-xs max-h-10 mb-4"
          :loading="loading"
          @update:modelValue="findCampaignStats"
        >
          <template v-slot:chip="{ props, item }">
            <div>
              {{ item.title }}
            </div>
            <v-img class="w-8 ml-3" :src="findImage(item.title)" />
          </template>

          <template v-slot:item="{ props, item }" class="">
            <v-list-item :title="item.title" v-bind="props"> </v-list-item>
          </template>
        </v-autocomplete>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div>
          <v-table class="rounded-lg pt-2 elevation-1" density="default">
            <thead>
              <tr>
                <th class="text-left">Место</th>
                <th class="text-center">Изображение</th>
                <th class="text-center">Артикул</th>
                <th class="text-center">Актуальная ставка</th>
                <th class="text-center">Ставка WB</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="stat in stats">
                <td>{{ stat.position }}</td>
                <td>
                  <v-img class="ml-auto mr-auto my-2" :width="60" :src="findImage(stat.nmId)">
                    <template v-slot:placeholder>
                      <div class="d-flex align-center justify-center fill-height">
                        <v-progress-circular
                          color="indigo-darken-2"
                          indeterminate
                        ></v-progress-circular>
                      </div>
                    </template>
                    <v-tooltip activator="parent" transition="fade-transition" location="right">{{
                      stat.nmId
                    }}</v-tooltip>
                  </v-img>
                </td>
                <td class="text-center cursor-pointer" @click="openArticlePage(stat.nmId)">{{ stat.nmId }}</td>
                <td class="text-center">{{ stat.cpm }}</td>
                <td class="text-center">{{ stat.wbCpm }}</td>
              </tr>
            </tbody>
          </v-table>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
