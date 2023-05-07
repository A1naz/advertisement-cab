import { acceptHMRUpdate, defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const client = ref<any>({})

  async function getClient() {
    const { $client } = useNuxtApp()
    const { user } = await $client.user.client.query()
    client.value = user
    
  }

  function setClient(newClient: object) {
    client.value = newClient
  }
  return {
    client,
    getClient,
    setClient,
  }
})
if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
