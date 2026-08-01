import { createApp } from 'vue';
import App from './App.vue';
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import router from './router';

import './assets/main.css';
import './assets/chords.css';

import { DEFAULT_TITLE } from './constants.js';

document.title = DEFAULT_TITLE;

const app = createApp(App);

app.use(router);

app.use(Toast, {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnHover: true,
})

app.mount('#app');
