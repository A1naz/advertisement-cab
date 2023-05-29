<script setup lang="ts">
const dialog = ref(false);
const campaignStore = useCampaignStore();
const onOff = ref();
const options = ref([
  "Все",
  "Активные",
  "Приостановленные",
  "Архив",
  "Под управлением",
  "Дневной лимит",
]);

const iconArrow = ref("");

function sortByCreateTime() {
  if (iconArrow.value === "") {
    iconArrow.value = "mdi-menu-down";
    campaignStore.sortValue = "descending";
    campaignStore.sortByCreateTime();
  } else if (iconArrow.value === "mdi-menu-down") {
    iconArrow.value = "mdi-menu-up";
    campaignStore.sortValue = "ascending";
    campaignStore.sortByCreateTime();
  } else if (iconArrow.value === "mdi-menu-up") {
    campaignStore.sortValue = "turnOnOff";
    iconArrow.value = "";
    campaignStore.sortByCreateTime();
  }
}
</script>
<template>
  <div class="mb-1">
    <v-slide-group mandatory>
      <v-slide-group-item v-for="option in options" :key="option" v-slot="{ isSelected, toggle }">
        <v-btn
          density="compact"
          class="mx-1"
          variant="text"
          :color="isSelected ? 'primary' : 'gray'"
          @click="
            campaignStore.sortCampaigns(option);
            toggle();
          "
        >
          {{ option }}
        </v-btn>
      </v-slide-group-item>
    </v-slide-group>
  </div>
  <div>
    <v-table class="rounded-lg pt-2" density="comfortable">
      <thead>
        <tr>
          <th class="text-left cursor-pointer" @click="sortByCreateTime">
            <div class="min-w-34 flex">
              Дата создания
              <v-icon size="large" :icon="iconArrow"></v-icon>
            </div>
          </th>
          <th class="text-left">Кампания</th>
          <th class="text-left">Артикулы</th>
          <th class="text-left">Статус</th>
          <th class="text-left">Настройки</th>
          <th class="text-left">Бюджет</th>
          <th class="text-left">Затраты</th>
          <th class="text-left">Показатели</th>
          <th class="text-left">Конверсия</th>
          <th class="text-left">Управление</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="campaign in campaignStore.sortedAndSeachedCampaigns" :key="campaign._id">
          <td>
            {{ campaign.createTime }}
          </td>
          <td>
            <div class="flex max-w-xs">
              {{ campaign.name }}
            </div>
            <div class="text-sm mt-3">
              Тип:
              {{
                campaign.type === 4
                  ? "Каталог"
                  : campaign.type === 5
                  ? "Карточка товара"
                  : campaign.type === 6
                  ? "Поиск"
                  : "Рекомендации"
              }}
            </div>
            <div class="text-xs mt-2">ID: {{ campaign.advertId }}</div>
          </td>
          <td>
            <div v-for="nms in campaign.nms" class="flex">
              <div v-for="nm in nms.nms" class="mr-1">
                <v-img class="w-9" :src="findImage(nm)"
                  ><v-tooltip activator="parent" transition="fade-transition" location="top">{{
                    nm
                  }}</v-tooltip>
                </v-img>
              </div>
            </div>
          </td>
          <td>
            <v-chip
              :color="
                campaign.status === 7 ? '#d65755' : campaign.status === 11 ? 'default' : 'green'
              "
            >
              {{
                campaign.status === 7
                  ? "РК Завершена"
                  : campaign.status === 11
                  ? "РК на паузе"
                  : "Идут показы"
              }}
            </v-chip>
          </td>
          <td>
            <div class="my-1">Цел. позиция: {{ campaign.targetPosition }}</div>
            <div class="my-1">Макс. ставка: {{ campaign.maxBet }}</div>
          </td>
          <td>
            <div class="my-1">Общий: {{ campaign.budget }}</div>
            <div class="my-1">Дневной: {{ campaign.dailyBudget }}</div>
          </td>
          <td>
            <div class="my-1">Затраты: {{ campaign.expences }}</div>
            <div class="my-1">CPC: {{ campaign.CPC }}</div>
          </td>
          <td>
            &nbsp;
            <div class="my-1">Показы: {{ campaign.shows }}</div>
            <div class="my-1">Клики: {{ campaign.clicks }}</div>
            <div class="my-1">CTR: {{ campaign.CTR }}</div>
            &nbsp;
          </td>
          <td>
            <div class="my-1">Корзина: {{ campaign.cart }}</div>
            <div class="my-1">Заказы: {{ campaign.orders }}</div>
            <div class="my-1">CR: {{ campaign.CR }}</div>
          </td>
          <td>
            <div></div>

            <div class="mt-2">
              <v-row justify="center">
                <CampaignOptions :campaign="campaign" />
              </v-row>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>
