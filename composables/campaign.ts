import { acceptHMRUpdate, defineStore } from "pinia";

export const useCampaignStore = defineStore("campaign", () => {
  const campaigns = ref<any>([]);
  const sortedCampaigns = ref<any>([]);
  const sortedAndSeachedCampaigns = ref<any>([]);
  const items = ref<any>([]);
  const categories = ref<any>([]);
  const itemsByCategory = ref<any>([]);

  async function getCampaigns() {
    const { $client } = useNuxtApp();
    const camps: any = await $client.campaign.campaigns.query();

    items.value = camps.items;
    campaigns.value = camps.campaigns;
    sortedCampaigns.value = campaigns.value;
    sortedAndSeachedCampaigns.value = sortedCampaigns.value;
    items.value.forEach((el: any) => {
      {
        if (!categories.value.includes(el.category)) {
          categories.value.push(el.category);
        }
      }
    });
  }

  function sortItemsByCategory(value: string) {
    itemsByCategory.value = [];
    items.value.forEach((el: any) => {
      if (el.category === value) {
        el.nms.forEach((elem: any) => {
          itemsByCategory.value.push(elem);
        });
      }
    });
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
    items,
    campaigns,
    sortedCampaigns,
    categories,
    itemsByCategory,
    getCampaigns,
    sortCampaigns,
    searchCampaign,
    sortedAndSeachedCampaigns,
    sortItemsByCategory,
  };
});
if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useCampaignStore, import.meta.hot));
