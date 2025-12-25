import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'
import ConfirmationService from 'primevue/confirmationservice'

import 'primeicons/primeicons.css'

// PrimeVue components
import ConfirmDialog from 'primevue/confirmdialog'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import Menu from 'primevue/menu'
import Toast from 'primevue/toast'
import Chart from 'primevue/chart'
import DataTable from 'primevue/datatable' // ✅
import Column from 'primevue/column' // ✅

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.app-dark',
    },
  },
})

app.directive('tooltip', Tooltip)
app.use(ToastService)
app.use(ConfirmationService)

// Global components
app.component('ConfirmDialog', ConfirmDialog)
app.component('Dialog', Dialog)
app.component('Button', Button)
app.component('InputText', InputText)
app.component('InputNumber', InputNumber)
app.component('Textarea', Textarea)
app.component('Dropdown', Dropdown)
app.component('Menu', Menu)
app.component('Toast', Toast)
app.component('DataTable', DataTable) // ✅
app.component('Column', Column) // ✅

app.use(router)
app.mount('#app')
