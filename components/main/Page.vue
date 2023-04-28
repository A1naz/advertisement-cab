<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import { useUserStore } from '~/stores/userStore';

const { status, data, signIn, signOut } = useAuth();
const store = useUserStore();
const headers = useRequestHeaders(['cookie']) as HeadersInit;
const isActive = computed(() => {
  if (
    form.firstName === store.client?.firstName &&
    form.lastName === store.client?.lastName &&
    form.email === store.client?.email &&
    form.userName === store.client?.userName
  ) {
    return true;
  } else {
    return false;
  }
});

async function handleSignOut() {
  await signOut();
}

const show = (severity: any, summary: string, detail: string) => {
  toast.add({
    severity: severity,
    summary: summary,
    detail: detail,
    life: 3000,
  });
};

onMounted(async () => {
  await store.getClient();

  form.firstName = store.client?.firstName || '';
  form.lastName = store.client?.lastName || '';
  form.email = store.client?.email || '';
  form.userName = store.client?.userName || '';

  updateInitital();
});

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  userName: '',
});

const initialForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  username: '',
});

const items = ref([
  { separator: true },
  { label: 'Profile', icon: 'pi pi-fw pi-user' },
  { label: 'Settings', icon: 'pi pi-fw pi-cog' },
  { separator: true },
]);

const toast = useToast();

function updateInitital() {
  initialForm.firstName = store.client?.firstName || '';
  initialForm.lastName = store.client?.lastName || '';
  initialForm.email = store.client.email;
  initialForm.username = store.client?.username || '';
}

async function update() {
  if (
    form.firstName === store.client.firstName &&
    form.lastName === store.client.lastName &&
    form.email === store.client.email &&
    form.userName === store.client.userName
  ) {
    show('error', 'Измените данные', '');
    return;
  }

  const { data, error } = await useFetch('/api/users/update', {
    method: 'POST',
    body: form,
    headers,
  });
  if (error.value) {
    console.log(error.value);
    show('error', error.value.message, '');
  } else {
    show('success', 'Данные обновлены', '');

    await store.getClient();
    updateInitital();
  }
}
</script>

<template>
  <Toast />
  <div class="flex items-center justify-center">
    <div class="profile">
      <div class="bg-white overflow-hidden shadow rounded-lg border">
        <div class="px-4 py-5 sm:px-2">
          <div class="avatar flex flex-row justify-between">
            <h3 class="text-lg font-medium px-4 text-gray-900">Профиль</h3>
            <Avatar
              icon="pi pi-user"
              class="flex flex-row mr-2"
              size="xlarge"
              shape="circle"
            />
          </div>
          <p class="mt-4 max-w-2xl text-sm px-5 text-gray-500 flex flex-row">
            Информация о профиле
          </p>
        </div>

        <div class="info">
          <div class="border-t border-gray-200 w-full">
            <dl class="divide-y divide-gray-200 my-12 mx-12 sm:mx-24">
              <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm mt-2 font-medium text-gray-500">Email</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <InputText id="email" v-model="form.email" />
                </dd>
              </div>

              <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm mt-2 font-medium text-gray-500">Логин</dt>
                <dd class="mb-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <InputText id="username" v-model="form.userName" />
                </dd>
              </div>

              <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm mt-2 font-medium text-gray-500">Имя</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <InputText id="firstName" v-model="form.firstName" />
                </dd>
              </div>

              <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm mt-2 font-medium text-gray-500">Фамилия</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <InputText id="lastName" v-model="form.lastName" />
                </dd>
              </div>

              <div class="py-3 sm:py-5 sm:gap-4 sm:px-6">
                <dd class="mt-1 text-gray-900 sm:mt-0">
                  <div class="flex flex-col">
                    <Button
                      label="Сохранить изменения"
                      :disabled="isActive"
                      @click="update"
                    />
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
