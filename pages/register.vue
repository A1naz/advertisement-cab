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
    <AuthReg />
  </div>
</template>
