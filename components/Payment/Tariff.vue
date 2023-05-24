<script setup lang="ts">
import { useTheme } from "vuetify";
const theme = useTheme();
const dialog = ref(false);
const LKColor = computed(() => {
  if (theme.global.name.value == "myCustomLightTheme") {
    return "blue-grey-darken-3";
  } else {
    return "blue-grey-lighten-5";
  }
});

const selectedDate = ref(1);
const sale = ref(0.1);
const price = ref(3900);
const tickLabels = ref<any>({
  0: "1 мес.",
  1: "3 мес.",
  2: "6 мес.",
});
const priceWithSale = ref(
  price.value *
    (1 - sale.value * selectedDate.value) *
    Number(tickLabels.value[selectedDate.value][0])
);

function calculatePrice() {
  priceWithSale.value =
    price.value *
    (1 - sale.value * selectedDate.value) *
    Number(tickLabels.value[selectedDate.value][0]);
}
</script>
<template>
  <div>
    <v-btn
      @click.stop
      size="x-small"
      @click="dialog = true"
      :color="LKColor"
      :min-width="190"
      block
      variant="tonal"
    >
      Текущий тариф
    </v-btn>
  </div>
  <div>
    <v-dialog tabindex="0" v-model="dialog" width="800" transition="fade-transition">
      <template v-slot:activator="{ props }"> </template>

      <v-card>
        <v-card-title class="text-sm">
          <v-row class="flex justify-center">
            <v-col>Наши тарифы</v-col>
            <v-col class="text-end">
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
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-card title="Основной" subtitle="До 100 рекламных кампаний в управлении">
                <v-card-text>
                  Цена {{ priceWithSale }} ₽/ {{ tickLabels[selectedDate]
                  }}<v-chip rounded class="ma-2" color="green" text-color="white">
                    - {{ sale * selectedDate * 100 }}%
                  </v-chip>
                  <div class="text-lg">
                    {{ priceWithSale / Number(tickLabels[selectedDate][0]) }} ₽/мес.
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn variant="outlined"> Приобрести </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
            <v-col>
              <v-card title="Продвинутый" subtitle="До 100 рекламных кампаний в управлении">
                <v-card-text>
                  Цена {{ priceWithSale }} ₽/ {{ tickLabels[selectedDate]
                  }}<v-chip rounded class="ma-2" color="green" text-color="white">
                    - {{ sale * selectedDate * 100 }}%
                  </v-chip>
                  <div class="text-lg">
                    {{ priceWithSale / Number(tickLabels[selectedDate][0]) }} ₽/мес.
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn variant="outlined"> Приобрести </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <div class="w-full mx-6">
            <v-slider
              transition="hide-on-leave"
              v-model="selectedDate"
              :ticks="tickLabels"
              :max="2"
              step="1"
              show-ticks="always"
              tick-size="5"
              track-size="7"
              @update:modelValue="calculatePrice"
            ></v-slider>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
