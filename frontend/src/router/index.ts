import { createApp } from 'vue';
import App from '../App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (localStorage.getItem('eventsActivities') && to.path !== '/events/create' && to.path !== '/events/create/' && to.path !== '/activities/create' && to.path !== '/activities/create/') {
    window.dispatchEvent(new CustomEvent('showConfirmModal'));
  }
  next();
});

const app = createApp(App);
app.use(router);

export default router;
