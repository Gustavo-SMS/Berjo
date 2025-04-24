<template>
    <main class="form-signin w-100 m-auto">
      <form ref="loginForm" @submit.prevent="submitForm">
        <h1 class="h3 mb-3 fw-normal">Faça Login</h1>
        
        <div class="form-floating">
          <input id="login" name="login" type="text" class="form-control" placeholder="Login">
          <label for="login">Login</label>
        </div>
        <div class="form-floating">
          <input id="password" name="password" type="password" class="form-control" placeholder="Password">
          <label for="password">Senha</label>
        </div>

        <div class="g-recaptcha"></div>

        <div>
          <button class="btn btn-outline-warning" type="button" @click="openRecoverPasswordModal">Esqueci minha senha</button>
          <RecoverPasswordModal ref="recoverPasswordModal" />
        </div>
        
        <button :disabled="!captchaToken" class="btn btn-primary w-100 py-2" type="submit">Entrar</button>
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
.form-signin {
  max-width: 330px;
  padding: 1rem;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}

.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

</style>