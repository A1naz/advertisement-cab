import { acceptHMRUpdate, defineStore } from "pinia";

export const useCampaignStore = defineStore("campaign", () => {
  const campaigns = ref<any>([]);
  const sortedCampaigns = ref<any>([]);
  const sortedAndSeachedCampaigns = ref<any>([]);
  const items = ref<any>([]);
  const categories = ref<any>([]);
  const itemsByCategory = ref<any>([]);
  const sortValue = ref("turnOnOff");
  const { $client }: any = useNuxtApp();
  const isLoading = ref(false);

  async function getCampaigns() {
    isLoading.value = true;
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
    sortByCreateTime();
    isLoading.value = false;
  }

  function sortItemsByCategory(value: string) {
    itemsByCategory.value = [];
    items.value.forEach((el: any) => {
      if (el.category === value && el.category) {
        el.nms.forEach((elem: any) => {
          itemsByCategory.value.push(elem);
        });
      }
    });
  }

  function sortByCreateTime() {
    if (sortValue.value == "ascending") {
      sortedAndSeachedCampaigns.value = sortedAndSeachedCampaigns.value.sort((a: any, b: any) => {
        const aDate = new Date(a.createTime.replace(/^(\d{2})\.(\d{2})\.(\d{4})$/, "$2.$1.$3"));
        const bDate = new Date(b.createTime.replace(/^(\d{2})\.(\d{2})\.(\d{4})$/, "$2.$1.$3"));
        return aDate.getTime() - bDate.getTime();
      });
    }
    if (sortValue.value == "descending") {
      sortedAndSeachedCampaigns.value = sortedAndSeachedCampaigns.value.sort((a: any, b: any) => {
        const aDate = new Date(a.createTime.replace(/^(\d{2})\.(\d{2})\.(\d{4})$/, "$2.$1.$3"));
        const bDate = new Date(b.createTime.replace(/^(\d{2})\.(\d{2})\.(\d{4})$/, "$2.$1.$3"));
        return bDate.getTime() - aDate.getTime();
      });
    }

    if (sortValue.value == "turnOnOff") {
      const on = sortedAndSeachedCampaigns.value.filter((item: any) => item.isAdjusted);
      const off = sortedAndSeachedCampaigns.value.filter((item: any) => !item.isAdjusted);
      sortedAndSeachedCampaigns.value = [...on, ...off];
    }
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

    sortByCreateTime();
  }

  function sortCampaigns(label: string) {
    sortedCampaigns.value = campaigns.value;

    switch (label) {
      case "Активные":
        sortedCampaigns.value = sortedCampaigns.value.filter((el: any) => el.status === 9);
        break;
      case "Приостановленные":
        sortedCampaigns.value = sortedCampaigns.value.filter((el: any) => el.status === 11);
        break;
      case "Архив":
        sortedCampaigns.value = sortedCampaigns.value.filter((el: any) => el.status === 7);
        break;
      case "Дневной лимит":
        sortedCampaigns.value = sortedCampaigns.value.filter(
          (el: any) => el.isTurnOn && el.dailyBudget === 0
        );
        break;
      case "Под управлением":
        sortedCampaigns.value = sortedCampaigns.value.filter((el: any) => el.isTurnOn);
        break;
    }

    sortedAndSeachedCampaigns.value = sortedCampaigns.value;
  }

  async function updateCabinet() {
    isLoading.value = true;
    await $client.cabinet.updateCabinet.query();
    isLoading.value = false;
  }

  return {
    isLoading,
    items,
    sortValue,
    campaigns,
    sortedCampaigns,
    categories,
    itemsByCategory,
    getCampaigns,
    sortCampaigns,
    searchCampaign,
    sortByCreateTime,
    sortedAndSeachedCampaigns,
    sortItemsByCategory,
    updateCabinet,
  };
});
if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useCampaignStore, import.meta.hot));
