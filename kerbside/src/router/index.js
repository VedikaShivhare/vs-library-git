import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

// Starting point: just the Home route. Browse Map, Post an Item, and the
// role-restricted areas from the A1.1 sitemap are added incrementally in
// later commits as each is actually built, rather than stubbed out ahead
// of time.
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
  ],
})

export default router
