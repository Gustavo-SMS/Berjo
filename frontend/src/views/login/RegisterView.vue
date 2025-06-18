<template>
    <main class="register-container">
        <form class="register-form" @submit.prevent="submitForm" novalidate>
            <h1 class="register-title">Cadastre o usuário</h1>

            <SelectUnlinkedCustomers @selectedOption="selectedUnlinkedCustomer" :refresh-key="refreshKey"/>

            <div class="form-group">
                <label for="login">Login*</label>
                <input v-model="login" id="login" name="login" type="text" class="form-input" placeholder="Digite o login" :class="{ 'input-error': loginError }">
            </div>

            <div class="form-group">
                <label for="password">Senha*</label>
                <div class="password-wrapper">
                  <input
                    v-model="password"
                    id="password"
                    name="password"
                    :type="showPassword ? 'text' : 'password'"
                    class="form-input"
                    placeholder="Digite a senha"
                    :class="{ 'input-error': passwordError }"
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

            <div class="form-group">
                <label for="confirmPassword">Confirmar Senha*</label>
                <div class="password-wrapper">
                  <input
                    v-model="confirmPassword"
                    id="confirmPassword"
                    name="confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="form-input"
                    placeholder="Confirme a nova senha"
                    :class="{ 'input-error': confirmPasswordError }"
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

            <button class="btn-primary full-width" type="submit">Entrar</button>
        </form>
    </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { fetchWithAuth } from '@/utils/api'
import SelectUnlinkedCustomers from '@/components/customer/SelectUnlinkedCustomers.vue'

const notificationStore = useNotificationStore()
const router = useRouter()
const authStore = useAuthStore()

const unlinkedCustomerId = ref('')
const refreshKey = ref(0)

const login = ref('')
const password = ref('')
const confirmPassword = ref('')

const selectedUnlinkedCustomer = (selectedCustomerId) => {
    unlinkedCustomerId.value = selectedCustomerId
}

const submitForm = async () => {
  if (!validateForm()) return

  const data = {
    login: login.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
    customerId: unlinkedCustomerId.value
  }
  
    try {
        const response = await fetchWithAuth(`/register`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
        }, authStore, router)

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Erro ao cadastrar usuário')
        }
        
        notificationStore.addNotification('Cliente cadastrado com sucesso!', 'success')
        refreshKey.value++
        resetForm()
    } catch (error) {
        console.log(error.message)
        notificationStore.addNotification(error.message, 'error')
    }
}

const loginError = ref(false)
const passwordError = ref(false)
const confirmPasswordError = ref(false)
const customerError = ref(false)

const validateForm = () => {
  loginError.value = !login.value.trim()
  passwordError.value = !password.value.trim()
  confirmPasswordError.value = password.value !== confirmPassword.value
  customerError.value = !unlinkedCustomerId.value

  const errors = []

  if (!login.value.trim()) {
    errors.push('Login é obrigatório')
  }

  if (!password.value.trim()) {
    errors.push('Senha é obrigatória')
  }

  if (password.value !== confirmPassword.value) {
    errors.push('As senhas não coincidem')
  }

  if (!unlinkedCustomerId.value) {
    errors.push('É necessário selecionar um cliente')
  }

  if (errors.length > 0) {
    errors.forEach(err => notificationStore.addNotification(err, 'error'))
  }

  return !(loginError.value || passwordError.value || confirmPasswordError.value || customerError.value)
}

const resetForm = () => {
  login.value = ''
  password.value = ''
  confirmPassword.value = ''
}

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}
</script>

<style scoped>
.register-container {
  max-width: 500px;
  margin: 3rem auto;
  padding: 2rem 1rem;
  background-color: var(--color-background);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.register-title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--color-text);
}

.register-form {
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

.input-error {
  border: 1px solid rgba(255, 0, 0, 0.5);
  box-shadow: 0 0 4px rgba(255, 0, 0, 0.3);
  transition: border 0.3s, box-shadow 0.3s;
}
</style>