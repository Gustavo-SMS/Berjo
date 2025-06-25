<template>
    <div class="modal fade" ref="passwordModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="handleChangePassword">
            <div class="modal-header">
              <h5 class="modal-title">Alterar Senha</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
  
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Senha Atual</label>
                <div class="password-wrapper">
                  <input
                    :type="showCurrentPassword ? 'text' : 'password'"
                    class="form-control"
                    placeholder="Digite a senha"
                    v-model="currentPassword"
                    required
                  >
                  <button
                    type="button"
                    class="toggle-password"
                    @click="toggleCurrentPassword"
                    :aria-label="showCurrentPassword ? 'Ocultar senha' : 'Mostrar senha'"
                  >
                    <i :class="showCurrentPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Nova Senha</label>
                <div class="password-wrapper">
                  <input
                    :type="showNewPassword ? 'text' : 'password'"
                    class="form-control"
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

              <div class="mb-3">
                <label class="form-label">Confirmar Nova Senha</label>
                <div class="password-wrapper">
                  <input
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="form-control"
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
            </div>
  
            <div class="modal-footer">
              <button type="button" class="btn btn-cancel" data-bs-dismiss="modal">Cancelar</button>
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
  const notificationStore = useNotificationStore()

  const currentPassword = ref('')
  const newPassword = ref('')
  const confirmPassword = ref('')
  
  const handleChangePassword = async () => {
    if (newPassword.value !== confirmPassword.value) {
      return notificationStore.addNotification('As senhas não coincidem.', 'error')
    }
  
    try {
      const response = await fetchWithAuth('/users/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            currentPassword: currentPassword.value,
            newPassword: newPassword.value,
            confirmPassword: confirmPassword.value
        })
      }, authStore, router)
  
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || data.msg || 'Erro ao alterar senha')
      }
  
      notificationStore.addNotification('Senha alterada com sucesso!', 'success')
      resetFields()
      hideModal()
    } catch (err) {
      notificationStore.addNotification(err.message, 'error')
    }
  }

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const toggleCurrentPassword = () => {
  showCurrentPassword.value = !showCurrentPassword.value
}
const toggleNewPassword = () => {
  showNewPassword.value = !showNewPassword.value
}
const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}
  
const passwordModal = ref(null)
let modalInstance = null

onMounted(() => {
  if (passwordModal.value) {
    modalInstance = new bootstrap.Modal(passwordModal.value)
  }
})

const showModal = () => {
  if (modalInstance) modalInstance.show()
}

const hideModal = () => {
  if (modalInstance) modalInstance.hide()
}

const resetFields = () => {
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
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