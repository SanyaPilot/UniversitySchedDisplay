// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/today' },
  { path: '/today', name: 'today', component: () => import('@/views/Today.vue') },
  { path: '/all', name: 'all', component: () => import('@/views/All.vue') },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
