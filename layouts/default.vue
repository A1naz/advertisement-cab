<script setup>
const visible = ref(false);
const route = useRoute();
const closeIcon = ref(false);

const { status, data, signIn, signOut } = useAuth();

async function handleSignOut() {
  await signOut();
}

const selectedKey = ref(null);
const checked = ref(false);
const nodes = ref([
  {
    key: '0',
    label: 'Профиль',
  },
  {
    key: '1',
    label: 'Статистика',
  },
  {
    key: '2',
    label: 'Аналитика',
  },
]);
</script>

<template>
  <div class="DefaulLayout">
    <!-- default root -->
    <SideBar
      v-model:visible="visible"
      class="border-collapse sm:w-16"
      v-model:showCloseIcon="closeIcon"
    >
      <div class="card flex flex-column justify-between h-full">
        <Toast />
        <Tree
          v-model:selectionKeys="selectedKey"
          :value="nodes"
          selectionMode="single"
          class="w-full"
        ></Tree>
        <Button
          class="mt-4 px-14 w-8"
          label="Выйти"
          severity="info"
          @click="handleSignOut"
          icon="pi pi-sign-out"
        />
      </div>
      
        
   
    </SideBar>
    <Button icon="pi pi-align-justify" @click="visible = true" />
  </div>
  <div>
    <slot />
  </div>
</template>
