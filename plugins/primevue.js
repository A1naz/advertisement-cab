import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import Menu from 'primevue/menu';
import Password from 'primevue/password';
import Sidebar from 'primevue/sidebar';
import Tree from 'primevue/tree'
import Avatar from 'primevue/avatar'

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.use(PrimeVue, { ripple: true })
    nuxtApp.vueApp.use(ToastService)
    nuxtApp.vueApp.component('Button', Button)
    nuxtApp.vueApp.component('InputText', InputText)
    nuxtApp.vueApp.component('Toast', Toast)
    nuxtApp.vueApp.component('Menu', Menu)
    nuxtApp.vueApp.component('Password', Password)
    nuxtApp.vueApp.component('SideBar', Sidebar)
    nuxtApp.vueApp.component('Tree', Tree)
    nuxtApp.vueApp.component('Avatar', Avatar)

    //other components that you need
})