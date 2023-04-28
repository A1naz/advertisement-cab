<script setup>
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/',
  },
  layout: '',
});
</script>
<template>
  <div>
    <AuthPassword />
  </div>
</template>
