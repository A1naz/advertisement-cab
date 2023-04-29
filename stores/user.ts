import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    client: {} as any,
  }),

  actions: {
    async getClient() {
      const { $client } = useNuxtApp()
    },

    setClient(client: object) {
      this.client = client
    },
    reset() {},
  },
})
