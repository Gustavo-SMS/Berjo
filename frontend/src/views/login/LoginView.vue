<template>
    <main class="login-container">
      <form ref="loginForm" @submit.prevent="submitForm" class="login-form">
        <h1 class="login-title">Faça Login</h1>
        
        <div class="form-group">
          <label for="login">Login</label>
          <input id="login" name="login" type="text" class="form-input" placeholder="Digite o login" required>
        </div>
        <div class="form-group">
          <label for="password">Senha</label>
          <input id="password" name="password" type="password" class="form-control" placeholder="Digite a senha" required>
        </div>

        <div class="g-recaptcha"></div>

        <div class="login-actions">
          <button class="btn-secondary" type="button" @click="openRecoverPasswordModal">
            Esqueci minha senha
          </button>
          <RecoverPasswordModal ref="recoverPasswordModal" />
        </div>
        
        <button :disabled="!captchaToken" type="submit" class="btn-primary full-width">
          Entrar
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

const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const router = useRouter()

const loginForm = ref(null)

const captchaToken = ref('')

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

const submitForm = async (event) => {
    event.preventDefault()

    if (!captchaToken.value) {
      notificationStore.addNotification('Confirme o captcha para continuar.', 'error')
      return
    }

    const formData = new FormData(loginForm.value)
    const data = Object.fromEntries(formData)
    try {
      const response = await fetch('http://127.0.0.1:3333/login', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
        })

      const result = await response.json()
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Verificação do captcha falhou. Tente novamente.')
        }
        throw new Error(result.error || result.msg || 'Erro ao logar')
      }

      const meRes = await fetch('http://127.0.0.1:3333/me', {
        credentials: 'include'
      })

      const meData = await meRes.json()

      if (!meRes.ok) {
        throw new Error(meData.error || 'Erro ao obter dados do usuário')
      }
        
      authStore.setUser(meData.role, meData.customerId)
      router.push('/')   
    } catch (error) {
      console.log(error.message)
      notificationStore.addNotification(error.message, 'error')

      if (window.grecaptcha) {
        window.grecaptcha.reset()
        captchaToken.value = ''
      }
    } 
}

const recoverPasswordModal = ref(null)
const openRecoverPasswordModal = () => {
  recoverPasswordModal.value?.showModal()
}

</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
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
</style>