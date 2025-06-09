<template>
    <main class="reset-container">
      <form class="reset-form" @submit.prevent="submitNewPassword">
        <h1 class="reset-title">Redefinir Senha</h1>
  
        <div class="form-group">
          <label for="newPassword">Nova Senha</label>
          <div class="password-wrapper">
            <input
              :type="showNewPassword ? 'text' : 'password'"
              class="form-input"
              placeholder="Digite a nova senha"
              v-model="newPassword"
              required
            >
            <button
              type="button"
              class="toggle-password"
              @click="toggleNewPassword"
              :aria-label="showNewPassword ? 'Ocultar senha' : 'Mostrar senha'"
            >
              <i :class="showNewPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
        </div>
  
        <div class="form-group">
          <label for="confirmPassword">Confirmar Senha</label>
          <div class="password-wrapper">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              class="form-input"
              placeholder="Confirme a nova senha"
              v-model="confirmPassword"
              required
            >
            <button
              type="button"
              class="toggle-password"
              @click="toggleConfirmPassword"
              :aria-label="showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'"
            >
              <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
        </div>
  
        <button class="btn-primary full-width" type="submit">Redefinir</button>
      </form>
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
        throw new Error(result.error || 'Erro ao redefinir senha')
      }
  
      notificationStore.addNotification('Senha redefinida com sucesso!', 'success')
      router.push('/login')
    } catch (err) {
      notificationStore.addNotification(err.message, 'error')
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
.reset-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background-color: var(--color-background);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.reset-title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--color-text);
}

.reset-form {
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

.btn-primary:hover {
  background-color: var(--color-primary-dark);
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
  