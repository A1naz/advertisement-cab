<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useTheme } from "vuetify";
const { $client } = useNuxtApp();
const dialog = ref(false);
const budget = ref("");
const onOff = ref(false);
const targetPosition = ref();
const dailyBudget = ref("");
const firstTime = ref();
const secondTime = ref();
const ifMaxBet = ref("");
const getBet = ref();
const ifBetEquals = ref("");
const { ruleRequired } = useFormRules();
const campaignStore = useCampaignStore();
const theme = useTheme();
const deleteStatus = ref();

const props: any = defineProps({ campaign: Object });

interface TimeObject {
  hours: number;
  minutes: number;
  seconds: number;
}

function parseTime(input: string) {
  const groups = input.split("|");
  const timeArrays: TimeObject[][] = groups.map((group) =>
    group.split("-").map((time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return { hours, minutes, seconds: 0 };
    })
  );
  return [timeArrays[0], timeArrays[1]];
}

if (props) {
  targetPosition.value = props.campaign.targetPosition;
  budget.value = props.campaign.budget;
  dailyBudget.value = props.campaign.dailyBudget;
  ifMaxBet.value = props.campaign.ifMaxBetDoesntMatch;
  getBet.value = props.campaign.getBet;
  ifBetEquals.value = props.campaign.ifBetEqualsNear;
  if (props.campaign.isTurnOn) {
    onOff.value = props.campaign.isTurnOn;
  }
  deleteStatus.value = props.campaign.deleteMark;
  if (props.campaign.showHours) {
    const times = parseTime(props.campaign.showHours);
    firstTime.value = times[0];
    secondTime.value = times[1];
  }
}

function fixTime(timeArr: any) {
  const result = timeArr
    .map((time: any) => {
      const hours = time.hours < 10 ? `0${time.hours}` : time.hours;
      const minutes = time.minutes < 10 ? `0${time.minutes}` : time.minutes;
      return `${hours}:${minutes}`;
    })
    .join("-");
  return result;
}

async function deleteCampaign(id: string, status: boolean) {
  const { data, error } = await useAsyncData(() =>
    $client.campaign.deleteCampaign.mutate({
      _id: id,
      status: status,
    })
  );

  if (error.value) {
    notify({
      type: "error",
      text: error.value.message,
    });
  }

  if (data.value && status == false) {
    await campaignStore.getCampaigns();
    deleteStatus.value = false;
    notify({ type: "success", text: "Удаление отменено" });
  } else if (data.value && status == true) {
    await campaignStore.getCampaigns();
    deleteStatus.value = true;
    notify({ type: "success", text: "Кампания поставлена на удаление" });
  }
}

async function adjustCampgain(id: string) {
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

    return;
  }

  const timeFirst = fixTime(firstTime.value);
  const timeSecond = fixTime(secondTime.value);
  const finalTimes = `${timeFirst}|${timeSecond}`;
  let increaseTo = 0;

  if (ifMaxBet.value === "Выставить ставку") {
    increaseTo = getBet.value;
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
      maxBetIncreaseTo: Number(increaseTo),
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

async function turnOnOff(id: string) {
  const { data, error } = await useAsyncData(() =>
    $client.campaign.turnOnOffCampgain.mutate({
      _id: id,
      status: onOff.value,
    })
  );

  if (error.value) {
    notify({
      type: "error",
      text: error.value.message,
    });
  }

  if (data.value) {
    if (data.value.message === "кампания включена") {
      notify({
        type: "success",
        text: data.value.message,
      });
    } else {
      notify({
        type: "info",
        text: data.value.message,
      });
    }
    campaignStore.getCampaigns();
  }
}
</script>
<template>
  <v-dialog v-model="dialog" width="800" transition="fade-transition">
    <template v-slot:activator="{ props }">
      <div class="flex justify-end md:block">
        <v-btn
          v-bind="props"
          border
          class="text-none my-2 md:my-0"
          prepend-icon="mdi-cog"
          variant="text"
        >
          {{ campaign?.isAdjusted ? "Настроена" : "Не настроена" }} ></v-btn
        >
        <v-switch
          class="mx-3 my-2 md:mx-0 md:my-0"
          density="compact"
          v-model="onOff"
          @update:modelValue="turnOnOff(campaign?._id)"
          :label="onOff === false ? 'выключен' : 'включен'"
          :disabled="campaign?.isAdjusted === false ? true : false"
          color="indigo"
          hide-details
        ></v-switch>
      </div>
    </template>
    <v-card>
      <v-card-title class="text-sm">
        <v-row class="flex justify-center">
          <v-col>
            <h1 class="md:mx-3">Опции "{{ campaign?.name }}"</h1>
          </v-col>
          <v-col class="text-end">
            <v-btn
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
              <div></div>
              <h2>Часы показов:</h2>
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
              <h2>Часы показов:</h2>
              <VueDatePicker
                v-model="secondTime"
                cancel-text="Отмена"
                select-text="Выбрать"
                :dark="theme.global.name.value == 'dark' ? true : false"
                time-picker
                range
            /></v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-text-field
                type="number"
                :rules="[ruleRequired]"
                width="200"
                variant="filled"
                v-model="targetPosition"
                label="Целевая позиция"
              ></v-text-field>
              <v-text-field
                type="number"
                :rules="[ruleRequired]"
                variant="filled"
                v-model="dailyBudget"
                label="Дневной бюджет"
                prefix="₽"
              ></v-text-field>
              <v-text-field
                type="number"
                :rules="[ruleRequired]"
                variant="filled"
                v-model="budget"
                label="Бюджет"
                prefix="₽"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="mx-1">
            <v-col>
              Если макс. ставка не соответсвует, то:
              <v-radio-group density="compact" v-model="ifMaxBet" column>
                <v-radio
                  label="Остановить кампанию"
                  density="comfortable"
                  value="Остановить кампанию"
                ></v-radio>
                <v-radio
                  density="comfortable"
                  label="Оставить последнюю ставку"
                  value="Оставить последнюю ставку"
                ></v-radio>
                <v-radio
                  label="Поставить макс. ставку"
                  density="comfortable"
                  value="Поставить макс. ставку"
                ></v-radio>
                <v-radio label="Выставить ставку" density="comfortable" value="Выставить ставку">
                </v-radio>
                <v-text-field
                  type="number"
                  :rules="[ruleRequired]"
                  v-model="getBet"
                  density="compact"
                  :disabled="ifMaxBet == 'Выставить ставку' ? false : true"
                  variant="filled"
                  label="Ставка"
                  prefix="₽"
                  size="1"
                ></v-text-field>
              </v-radio-group>
            </v-col>
          </v-row>
          <v-row class="mx-1">
            <v-col>
              Если ставка равна соседней, то:
              <v-radio-group v-model="ifBetEquals" density="compact" column>
                <v-radio
                  density="comfortable"
                  label="Увеличить ставку на 1 руб"
                  value="Увеличить ставку на 1 руб"
                >
                </v-radio>
                <v-radio
                  density="comfortable"
                  label="Оставить последнюю ставку"
                  value="Оставить последнюю ставку"
                ></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn
          variant="tonal"
          color="red"
          class="ml-7"
          size="default"
          @click="deleteCampaign(props.campaign._id, true)"
          v-if="!deleteStatus"
          >Удалить</v-btn
        >
        <v-btn
          variant="tonal"
          class="ml-7"
          size="default"
          @click="deleteCampaign(props.campaign._id, false)"
          v-if="deleteStatus"
          >Отмена</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn variant="tonal" class="mr-7" size="default" @click="adjustCampgain(campaign?._id)">
          Сохранить</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
