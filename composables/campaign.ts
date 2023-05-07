import { acceptHMRUpdate, defineStore } from "pinia";

export const useCampaignStore = defineStore("campaign", () => {
  const campaigns = ref<any>([]);

  async function getCampaigns() {
    const { $client } = useNuxtApp();
    const camps = await $client.cabinet.cabinets.query();
    campaigns.value = camps;
  }

  return {
    campaigns,
    getCampaigns,
  };
});
if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useCampaignStore, import.meta.hot));
