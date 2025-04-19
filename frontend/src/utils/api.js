import { useLogout } from './logout'

const API_BASE_URL = 'http://127.0.0.1:3333'

export async function fetchWithAuth(endpoint, options = {}, authStore, router) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  })

  if (response.status === 401 || response.status === 403) {
    useLogout(authStore, router)
    throw new Error('Sessão expirada. Faça login novamente.')
  }

  return response
}

