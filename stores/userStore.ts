import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    client: {} as any,
  }),

  actions: {
    async getClient() {
      const { data } = await useFetch('/api/users/user', {
        headers: useRequestHeaders(['cookie']) as HeadersInit,
      });
      const client = data.value?.client;
      this.setClient(client as object);
    },

    setClient(client: object) {
      this.client = client;
    },
    reset() {},
  },
});
