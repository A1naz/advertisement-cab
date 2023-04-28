<script setup>
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/',
  },
  layout: ''
});
</script>

<template>
  <div>
    <AuthForm />
  </div>
</template>

<style></style>
