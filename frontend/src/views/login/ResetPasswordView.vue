<template>
  <main class="page-content">
    <div class="card reset-card">
      <div class="card-body">
        <div class="page-header">
          <h1>Redefinir Senha</h1>
        </div>

        <form @submit.prevent="submitNewPassword" class="dark-input" novalidate>
          <div class="mb-3">
            <label class="form-label">Nova senha</label>
            <div class="password-wrapper">
              <input
                :type="showNewPassword ? 'text' : 'password'"
                class="form-control"
                v-model="newPassword"
                required
                :disabled="tokenExpired"
              />
              <button
                type="button"
                class="toggle-password"
                @click="toggleNewPassword"
              >
                <i :class="showNewPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label">Confirmar senha</label>
            <div class="password-wrapper">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                class="form-control"
                v-model="confirmPassword"
                required
                :disabled="tokenExpired"
              />
              <button
                type="button"
                class="toggle-password"
                @click="toggleConfirmPassword"
              >
                <i
                  :class="
                    showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'
                  "
                ></i>
              </button>
            </div>
          </div>

          <div v-if="tokenExpired" class="alert alert-warning">
            Seu link expirou. Clique abaixo para receber um novo.
          </div>
          <button
            v-if="tokenExpired"
            type="button"
            class="btn btn-outline-gold w-100 mt-3"
            @click="resendEmail"
            :disabled="resendLoading"
          >
            {{ resendLoading ? 'Enviando...' : 'Reenviar email' }}
          </button>

          <button v-if="!tokenExpired" type="submit" class="btn btn-primary w-100">
            Redefinir senha
          </button>
        </form>
      </div>
    </div>
  </main>
</template>

  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useNotificationStore } from '@/stores/notificationStore'

const apiUrl = import.meta.env.VITE_API_URL
  
  const route = useRoute()
  const router = useRouter()
  const notificationStore = useNotificationStore()
  
  const newPassword = ref('')
  const confirmPassword = ref('')
  const token = ref('')

const tokenExpired = ref(false)
const resendLoading = ref(false)
const expiredEmail = ref(null)
  
  onMounted(() => {
    token.value = route.query.token || ''
    if (!token.value) {
      notificationStore.addNotification('Token inválido.', 'error')
      router.push('/')
    }
  })
  
  const submitNewPassword = async () => {
    if (newPassword.value !== confirmPassword.value) {
      notificationStore.addNotification('As senhas não coincidem.', 'error')
      return
    }
    try {
      const res = await fetch(`${apiUrl}/users/resetPassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token.value,
          newPassword: newPassword.value
        })
      })
  
      const result = await res.json()
  
      if (!res.ok) {
        if (result.error?.toLowerCase().includes('expir')) {
          tokenExpired.value = true
          expiredEmail.value = result.email
        }
        throw new Error(result.error || 'Erro ao redefinir senha')
      }
  
      notificationStore.addNotification('Senha redefinida com sucesso!', 'success')
      router.push('/login')
    } catch (err) {
      notificationStore.addNotification(err.message, 'error')
    }
  }

const resendEmail = async () => {
  resendLoading.value = true

  if (!expiredEmail.value) {
    notificationStore.addNotification('Não foi possível reenviar o email.', 'error')
    return
  }

  try {
    const res = await fetch(`${apiUrl}/users/resendReset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: expiredEmail.value })
    })

    const result = await res.json()

    if (!res.ok) {
      throw new Error(result.error || 'Erro ao reenviar email')
    }

    tokenExpired.value = false
    notificationStore.addNotification('Novo link enviado para seu email!', 'success')
    router.push('/login')
  } catch (err) {
    notificationStore.addNotification(err.message, 'error')
  } finally {
    resendLoading.value = false
  }
}

const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const toggleNewPassword = () => {
  showNewPassword.value = !showNewPassword.value
}
const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}
</script>
  
<style scoped>
.reset-card {
  max-width: 420px;
  margin: 4rem auto;
}
</style>