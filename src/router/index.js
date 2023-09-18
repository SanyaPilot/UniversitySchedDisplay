// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/day/0' },
  { path: '/day/:offset', name: 'day', component: () => import('@/views/Day.vue') },
  { path: '/all', name: 'all', component: () => import('@/views/All.vue') },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
