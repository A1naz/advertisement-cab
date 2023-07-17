<script lang="ts" setup>
import { onMounted, ref } from "vue";
const userStore = useUserStore();
const config = useRuntimeConfig();

const props = defineProps({
  mode: {
    type: String,
    required: true,
    validator(value: string) {
      return ["callback", "redirect"].includes(value);
    },
  },
});
const emit = defineEmits(["callback"]);
const { signIn } = useAuth();
const bot_id = "6344667744";
const bot_login = "wbPromotion_authBot";

async function onTelegramAuth(user: any) {
  const { error, url } = await signIn("telegram-login", {
    ...user,
    redirect: false,
    callbackUrl: "/profile",
  });

  if (error) {
    console.log(error);
  } else {
    // No error, continue with the sign in, e.g., by following the returned redirect:
    userStore.getClient();
    return navigateTo(url, { external: true });
  }
}

const telegram = ref();

function login() {
  const telegramLogin = bot_login;
  // @ts-expect-error window global var
  window.Telegram.Login.auth({ bot_id, request_access: true }, (data: any) => {
    if (!data) {
      // user cancelled login
      return;
    }

    onTelegramAuth(data);
  });
}
onMounted(() => {
  // create script with given params
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://telegram.org/js/telegram-widget.js";

  // script.setAttribute('data-size', props.size);
  script.setAttribute("async", "true");
  // script.setAttribute('data-userpic', props.userpic);
  // script.setAttribute('data-telegram-login', props.telegramLogin);
  // script.setAttribute('data-request-access', props.requestAccess);
  // if (props.radius) {
  //   script.setAttribute('data-radius', props.radius);
  // }

  if (props.mode === "callback") {
    // @ts-expect-error workaround
    window.onTelegramAuth = onTelegramAuth;
    script.setAttribute("data-onauth", "window.onTelegramAuth(user)");
  } else {
    // script.setAttribute('data-auth-url', props.redirectUrl);
  }
  telegram.value.appendChild(script);
});
</script>

<template>
  <div ref="telegram" class="w-full flex justify-center">
    <v-btn class="mt-1" @click="login" variant="outlined" color="blue" block min-height="44">
      <template v-slot:prepend>
        <v-icon style="font-size: 22px" class="mt-0.5 mr-1">logos:telegram</v-icon>
      </template>
      Войти через Telegram
    </v-btn>
  </div>
</template>

<style></style>
