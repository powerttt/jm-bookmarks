import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

// import HelloWorld from "./components/HelloWorld.vue"
import Bookmarks from '../views/bookmarks/index.vue';
// import WebDavTest from '../views/test/webdav.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: '/',
    component: Bookmarks,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
export default router;
