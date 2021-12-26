import path from 'path'
import fs from 'fs'
import { createApp } from 'vue'
import App from './App.vue'
import electron, { ipcRenderer } from 'electron'
import datastore from './datastore'
import router from './router'
import {
    // create naive ui
    create,
    // component
    NButton, NUpload, NDialogProvider, NMessageProvider, NNotificationProvider,
    NTree, NLayout, NLayoutSider, NMenu, NScrollbar, NGrid, NGridItem, NDivider,
    NDropdown,
} from 'naive-ui'

import './css/normalize.css'
import './css/skeleton.css'
const naive = create({
    components: [NButton, NUpload, NDialogProvider, NMessageProvider,
        NNotificationProvider, NTree, NLayout, NLayoutSider, NMenu,
        NScrollbar, NGrid, NGridItem, NDivider, NDropdown,
    ]
})
// import Qui from '@qvant/qui-max';
// import '@qvant/qui-max/styles';

createApp(App)
    // .use(Qui)
    .use(naive)
    .use(router)
    .use(datastore)
    .mount('#app').$nextTick(window.bridge.removeLoading)


console.log("process ", process.type)

console.log(electron, ipcRenderer, path, fs)
