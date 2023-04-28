<template >
    <div ref="app">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
</template>
<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease-in-out;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s linear;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.pop-enter-active,
.pop-leave-active {
  transition: transform 0.4s cubic-bezier(0.5, 0, 0.5, 1), opacity 0.4s linear;
}
.pop-enter,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.3) translateY(-50%);
}
.page-enter-active,
.page-leave-active {
  transition: all 0.1s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(0.1rem);
}
</style>
