import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    refreshToken: null,
    userRole: null,
    customerId: null
  }),
  actions: {
    setTokens(access, refresh) {
      this.accessToken = access
      this.refreshToken = refresh
      localStorage.setItem('accessToken', access)
      localStorage.setItem('refreshToken', refresh)
    },
    setUser(role, customerId) {
      this.userRole = role
      this.customerId = customerId
      localStorage.setItem('userRole', role)
      localStorage.setItem('customerId', customerId)
    },
    clearUser() {
      this.accessToken = null
      this.refreshToken = null
      this.userRole = null
      this.customerId = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userRole')
      localStorage.removeItem('customerId')
    },
    loadFromStorage() {
      this.accessToken = localStorage.getItem('accessToken')
      this.refreshToken = localStorage.getItem('refreshToken')
      this.userRole = localStorage.getItem('userRole')
      this.customerId = localStorage.getItem('customerId')
    },
    setAccessToken(token) {
      this.accessToken = token
    }
  }
})

// import { defineStore } from 'pinia'

// export const useAuthStore = defineStore('auth', {
//   state: () => ({
//     userRole: null,
//     customerId: null
//   }),
//   actions: {
//     setUser(role, customerId) {
//       this.userRole = role
//       this.customerId = customerId
//       localStorage.setItem('userRole', role)
//       localStorage.setItem('customerId', customerId)
//     },
//     clearUser() {
//       this.userRole = null
//       this.customerId = null
//       localStorage.removeItem('userRole')
//       localStorage.removeItem('customerId')
//     },
//     loadFromStorage() {
//       this.userRole = localStorage.getItem('userRole')
//       this.customerId = localStorage.getItem('customerId')
//     }
//   }
// })