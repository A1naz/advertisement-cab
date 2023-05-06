import { acceptHMRUpdate, defineStore } from "pinia";

export const useCabinetStore = defineStore("cabinet", () => {
  const cabinets = ref<any>([]);

  async function getCabinets() {
    const { $client } = useNuxtApp();
    const cabs = await $client.cabinet.cabinets.query();
    cabinets.value = cabs;
    
  }

  return {
    cabinets,
    getCabinets,
  };
});
if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useCabinetStore, import.meta.hot));
