import './scss/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n'
import { createVuestic } from 'vuestic-ui'
import { createGtm } from '@gtm-support/vue-gtm'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import stores from './stores'
import router from './router'
import vuesticGlobalConfig from './services/vuestic-ui/global-config'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

library.add(faGoogle)
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCzctPRXzqvwqM57W-SOh2B3J3lwdVJuGQ',
  authDomain: 'chatbot-98eb0.firebaseapp.com',
  projectId: 'chatbot-98eb0',
  storageBucket: 'chatbot-98eb0.firebasestorage.app',
  messagingSenderId: '119527367765',
  appId: '1:119527367765:web:a2fab121e75a26a390e0dc',
  measurementId: 'G-HQW7XPL69G',
}
// Initialize Firebase
initializeApp(firebaseConfig)

const auth = getAuth()

onAuthStateChanged(auth, (user) => {
  if (user) {
    // Người dùng đã đăng nhập
    console.log('User is signed in:', user)
  } else {
    // Người dùng chưa đăng nhập
    console.log('No user is signed in.')
  }
})
const app = createApp(App)

stores.use(piniaPluginPersistedstate)
app.use(stores)
app.use(router)
app.use(i18n)
app.use(createVuestic({ config: vuesticGlobalConfig }))
app.component('FontAwesomeIcon', FontAwesomeIcon)
if (import.meta.env.VITE_APP_GTM_ENABLED) {
  app.use(
    createGtm({
      id: import.meta.env.VITE_APP_GTM_KEY,
      debug: false,
      vueRouter: router,
    }),
  )
}

app.mount('#app')
