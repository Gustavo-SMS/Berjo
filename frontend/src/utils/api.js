import { useLogout } from './logout'

export async function fetchWithAuth(endpoint, options = {}, authStore, router) {
  const url = endpoint.startsWith('http') ? endpoint : `${import.meta.env.VITE_API_URL}${endpoint}`
  const token = authStore.accessToken
  const refreshToken = authStore.refreshToken

  let headers = { ...(options.headers || {}) }

  delete headers['content-type']
  delete headers['Content-type']

  headers['Content-Type'] = 'application/json'

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (refreshToken) {
    headers['x-refresh-token'] = refreshToken
  }

  const fetchOptions = {
    method: options.method || 'GET',
    headers
  }

  if (options.body) {
    fetchOptions.body = typeof options.body === 'string'
      ? options.body
      : JSON.stringify(options.body)
  }

  const response = await fetch(url, fetchOptions)

  const newAccessToken = response.headers.get('x-access-token')
  if (newAccessToken) {
    authStore.setAccessToken(newAccessToken)
  }

  if (response.status === 401 || response.status === 403) {
    useLogout(authStore, router)
    throw new Error('Sessão expirada. Faça login novamente.')
  }

  return response
}


// import { useLogout } from './logout'

// // const API_BASE_URL = 'http://127.0.0.1:3333'

// export async function fetchWithAuth(endpoint, options = {}, authStore, router) {
//   const url = endpoint.startsWith('http') ? endpoint : `${import.meta.env.VITE_API_URL}${endpoint}`

//   const response = await fetch(url, {
//     ...options,
//     credentials: 'include',
//     headers: {
//       'Content-Type': 'application/json',
//       ...(options.headers || {})
//     }
//   })

//   if (response.status === 401 || response.status === 403) {
//     useLogout(authStore, router)
//     throw new Error('Sessão expirada. Faça login novamente.')
//   }

//   return response
// }

