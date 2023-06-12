<script setup>
const campaignStore = useCampaignStore();
const userStore = useUserStore();
</script>

<template>
  <v-row>
    <v-col v-for="campaign in campaignStore.sortedAndSeachedCampaigns" class="w-full min-w-full">
      <v-card variant="tonal">
        <v-card-item>
          <v-card-title>
            <div>
              {{ campaign.name }}
            </div>
          </v-card-title>
          <v-card-subtitle>
            <div>Дата создания: {{ campaign.createTime }}</div>
            <div class="text-blue-400">{{ campaign.advertId }}</div>
          </v-card-subtitle>
          <div class="flex flex-col md:flex-row">
            <v-row>
              <v-col class="mt-1.5 text-sm">
                Тип:
                {{
                  campaign.type === 4
                    ? "Каталог"
                    : campaign.type === 5
                    ? "Карточка"
                    : campaign.type === 6
                    ? "Поиск"
                    : "Рекомендации"
                }}
              </v-col>
              <v-col class="text-sm">
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
              </v-col>
            </v-row>

            <v-row>
              <v-col>Цел. позиция: {{ campaign.targetPosition }} </v-col>
              <v-col>Макс. ставка: {{ campaign.maxBet }} </v-col>
            </v-row>

            <v-row>
              <v-col>Общий бюджет: {{ campaign.budget }} </v-col>
              <v-col>Дневн. бюджет: {{ campaign.dailyBudget }} </v-col>
            </v-row>

            <v-row v-if="userStore.isClientAdvanced">
              <v-col>Затраты: {{ campaign.expences }} </v-col>
              <v-col>CPC. бюджет: {{ campaign.CPC }} </v-col>
            </v-row>

            <v-row v-if="userStore.isClientAdvanced">
              <v-col>Показы: {{ campaign.shows }} </v-col>
              <v-col>Клики: {{ campaign.clicks }} </v-col>
              <v-col>CTR: {{ campaign.CTR }} </v-col>
            </v-row>

            <v-row v-if="userStore.isClientAdvanced">
              <v-col>Корзина: {{ campaign.cart }} </v-col>
              <v-col>Заказы: {{ campaign.orders }} </v-col>
              <v-col>CR: {{ campaign.CR }} </v-col>
            </v-row>
            <v-row justify="center">
              <v-col>
                <CampaignOptions :campaign="campaign" />
              </v-col>
            </v-row>
            <v-row>
              <v-col class="flex-col">
                <div class="text-center mb-3">Артикулы</div>
                <div v-for="nms in campaign.nms" class="flex-col">
                  <v-row>
                    <v-col class="text-center" v-for="nm in nms.nms">
                      <v-img class="w-16" :src="findImage(nm)"
                        ><v-tooltip activator="parent" location="top">{{ nm }}</v-tooltip>
                      </v-img>
                      &nbsp; &nbsp;</v-col
                    >
                  </v-row>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-card-item>
        <v-card-actions class="flex justify-between"> </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
