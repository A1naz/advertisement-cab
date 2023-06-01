<script setup>
import { email, helpers, minLength, required } from "@vuelidate/validators";
const { status, data, signIn, signOut } = useAuth();
const $router = useRouter();

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/profile",
  },
  title: "Вход",
});

console.log(status);

const form = reactive({
  email: "",
  password: "",
});

const rules = {
  email: {
    required: helpers.withMessage("Введите email", required),
    email: helpers.withMessage("Введите корректный email", email),
  },
  password: {
    required: helpers.withMessage("Введите пароль", required),
    minLength: helpers.withMessage("Пароль должен быть длиннее 6 символов", minLength(6)),
  },
};

const v$ = useVuelidate(rules, form);
async function submit() {
  const result = await v$.value.$validate();
  if (!result) return;
  const { error, url } = await signIn("credentials", {
    redirect: false,
    callbackUrl: "/profile",
    email: form.email,
    password: form.password,
  });
  if (error) {
    notify({
      title: "Ошибка входа",
      text: error,
    });
  } else {
    return navigateTo(url, { external: true });
  }
}
const show1 = ref(false);
</script>

<template>
  <VContainer fluid class="fill-height">
    <VRow no-gutters align="center" justify="center" class="fill-height">
      <VCol cols="12" md="6" lg="5" sm="6">
        <VRow no-gutters align="center" justify="center">
          <VCol cols="12" md="6">
            <h1>Вход</h1>

            <VForm class="mt-7" @submit.prevent="submit">
              <div class="mt-1">
                <label class="label text-grey-darken-2" for="email">Email</label>
                <VTextField
                  id="email"
                  v-model="form.email"
                  :error-messages="v$.email.$errors.map((e) => e.$message)"
                  prepend-inner-icon="fluent:mail-24-regular"
                  name="email"
                  type="email"
                  @update:model-value="v$.email.$touch"
                  @blur="v$.email.$touch"
                />
              </div>
              <div class="mt-1">
                <label class="label text-grey-darken-2" for="password">Пароль</label>
                <VTextField
                  id="password"
                  v-model="form.password"
                  :error-messages="v$.password.$errors.map((e) => e.$message)"
                  name="password"
                  :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  prepend-inner-icon="fluent:password-20-regular"
                  @click:append-inner="show1 = !show1"
                  :type="show1 ? 'text' : 'password'"
                  @update:model-value="v$.password.$touch"
                  @blur="v$.password.$touch"
                />
              </div>
              <div class="mt-5">
                <VBtn type="submit" block min-height="44" class="gradient bg-primary"> Войти </VBtn>
              </div>
            </VForm>
            <p class="text-body-2 mt-10">
              <NuxtLink to="/reset-password" class="font-weight-bold text-primary">
                Забыли пароль?
              </NuxtLink>
            </p>
            <p class="text-body-2 mt-4">
              <span
                >Еще не зарегистрированы?
                <NuxtLink to="/signup" class="font-weight-bold text-primary"
                  >Регистрация</NuxtLink
                ></span
              >
            </p>
          </VCol>
        </VRow>
      </VCol>
      <VCol class="hidden-md-and-down fill-height" md="6" lg="7">
        <VImg
          src="https://wallpaper.dog/large/5557744.jpg"
          cover
          class="h-100 rounded-xl d-flex align-center justify-center"
        >
          <div class="text-center w-50 text-white mx-auto">
            <h2 class="mb-4">Start your journey today</h2>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Asperiores, inventore quia.
              Dolorum dolores ad ipsum voluptatum rem, hic placeat, odio, odit numquam quod
              veritatis accusantium assumenda! Sequi, provident in! Iure!
            </p>
          </div>
        </VImg>
      </VCol>
    </VRow>
  </VContainer>
</template>
