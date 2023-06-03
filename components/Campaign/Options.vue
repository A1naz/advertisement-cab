<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useTheme } from "vuetify";
const { $client } = useNuxtApp();
const dialog = ref(false);
const budget = ref("");
const onOff = ref(false);
const targetPosition = ref("");
const dailyBudget = ref("");
const maxBet = ref("");
const firstTime = ref();
const secondTime = ref();
const ifMaxBet = ref("");
const getBet = ref();
const masterPhrase = ref("");
const ifBetEquals = ref("");
const managementType = ref("Мастер-фраза");
const { ruleRequired, rangeRules } = useFormRules();
const campaignStore = useCampaignStore();
const theme = useTheme();
const deleteStatus = ref();
const stats = ref<any>([]);
const loading = ref(false);

const props: any = defineProps({ campaign: Object });

function parseTime(input: string) {
  const groups = input.split("|");

  const timeArrays: any = groups.map((group) =>
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
  maxBet.value = props.campaign.maxBet;
  if (props.campaign.isTurnOn) {
    onOff.value = props.campaign.isTurnOn;
  }
  deleteStatus.value = props.campaign.deleteMark;
  if (props.campaign.masterPhrase) {
    masterPhrase.value = props.campaign.masterPhrase;
  }
  if (props.campaign.managementType) {
    managementType.value = props.campaign.managementType;
  }
  if (props.campaign.showHours) {
    const times = parseTime(props.campaign.showHours);

    if (times[0][0].minutes != undefined) {
      firstTime.value = times[0];
    }

    if (times[1][0].minutes != undefined) {
      secondTime.value = times[1];
    }
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
    ruleRequired(maxBet.value) !== true ||
    (ruleRequired(getBet.value) !== true && ifMaxBet.value === "Выставить ставку") ||
    ruleRequired(ifMaxBet.value) !== true ||
    ruleRequired(ifBetEquals.value) !== true ||
    // ruleRequired(masterPhrase.value) !== true &&
    (props.campaign.type === 6 && ruleRequired(managementType.value) !== true)
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

  if (rangeRules(targetPosition.value) !== true) {
    notify({
      type: "error",
      text: "Некорректная целевая позиция",
    });
    return;
  }

  let timeFirst = "";
  let timeSecond = "";
  if (firstTime.value) {
    timeFirst = fixTime(firstTime.value);
  }
  if (secondTime.value) {
    timeSecond = fixTime(secondTime.value);
  }

  const finalTimes = timeFirst || timeSecond ? `${timeFirst}|${timeSecond}` : "";
  let increaseTo = 0;

  if (ifMaxBet.value === "Выставить ставку") {
    increaseTo = getBet.value;
  }

  const { data, error } = await useAsyncData(() =>
    $client.campaign.adjustCampaign.mutate({
      _id: id,
      budget: Number(budget.value),
      targetPosition: targetPosition.value,
      dailyBudget: Number(dailyBudget.value),
      ifMaxBetDoesntMatch: ifMaxBet.value,
      ifBetEqualsNear: ifBetEquals.value,
      showHours: finalTimes,
      maxBetIncreaseTo: Number(increaseTo),
      maxBet: Number(maxBet.value),
      managementType: managementType.value,
      masterPhrase: masterPhrase.value,
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
    dialog.value = false;
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

function handleInput() {
  targetPosition.value = targetPosition.value.replace(/[^\d-]/g, "");
}

const isSecondTimePickerDisabled = computed(() => {
  if (firstTime.value) {
    return false;
  }
  secondTime.value = "";
  return true;
});

const isMaxBetTextValueRuleEnabled = computed(() => {
  if (ifMaxBet.value === "Выставить ставку") {
    return [ruleRequired];
  }
});

function submitForm() {
  return;
}

const width = ref(props.campaign.type === 6 ? 950 : 630);

function openArticlePage(nm: any) {
  window.open(`https://www.wildberries.ru/catalog/${nm}/detail.aspx`);
}

async function getStatsByPhrase() {
  loading.value = true;
  if (!masterPhrase.value) {
    loading.value = false;
    return;
  }
  const { data, error } = await useAsyncData(() =>
    $client.campaign.statsByPhrase.query(masterPhrase.value)
  );

  if (error.value) {
    loading.value = false;
    notify({ type: "error", text: error.value.message });
  }

  if (data.value) {
    stats.value = data.value;
    loading.value = false;
  }
}
</script>
<template>
  <div>
    <v-dialog v-model="dialog" :width="width" transition="fade-transition">
      <template v-slot:activator="{ props }">
        <div class="flex justify-end md:block">
          <v-btn
            v-bind="props"
            border
            class="text-none mt-3"
            prepend-icon="mdi-cog"
            variant="text"
            rounded
          >
            {{ campaign?.isAdjusted ? "Настроена" : "Не настроена" }} ></v-btn
          >
          <v-switch
            class="mx-3 md:mx-0 md:mb-1"
            density="compact"
            v-model="onOff"
            @update:modelValue="turnOnOff(campaign?._id)"
            :label="onOff === false ? 'выключен' : 'включен'"
            :disabled="campaign?.isAdjusted === false ? true : false"
            color="primary"
            hide-details
          ></v-switch>
        </div>
      </template>
      <v-card>
        <v-form @submit.prevent="submitForm">
          <v-row class="flex justify-center">
            <v-col class="mx-5 mt-3 mb-2">
              <h1>Опции "{{ campaign?.name }}"</h1>
            </v-col>
            <v-col class="text-end mx-5 mt-3 mb-2">
              <v-btn
                class="absolute left-3"
                size="large"
                variant="text"
                icon="mdi-close-thick"
                @click="dialog = false"
                rounded="xl"
              />
            </v-col>
          </v-row>

          <div class="mx-5">
            <v-row>
              <v-col>
                <div></div>
                <h2>Часы показов:</h2>
                <VueDatePicker
                  v-model="firstTime"
                  cancel-text="Отмена"
                  select-text="Выбрать"
                  :dark="theme.global.name.value == 'myCustomDarkTheme' ? true : false"
                  time-picker
                  range
                />
              </v-col>
              <v-col>
                <h2>Часы показов:</h2>
                <VueDatePicker
                  :disabled="isSecondTimePickerDisabled"
                  v-model="secondTime"
                  cancel-text="Отмена"
                  select-text="Выбрать"
                  :dark="theme.global.name.value == 'myCustomDarkTheme' ? true : false"
                  time-picker
                  range
              /></v-col>
            </v-row>

            <v-row>
              <v-col>
                <div class="flex">
                  <v-text-field
                    class="targetPosition mr-1 min-w-375px"
                    type="text"
                    :rules="[rangeRules, ruleRequired]"
                    @input="handleInput"
                    variant="filled"
                    v-model="targetPosition"
                    label="Целевая позиция"
                  ></v-text-field>

                  <v-text-field
                    class="ml-1"
                    type="number"
                    :rules="[ruleRequired]"
                    variant="filled"
                    v-model="budget"
                    label="Бюджет"
                  ></v-text-field>
                </div>
                <div class="flex">
                  <v-text-field
                    class="mr-1"
                    type="number"
                    :rules="[ruleRequired]"
                    variant="filled"
                    v-model="maxBet"
                    label="Макс ставка"
                    prefix="₽"
                  ></v-text-field>
                  <v-text-field
                    class="ml-1"
                    type="number"
                    variant="filled"
                    v-model="dailyBudget"
                    label="Дневной бюджет"
                    prefix="₽"
                  ></v-text-field>
                </div>
              </v-col>
            </v-row>

            <div class="md:flex md:justify-center">
              <div>
                <v-radio-group
                  label="Если макс. ставка не соответствует:"
                  density="compact"
                  class="mx-2"
                  :rules="[ruleRequired]"
                  v-model="ifMaxBet"
                  column
                >
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
                    :rules="isMaxBetTextValueRuleEnabled"
                    v-model="getBet"
                    :disabled="ifMaxBet == 'Выставить ставку' ? false : true"
                    variant="filled"
                    label="Ставка"
                    prefix="₽"
                    size="1"
                    style="margin-bottom: 0"
                    class="max-w-xs mb-5"
                  ></v-text-field>
                </v-radio-group>
              </div>
              <div v-if="props.campaign.type == 6">
                <v-radio-group
                  class="mx-2"
                  :rules="[ruleRequired]"
                  v-model="managementType"
                  label="Тип управления:"
                >
                  <v-radio density="comfortable" label="Мастер-фраза" value="Мастер-фраза">
                  </v-radio>
                  <v-radio
                    disabled
                    density="comfortable"
                    label="Мастер-фраза и плюс-фразы"
                    value="Мастер-фраза и плюс-фразы"
                  ></v-radio>
                  <v-radio
                    disabled
                    density="comfortable"
                    label="Мастер-фраза и все фразы"
                    value="Мастер-фраза и все фразы"
                  ></v-radio>
                </v-radio-group>
              </div>
              <div>
                <v-radio-group
                  class="mx-1"
                  :rules="[ruleRequired]"
                  v-model="ifBetEquals"
                  label="Если ставка равна соседней:"
                >
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
              </div>
            </div>
            <div v-if="props.campaign.type == 6">
              <v-divider />
              <div class="ml-2 mt-1">Мастер фраза</div>
              <v-text-field
                clearable
                clear-icon="mdi-close-circle"
                hide-details
                type="text"
                v-model="masterPhrase"
                variant="filled"
                label="Введите мастер фразу"
                style="margin-bottom: 0"
                class="max-w-sm mx-2 my-2"
                @keyup.enter="getStatsByPhrase"
                :loading="loading"
              >
                <template v-slot:append>
                  <v-icon style="font-size: 30px" class="mb-1" @click="getStatsByPhrase"
                    >mdi-magnify</v-icon
                  >
                </template>
              </v-text-field>

              <v-table class="rounded-lg pt-2 elevation-1 mb-3" density="compact" :height="500">
                <thead>
                  <tr>
                    <th class="text-left">Рекламное место</th>
                    <th class="text-left">Фактическое место</th>
                    <th class="text-center">Товар</th>
                    <th class="text-center">Актуальная ставка</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="stat in stats">
                    <td>{{ stat.advertPlace }}</td>
                    <td class="text-center">
                      {{ stat.factPosition }}
                    </td>
                    <td>
                      <v-img
                        class="ml-auto mr-auto my-2"
                        @click="openArticlePage(stat.nmId)"
                        :width="38"
                        :src="findImage(stat.nmId)"
                      >
                        <template v-slot:placeholder>
                          <div class="d-flex align-center justify-center fill-height">
                            <v-progress-circular
                              color="indigo-darken-2"
                              indeterminate
                            ></v-progress-circular>
                          </div>
                        </template>
                        <v-tooltip
                          activator="parent"
                          transition="fade-transition"
                          location="right"
                          >{{ stat.nmId }}</v-tooltip
                        >
                      </v-img>
                    </td>

                    <td class="text-center">{{ stat.cpm }}</td>
                    <td class="text-center">{{ stat.wbCpm }}</td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </div>
          <div class="btns" v-if="props.campaign.type != 6">
            <v-btn
              variant="tonal"
              color="red"
              size="default"
              @click="deleteCampaign(props.campaign._id, true)"
              v-if="!deleteStatus"
              class="ml-4"
              >Удалить</v-btn
            >
            <v-btn
              variant="tonal"
              size="default"
              class="ml-4"
              @click="deleteCampaign(props.campaign._id, false)"
              v-if="deleteStatus"
              >Отмена</v-btn
            >
            <v-btn
              variant="tonal"
              class="ml-4"
              type="submit"
              size="default"
              @click="adjustCampgain(campaign?._id)"
            >
              Сохранить</v-btn
            >
          </div>
          <div class="btns-6" v-if="props.campaign.type == 6">
            <v-btn
              color="red-accent-2"
              size="default"
              @click="deleteCampaign(props.campaign._id, true)"
              v-if="!deleteStatus"
              class="ml-4"
              >Удалить</v-btn
            >
            <v-btn
              size="default"
              class="ml-4"
              @click="deleteCampaign(props.campaign._id, false)"
              v-if="deleteStatus"
              >Отмена</v-btn
            >
            <v-btn class="ml-4" type="submit" size="default" @click="adjustCampgain(campaign?._id)">
              Сохранить</v-btn
            >
          </div>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>
<style>
.v-input__details {
  min-height: 0;
}

.targetPosition {
  min-width: 49%;
}

@media (min-width: 801px) {
  .btns {
    position: fixed;
    left: 27%;
    bottom: 5px;
  }

  .btns-6 {
    position: fixed;
    left: 34%;
    bottom: 5px;
  }
}

@media (max-width: 800px) {
  .btns {
    position: flex;
    text-align: center;
    margin-bottom: 10px;
  }

  .btns-6 {
    position: flex;
    text-align: center;
    margin-bottom: 10px;
  }
}

.dp__theme_dark {
  --dp-background-color: #312d4b;
  --dp-text-color: #ffffff;
  --dp-hover-color: #484848;
  --dp-hover-text-color: #ffffff;
  --dp-hover-icon-color: #959595;
  --dp-primary-color: #ae81fd;
  --dp-primary-text-color: #ffffff;
  --dp-secondary-color: #a9a9a9;
  --dp-border-color: #2d2d2d;
  --dp-menu-border-color: #2d2d2d;
  --dp-border-color-hover: #aaaeb7;
  --dp-disabled-color: #737373;
  --dp-scroll-bar-background: #212121;
  --dp-scroll-bar-color: #484848;
  --dp-success-color: #00701a;
  --dp-success-color-disabled: #428f59;
  --dp-icon-color: #959595;
  --dp-danger-color: #e53935;
  --dp-highlight-color: rgba(0, 92, 178, 0.2);
}
</style>
