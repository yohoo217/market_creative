import { defineNuxtPlugin } from '#app'
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Card from 'primevue/card'
import FileUpload from 'primevue/fileupload'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Password from 'primevue/password'
import Avatar from 'primevue/avatar'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import ProgressSpinner from 'primevue/progressspinner'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, {
    ripple: true,
    inputStyle: "outlined",
    pt: {
      dialog: {
        root: { class: 'rounded-lg shadow-lg border-0' },
        header: { class: 'p-6 bg-white rounded-t-lg' },
        content: { class: 'p-6 bg-white' },
        footer: { class: 'p-4 bg-white rounded-b-lg border-t border-gray-200' }
      },
      button: {
        root: { class: 'font-semibold' }
      },
      password: {
        root: { class: 'w-full' },
        input: { class: 'w-full' }
      }
    }
  })

  // 註冊 Toast 服務
  nuxtApp.vueApp.use(ToastService)

  // 註冊元件
  nuxtApp.vueApp.component('Button', Button)
  nuxtApp.vueApp.component('InputText', InputText)
  nuxtApp.vueApp.component('Card', Card)
  nuxtApp.vueApp.component('FileUpload', FileUpload)
  nuxtApp.vueApp.component('Dialog', Dialog)
  nuxtApp.vueApp.component('DataTable', DataTable)
  nuxtApp.vueApp.component('Column', Column)
  nuxtApp.vueApp.component('Password', Password)
  nuxtApp.vueApp.component('Avatar', Avatar)
  nuxtApp.vueApp.component('Toast', Toast)
  nuxtApp.vueApp.component('ProgressSpinner', ProgressSpinner)
})