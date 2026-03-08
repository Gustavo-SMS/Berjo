<template>
  <main class="page-content">
    <div class="card register-card">
      <div class="card-body">
        <div class="page-header">
          <h1>Cadastrar usuário</h1>
        </div>

        <form @submit.prevent="submitForm" class="dark-input" novalidate>
          <SelectUnlinkedCustomers
            class="mb-3"
            @selectedOption="selectedUnlinkedCustomer"
            :refresh-key="refreshKey"
          />

          <div class="mb-3">
            <label for="login" class="form-label">Login *</label>
            <input
              v-model="login"
              id="login"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': loginError }"
            />
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Senha *</label>
            <div class="password-wrapper">
              <input
                v-model="password"
                id="password"
                :type="showPassword ? 'text' : 'password'"
                class="form-control"
                :class="{ 'is-invalid': passwordError }"
              />
              <button
                type="button"
                class="toggle-password"
                @click="togglePassword"
              >
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
          </div>

          <div class="mb-4">
            <label for="confirmPassword" class="form-label">
              Confirmar senha *
            </label>
            <div class="password-wrapper">
              <input
                v-model="confirmPassword"
                id="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="form-control"
                :class="{ 'is-invalid': confirmPasswordError }"
              />
              <button
                type="button"
                class="toggle-password"
                @click="toggleConfirmPassword"
              >
                <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
          </div>

          <button type="submit" class="btn btn-primary w-100">
            Cadastrar usuário
          </button>
        </form>
      </div>
    </div>
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
.page-content {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.register-card {
  width: 100%;
  max-width: 520px;
}

.password-wrapper {
  position: relative;
}
</style>