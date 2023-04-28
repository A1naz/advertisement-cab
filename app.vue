<script>
import { useNotification } from '@kyvg/vue3-notification'

const { notify } = useNotification()
</script>

<template>
  <div>
    <SeoKit />
    <notifications position="bottom right">
      <template #body="props">
        <div style="padding: 1rem">
          <div class="notify-card">
            <p class="notify-title">
              {{ props.item.title }}
            </p>
            <div class="notify-text" v-html="props.item.text" />
          </div>
        </div>
      </template>
    </notifications>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
.notify-text {
  font-size: 0.9rem;
  font-weight: 400;
  margin-bottom: 0.5rem;
  color: gray
}

.notify-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: white
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
