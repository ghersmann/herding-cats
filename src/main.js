import '@/assets/reset.css'
import '@/assets/global.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerLicense } from '@syncfusion/ej2-base'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
registerLicense(
  'Ngo9BigBOggjHTQxAR8/V1NBaF5cWWNCe0x0Rnxbf1x0ZFNMYVpbRHBPMyBoS35RckVnW3xednVTRWFdUkRz'
)

app.mount('#app')
