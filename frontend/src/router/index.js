import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { guest: true }
  },
  {
    path: '/cadastro',
    name: 'Cadastro',
    component: () => import('../views/CadastroView.vue'),
    meta: { guest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/herois',
    name: 'Herois',
    component: () => import('../views/HeroisView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/funcoes',
    name: 'Funcoes',
    component: () => import('../views/FuncoesView.vue'),
    meta: { requiresAuth: true, requiresModerador: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn)       return { name: 'Login' }
  if (to.meta.guest && auth.isLoggedIn)               return { name: 'Dashboard' }
  if (to.meta.requiresModerador && !auth.isModerador) return { name: 'Dashboard' }
})

export default router
