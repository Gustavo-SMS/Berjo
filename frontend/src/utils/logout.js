export function useLogout(authStore, router) {
  authStore.clearUser()
  router.push('/login')
}