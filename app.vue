<script setup lang="ts">
import { useNotification } from "@kyvg/vue3-notification";
import { useTheme } from "vuetify";
const theme = useTheme();
const userStore = useUserStore();
const { status } = useAuth();
let client = userStore.client;
const campaignStore = useCampaignStore();

if (status.value === "authenticated") await userStore.getClient();
if (status.value === "authenticated" && client.apiKeyAdvertisement) {
  campaignStore.updateCabinet();
  campaignStore.getCampaigns();
}
const { notify } = useNotification();
</script>

<template>
  <div>
    <SeoKit />
    <notifications position="top right">
      <template #body="props">
        <div style="margin: 0.5rem">
          <v-alert
            border
            :text="props.item.text"
            :type="props.item.type"
            closable
            :title="props.item.title"
          />
        </div>
      </template>
    </notifications>
    <NuxtLayout>
      <NuxtLoadingIndicator />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
.notify-text {
  font-size: 0.9rem;
  font-weight: 400;
  margin-bottom: 0.5rem;
  color: gray;
}

.notify-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: white;
}

.notify-card {
  padding: 1rem;
  background-color: #121212;
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  width: 300px;
  max-width: 100%;
}
</style>
