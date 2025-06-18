<template>
    <main class="login-container">
      <form ref="loginForm" @submit.prevent="submitForm" class="login-form">
        <h1 class="login-title">Faça Login</h1>
        
        <div class="form-group">
          <label for="login">Login</label>
          <input id="login" name="login" type="text" class="form-input" placeholder="Digite o login ou email" required>
        </div>
        <div class="form-group password-group">
          <label for="password">Senha</label>
          <div class="password-wrapper">
            <input
              id="password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input"
              placeholder="Digite a senha"
              required
            >
            <button
              type="button"
              class="toggle-password"
              @click="togglePassword"
              :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
            >
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
        </div>

        <div class="g-recaptcha"></div>

        <div class="login-actions">
          <button class="btn-secondary" type="button" @click="openRecoverPasswordModal">
            Esqueci minha senha
          </button>
          <RecoverPasswordModal ref="recoverPasswordModal" />
        </div>
        
        <button :disabled="!captchaToken || isLoading" type="submit" class="btn-primary full-width">
          <span v-if="isLoading">Entrando...</span>
          <span v-else>Entrar</span>
        </button>
      </form>
    </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notificationStore'
import { useAuthStore } from '@/stores/authStore'
import RecoverPasswordModal from '@/components/modal/RecoverPasswordModal.vue'

const apiUrl = import.meta.env.VITE_API_URL

const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const router = useRouter()

const loginForm = ref(null)

const captchaToken = ref('')

const isLoading = ref(false)

onMounted(() => {
  window.onCaptchaVerified = (token) => {
    captchaToken.value = token
  }
  window.onCaptchaExpired = () => {
    captchaToken.value = ''
  }

  if (window.grecaptcha) {
    window.grecaptcha.ready(() => {
      window.grecaptcha.render(document.querySelector('.g-recaptcha'), {
        sitekey: '6LecWiIrAAAAAOdnwqNgm9EyzsZsdLLZ_dU6P3g5',
        callback: 'onCaptchaVerified',
        'expired-callback': 'onCaptchaExpired'
      })
    })
  }
})

// const submitForm = async () => {
//     if (!captchaToken.value) {
//       notificationStore.addNotification('Confirme o captcha para continuar.', 'error')
//       return
//     }

//     const formData = new FormData(loginForm.value)
//     const data = Object.fromEntries(formData)
//     try {
//       const response = await fetch(`${apiUrl}/login`, {
//         method: 'POST',
//         headers: {
//             'Content-type': 'application/json'
//         },
//         credentials: 'include',
//         body: JSON.stringify(data)
//         })

//       const result = await response.json()
      
//       if (!response.ok) {
//         if (response.status === 403) {
//           throw new Error('Verificação do captcha falhou. Tente novamente.')
//         }
//         throw new Error(result.error || result.msg || 'Erro ao logar')
//       }

//       const meRes = await fetch(`${apiUrl}/me`, {
//         credentials: 'include'
//       })

//       const meData = await meRes.json()

//       if (!meRes.ok) {
//         throw new Error(meData.error || 'Erro ao obter dados do usuário')
//       }
        
//       authStore.setUser(meData.role, meData.customerId)
//       router.push('/orders')   
//     } catch (error) {
//       console.log(error.message)
//       notificationStore.addNotification(error.message, 'error')

//       if (window.grecaptcha) {
//         window.grecaptcha.reset()
//         captchaToken.value = ''
//       }
//     } 
// }

const submitForm = async () => {
  if (!captchaToken.value) {
    notificationStore.addNotification('Confirme o captcha para continuar.', 'error')
    return
  }

  isLoading.value = true

  const formData = new FormData(loginForm.value)
  const data = Object.fromEntries(formData)

  try {
    const response = await fetch(`${apiUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || result.msg || 'Erro ao logar')
    }

    authStore.setTokens(result.accessToken, result.refreshToken)

    const meRes = await fetch(`${apiUrl}/me`, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    })

    if (!meRes.ok) {
      const errorData = await meRes.json()
      throw new Error(errorData.error || 'Erro ao obter dados do usuário')
    }

    const meData = await meRes.json()
    authStore.setUser(meData.role, meData.customerId)

    router.push('/orders')
  } catch (error) {
    console.log(error.message)
    notificationStore.addNotification(error.message, 'error')

    if (window.grecaptcha) {
      window.grecaptcha.reset()
      captchaToken.value = ''
    }
  } finally {
    isLoading.value = false
  }
}

const recoverPasswordModal = ref(null)
const openRecoverPasswordModal = () => {
  recoverPasswordModal.value?.showModal()
}

const showPassword = ref(false)
const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 3rem auto;
  padding: 2rem 1rem;
  background-color: var(--color-background);
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}

.login-title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--color-text);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-text);
}

.form-input {
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-surface);
  color: var(--color-text);
  font-size: 1rem;
}

.form-input:focus {
  outline: 2px solid var(--color-primary);
}

.login-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.btn-primary:disabled {
  background-color: var(--color-disabled);
  cursor: not-allowed;
}

.btn-secondary {
  background-color: transparent;
  color: var(--color-primary);
  border: none;
  padding: 0.5rem;
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: underline;
}

.btn-secondary:hover {
  color: var(--color-primary-dark);
}

.full-width {
  width: 100%;
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper input {
  width: 100%;
  padding-right: 2.5rem;
}

.toggle-password {
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: var(--color-text);
}
</style>