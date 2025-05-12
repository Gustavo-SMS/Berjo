<template>
    <div class="modal fade" ref="loginModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="handleChangeLogin">
            <div class="modal-header">
              <h5 class="modal-title">Alterar Login</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
  
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Novo login</label>
                <input type="text" class="form-control" v-model="newLogin" required />
              </div>
  
              <div class="mb-3">
                <label class="form-label">Confirmar novo login</label>
                <input type="text" class="form-control" v-model="confirmLogin" required />
              </div>
  
              <div class="mb-3">
                <label class="form-label">Senha atual</label>
                <div class="password-wrapper">
                  <input
                    id="password"
                    name="password"
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control"
                    placeholder="Digite a senha"
                    v-model="currentPassword"
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
            </div>
  
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-primary">Salvar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useNotificationStore } from '@/stores/notificationStore'
  import { fetchWithAuth } from '@/utils/api'
  import { useAuthStore } from '@/stores/authStore'
  import { useRouter } from 'vue-router'

  const authStore = useAuthStore()
  const router = useRouter()
  const newLogin = ref('')
  const confirmLogin = ref('')
  const currentPassword = ref('')
  
  const notificationStore = useNotificationStore()
  
  const handleChangeLogin = async () => {
    if (newLogin.value !== confirmLogin.value) {
      return notificationStore.addNotification('Os e-mails não coincidem.', 'error')
    }
  
    try {
      const response = await fetchWithAuth('http://127.0.0.1:3333/users/login', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          newLogin: newLogin.value,
          currentPassword: currentPassword.value
        })
      }, authStore, router)
  
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || data.msg || 'Erro ao alterar login')
      }
  
      notificationStore.addNotification('Login alterado com sucesso!', 'success')
      resetFields()
      hideModal()
    } catch (err) {
      notificationStore.addNotification(err.message, 'error')
    }
  }

const showPassword = ref(false)
const togglePassword = () => {
  showPassword.value = !showPassword.value
}
  
const loginModal = ref(null)
let modalInstance = null
  
onMounted(() => {
  if (loginModal.value) {
    modalInstance = new bootstrap.Modal(loginModal.value)
  }
})

const showModal = () => {
  if (modalInstance) modalInstance.show()
}

const hideModal = () => {
  if (modalInstance) modalInstance.hide()
}
  const resetFields = () => {
    newLogin.value = ''
    confirmLogin.value = ''
    currentPassword.value = ''
  }
  
  defineExpose({ showModal })
</script>
  
<style scoped>
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