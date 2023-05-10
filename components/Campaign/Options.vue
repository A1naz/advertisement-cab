<script setup>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
const { $client } = useNuxtApp();
const dialog = ref(false);
const budget = ref("");
const targetPosition = ref("");
const dailyBudget = ref("");
const firstTime = ref("");
const secondTime = ref("");
const ifMaxBet = ref("Остановить кампанию");
const getBet = ref();
const ifBetEquals = ref("");
const { ruleRequired } = useFormRules();
const campaignStore = useCampaignStore();
import { useTheme } from "vuetify";
import { nan } from "zod";
const theme = useTheme();
defineProps({
  campaign: Object,
});

function fixTime(timeArr) {
  const result = timeArr
    .map((time) => {
      const hours = time.hours < 10 ? `0${time.hours}` : time.hours;
      const minutes = time.minutes < 10 ? `0${time.minutes}` : time.minutes;
      const seconds = time.seconds < 10 ? `0${time.seconds}` : time.seconds;
      return `${hours}:${minutes}:${seconds}`;
    })
    .join(" - ");
  return result;
}

async function adjustCampgain(id) {
  if (
    ruleRequired(budget.value) !== true ||
    ruleRequired(targetPosition.value) !== true ||
    ruleRequired(budget.value) !== true ||
    ruleRequired(firstTime.value) !== true ||
    ruleRequired(secondTime.value) !== true ||
    (ruleRequired(getBet.value) !== true && ifMaxBet.value === "Выставить ставку")
  ) {
    notify({
      type: "error",
      text: "Заполните все поля",
    });
    isLoading.value = false;
    isBtnDisabled.value = false;
    return;
  }

  if (
    typeof Number(budget.value) != "number" ||
    typeof Number(targetPosition.value) != "number" ||
    typeof Number(dailyBudget.value) != "number"
  ) {
    notify({
      type: "error",
      text: "Некорректные поля",
    });
    isLoading.value = false;
    isBtnDisabled.value = false;
    return;
  }

  const timeFirst = fixTime(firstTime.value);
  const timeSecond = fixTime(secondTime.value);
  const finalTimes = `${timeFirst} | ${timeSecond}`;

  if (ifMaxBet.value === "Выставить ставку") {
    ifMaxBet.value = `Выставить ставку ${getBet.value}р.`;
  }

  const { data, error } = await useAsyncData(() =>
    $client.campaign.adjustCampaign.mutate({
      _id: id,
      budget: Number(budget.value),
      targetPosition: Number(targetPosition.value),
      dailyBudget: Number(dailyBudget.value),
      ifMaxBetDoesntMatch: ifMaxBet.value,
      ifBetEqualsNear: ifBetEquals.value,
      showHours: finalTimes,
    })
  );

  if (error.value) {
    notify({
      type: "error",
      text: error.value.message,
    });
  }

  if (data.value) {
    await campaignStore.getCampaigns();
    notify({ type: "success", text: "Кампания настроена" });
  }
}
</script>
<template>
  <v-dialog v-model="dialog" width="1200" :scrim="false">
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
              <h2 class="mb-2">Часы показов:</h2>

              <VueDatePicker
                v-model="firstTime"
                cancel-text="Отмена"
                select-text="Выбрать"
                mode-height="200"
                :dark="theme.global.name.value == 'dark' ? true : false"
                time-picker
                range
              >
              </VueDatePicker>
            </v-col>
            <v-col>
              <h2 class="mb-2">Часы показов:</h2>
              <VueDatePicker
                v-model="secondTime"
                :dark="theme.global.name.value == 'dark' ? true : false"
                time-picker
                range
            /></v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                :rules="[ruleRequired]"
                variant="filled"
                v-model="budget"
                label="Бюджет"
                prefix="₽"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                :rules="[ruleRequired]"
                variant="filled"
                v-model="targetPosition"
                label="Целевая позиция"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                :rules="[ruleRequired]"
                variant="filled"
                v-model="dailyBudget"
                label="Дневной бюджет"
                prefix="₽"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="mx-1">
            <v-col>
              Если макс. ставка не соответсвует, то:
              <v-container fluid>
                <v-radio-group v-model="ifMaxBet" column>
                  <v-radio label="Остановить кампанию" value="Остановить кампанию"></v-radio>
                  <v-radio
                    label="Оставить последнюю ставку"
                    value="Оставить последнюю ставку"
                  ></v-radio>
                  <div class="flex">
                    <v-radio label="Выставить ставку" value="Выставить ставку"> </v-radio>
                    <v-text-field
                      :rules="[ruleRequired]"
                      v-model="getBet"
                      class="mt-3"
                      density="compact"
                      :disabled="ifMaxBet == 'Выставить ставку' ? false : true"
                      variant="filled"
                      label="Ставка"
                      prefix="₽"
                      size="1"
                    ></v-text-field>
                  </div>
                  <v-radio label="Поставить макс. ставку" value="Поставить макс. ставку"></v-radio>
                </v-radio-group>
              </v-container>
            </v-col>
            <v-col>
              Если ставка равна соседней, то:
              <v-container fluid>
                <v-radio-group v-model="ifBetEquals" column>
                  <v-radio label="Увеличить ставку на 1 руб" value="Увеличить ставку на 1 руб">
                  </v-radio>
                  <v-radio
                    label="Оставить последнюю ставку"
                    value="Оставить последнюю ставку"
                  ></v-radio>
                </v-radio-group>
              </v-container>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="adjustCampgain(campaign._id)"> Сохранить </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
