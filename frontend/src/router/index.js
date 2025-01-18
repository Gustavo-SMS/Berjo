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
      component: () => import('../views/login/RegisterView.vue')
    },
    {
      path: '/createCustomer',
      name: 'createCustomer',
      component: () => import('../views/customers/CreateCustomersView.vue')
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
    }
  ]
})

export default router
