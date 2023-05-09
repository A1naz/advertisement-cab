<script setup>
const campaignStore = useCampaignStore();
const options = ref([
  "Все",
  "Ативные",
  "Приостановленные",
  "Архив",
  "Под управлением",
  "Дневной лимит",
]);
</script>
<template>
  <div class="mb-1">
    <v-slide-group show-arrows>
      <v-slide-group-item v-for="option in options" :key="option" v-slot="{ isSelected, toggle }">
        <v-btn
          density="compact"
          class="mx-1"
          variant="text"
          :color="isSelected ? 'secondary' : 'gray'"
          @click="toggle"
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
          <th class="text-left">Дата создания</th>
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
        <tr v-for="campaign in campaignStore.campaigns" :key="campaign._id">
          <td>
            {{ campaign.createTime }}
          </td>
          <td>
            <div>
              {{ campaign.name }}
            </div>
            <div class="text-sm mt-2">
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
            <div class="text-sm mt-2">ID: {{ campaign.advertId }}</div>
          </td>
          <td>
            <div v-for="param in campaign.params">
              <div v-for="nm in param.nms" class="my-1">
                {{ nm.nm }}
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
            <div class="my-1">Показы:{{ campaign.shows }}</div>
            <div class="my-1">Клики: {{ campaign.clicks }}</div>
            <div class="my-1">CTR: {{ campaign.CTR }}</div>
            &nbsp;
          </td>
          <td>
            <div class="my-1">Корзина:{{ campaign.cart }}</div>
            <div class="my-1">Заказы:{{ campaign.orders }}</div>
            <div class="my-1">CR: {{ campaign.CR }}</div>
          </td>
          <td>
            <div>
              <v-switch
                density="compact"
                :label="'выключен'"
                :disabled="campaign.isAdjusted === false ? true : false"
                color="indigo"
                value="indigo"
                hide-details
              ></v-switch>
            </div>

            <div class="mt-2">
              <v-btn border class="text-none" prepend-icon="mdi-cog" variant="text">
                {{ campaign.isAdjusted ? "Настроена" : "Не настроена" }} ></v-btn
              >
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>
