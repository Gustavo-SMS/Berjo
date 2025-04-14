import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/login/RegisterView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/customerProfile',
      name: 'customerProfile',
      component: () => import('../views/customers/CustomerProfileView.vue'),
    },
    {
      path: '/createCustomer',
      name: 'createCustomer',
      component: () => import('../views/customers/CreateCustomersView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/customers',
      name: 'customers',
      component: () => import('../views/customers/CustomersView.vue')
    },
    {
      path: '/createOrder',
      name: 'createOrder',
      component: () => import('../views/orders/CreateOrdersView.vue')
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/orders/OrdersView.vue')
    },
    {
      path: '/blindTypes',
      name: 'blindTypes',
      component: () => import('../views/blindTypes/BlindTypeView.vue')
    },
    {
      path: '/createBlindTypes',
      name: 'createBlindTypes',
      component: () => import('../views/blindTypes/CreateBlindTypeView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('userRole')
  const userRole = localStorage.getItem('userRole')

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/')
  }

  if (to.meta.requiresAdmin && userRole !== 'ADMIN') {
    return next('/')
  }

  next()
})

export default router
