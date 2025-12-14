import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'  // Import Pinia
import App from './App.vue'
import router from './router'

console.log('🚀 Starting Vue app...')

const app = createApp(App)
const pinia = createPinia()  // Create Pinia instance

// Use Pinia before router
app.use(pinia)
app.use(router)

// Mount the app
app.mount('#app')

console.log('✅ App mounted with Pinia & Router')