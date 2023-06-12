import { acceptHMRUpdate, defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
  const client = ref<any>({});
  const isClientAdvanced = ref(false);

  async function getClient() {
    const { $client }: any = useNuxtApp();
    const { user } = await $client.user.client.query();
    client.value = user;
    if (client.value.tariffs) {
      isClientAdvanced.value = client.value.tariffs[1].active === true ? true : false;
    }
  }

  function setClient(newClient: object) {
    client.value = newClient;
  }
  return {
    client,
    getClient,
    setClient,
    isClientAdvanced,
  };
});
if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
