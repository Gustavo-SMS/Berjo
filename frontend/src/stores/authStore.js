import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userRole: null,
    customerId: null
  }),
  actions: {
    setUser(role, customerId) {
      this.userRole = role
      this.customerId = customerId
      localStorage.setItem('userRole', role)
      localStorage.setItem('customerId', customerId)
    },
    clearUser() {
      this.userRole = null
      this.customerId = null
      localStorage.removeItem('userRole')
      localStorage.removeItem('customerId')
    },
    loadFromStorage() {
      this.userRole = localStorage.getItem('userRole')
      this.customerId = localStorage.getItem('customerId')
    }
  }
})