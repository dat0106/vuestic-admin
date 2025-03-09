import './scss/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n'
import { createVuestic } from 'vuestic-ui'
import { createGtm } from '@gtm-support/vue-gtm'

import stores from './stores'
import router from './router'
import vuesticGlobalConfig from './services/vuestic-ui/global-config'

// Import the functions you need from the SDKs you need
// import firebase from 'firebase/app'
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: 'AIzaSyCzctPRXzqvwqM57W-SOh2B3J3lwdVJuGQ',
//   authDomain: 'chatbot-98eb0.firebaseapp.com',
//   projectId: 'chatbot-98eb0',
//   storageBucket: 'chatbot-98eb0.firebasestorage.app',
//   messagingSenderId: '119527367765',
//   appId: '1:119527367765:web:a2fab121e75a26a390e0dc',
//   measurementId: 'G-HQW7XPL69G',
// }
// Initialize Firebase
// firebase.initializeApp(firebaseConfig)

const app = createApp(App)

app.use(stores)
app.use(router)
app.use(i18n)
app.use(createVuestic({ config: vuesticGlobalConfig }))

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
