import router from '@/router'
import { useAuthStore } from '@/stores/authStore'

const API_BASE_URL = 'http://127.0.0.1:3333'

export async function fetchWithAuth(endpoint, options = {}, retry = true) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`
  const authStore = useAuthStore()

  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  })

  if (response.status === 401 && retry) {
    const refreshResponse = await fetch(`${API_BASE_URL}/refresh`, {
      method: 'POST',
      credentials: 'include'
    })

    if (refreshResponse.ok) {
      return fetchWithAuth(endpoint, options, false)
    } else {
      authStore.clearUser()
      authStore.$reset()
      router.push('/login')
      throw new Error('Sessão expirada. Faça login novamente.')
    }
  }

  return response
}

