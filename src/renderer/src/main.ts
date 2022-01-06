import path from 'path';
import fs from 'fs';
import { createApp } from 'vue';
import App from './App.vue';
import electron, { ipcRenderer } from 'electron';
import datastore from './datastore';
import router from './router';
import { setupNaive } from './plugins';
import { setupStore } from './store';
// import './css/normalize.css'
// import './css/skeleton.css'

const app = createApp(App);
app.use(datastore).use(setupStore);
app.use(router).use(setupNaive).mount('#app').$nextTick(window.bridge.removeLoading);
console.log('process ', process.type);

console.log(electron, ipcRenderer, path, fs);
