import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/style.css'

import { createApp } from 'vue'
import { initializeApp } from 'firebase/app'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import App from './App.vue'
import router from './router'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCzb1QhrYuJwmuI7jxkbWq6d4oy_Sls0PE',
  authDomain: 'fit5032-6e8e6.firebaseapp.com',
  projectId: 'fit5032-6e8e6',
  storageBucket: 'fit5032-6e8e6.firebasestorage.app',
  messagingSenderId: '144821261707',
  appId: '1:144821261707:web:95afebf40808280d2e4b8e'
}

// Initialise Firebase
initializeApp(firebaseConfig)

const app = createApp(App)
app.use(PrimeVue, { theme: { preset: Aura } })
app.use(router)
app.mount('#app')
