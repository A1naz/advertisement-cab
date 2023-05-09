import { acceptHMRUpdate, defineStore } from "pinia";

export const useCampaignStore = defineStore("campaign", () => {
  const campaigns = ref<any>([]);
  const sortedCampaigns = ref<any>([]);
  const sortedAndSeachedCampaigns = ref<any>([]);

  async function getCampaigns() {
    const { $client } = useNuxtApp();
    const camps = await $client.campaign.campaigns.query();
    campaigns.value = camps;
    sortedCampaigns.value = camps;
    sortedAndSeachedCampaigns.value = sortedCampaigns.value;
  }

  function searchCampaign(searchValue: string) {
    sortedAndSeachedCampaigns.value = sortedCampaigns.value;

    sortedAndSeachedCampaigns.value = sortedAndSeachedCampaigns.value.filter((el: any) =>
      el.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      el.advertId.toString().includes(searchValue.toString()) ||
      searchValue == ""
        ? el
        : null
    );
  }

  function sortCampaigns(label: string) {
    if (label === "Все") {
      sortedCampaigns.value = campaigns.value;
      sortedAndSeachedCampaigns.value = sortedCampaigns.value;
    }

    if (label === "Активные") {
      sortedCampaigns.value = campaigns.value;
      sortedCampaigns.value = sortedCampaigns.value.filter((el: any) =>
        el.status === 9 ? el : null
      );
      sortedAndSeachedCampaigns.value = sortedCampaigns.value;
    }

    if (label === "Приостановленные") {
      sortedCampaigns.value = campaigns.value;
      sortedCampaigns.value = sortedCampaigns.value.filter((el: any) =>
        el.status === 11 ? el : null
      );
      sortedAndSeachedCampaigns.value = sortedCampaigns.value;
    }

    if (label === "Архив") {
      sortedCampaigns.value = campaigns.value;
      sortedCampaigns.value = sortedCampaigns.value.filter((el: any) =>
        el.status === 7 ? el : null
      );
      sortedAndSeachedCampaigns.value = sortedCampaigns.value;
    }

    if (label === "Дневной лимит") {
      sortedCampaigns.value = campaigns.value;
      sortedCampaigns.value = sortedCampaigns.value.filter((el: any) =>
        el.isTurnOn === true && el.dailyBudget == 0 ? el : null
      );
      sortedAndSeachedCampaigns.value = sortedCampaigns.value;
    }

    if (label === "Под управлением") {
      sortedCampaigns.value = campaigns.value;
      sortedCampaigns.value = sortedCampaigns.value.filter((el: any) =>
        el.isTurnOn === true ? el : null
      );
      sortedAndSeachedCampaigns.value = sortedCampaigns.value;
    }
  }

  return {
    campaigns,
    sortedCampaigns,
    getCampaigns,
    sortCampaigns,
    searchCampaign,
    sortedAndSeachedCampaigns,
  };
});
if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useCampaignStore, import.meta.hot));
