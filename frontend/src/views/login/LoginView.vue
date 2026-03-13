<template>
  <main class="page-content">
      <button
        type="button"
        class="btn btn-outline-light back-home-btn"
        @click="goHome"
      >
        <i class="bi bi-arrow-left"></i>
        Voltar à homepage
      </button>
    <div class="card login-card">
      <div class="card-body">
        <div class="page-header">
          <h1>Faça login</h1>
        </div>

        <form ref="loginForm" @submit.prevent="submitForm" class="dark-input">
          <div class="mb-3">
            <label for="login" class="form-label">Login</label>
            <input
              id="login"
              name="login"
              type="text"
              class="form-control"
              placeholder="Digite o login ou email"
              required
            />
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Senha</label>
            <div class="password-wrapper">
              <input
                id="password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                class="form-control"
                placeholder="Digite a senha"
                required
              />
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

          <div data-theme="dark" class="g-recaptcha mb-3" ></div>

          <div class="login-actions mb-3">
            <a type="button" class="action-link" @click="openRecoverPasswordModal">
              Esqueci minha senha
            </a>
            <RecoverPasswordModal ref="recoverPasswordModal" />
          </div>

          <button
            type="submit"
            class="btn btn-primary w-100"
            :disabled="!captchaToken || isLoading"
          >
            <span v-if="isLoading">Entrando…</span>
            <span v-else>Entrar</span>
          </button>
        </form>
      </div>
    </div>
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
        'expired-callback': 'onCaptchaExpired',
      })
    })
  }
})

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

    const text = await response.text()
    const result = text ? JSON.parse(text) : {}

    if (!response.ok) {
      throw new Error(result.error || result.msg || 'Erro ao logar')
    }

    authStore.setTokens(result.accessToken, result.refreshToken)

    const meRes = await fetch(`${apiUrl}/me`, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    })

    const meText = await meRes.text()
    const meData = meText ? JSON.parse(meText) : {}

    if (!meRes.ok) {
      throw new Error(meData.error || 'Erro ao obter dados do usuário')
    }

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

const goHome = () => {
  router.push('/')
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
.page-content {
  display: flex;
  justify-content: center;
  padding: 2.5rem 1rem;
}

.login-card {
  width: 100%;
  max-width: 420px;
}

button:disabled {
  background-color: var(--text-muted);
}

.back-home-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  border-color: var(--color-gold);
  color: var(--color-gold);
}

.back-home-btn:hover {
  background-color: var(--color-gold);
  color: #000;
}
</style>