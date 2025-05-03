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
                <input type="password" class="form-control" v-model="currentPassword" required />
              </div>
  
              <div class="mb-3">
                <label class="form-label">Nova Senha</label>
                <input type="password" class="form-control" v-model="newPassword" required />
              </div>
  
              <div class="mb-3">
                <label class="form-label">Confirmar Nova Senha</label>
                <input type="password" class="form-control" v-model="confirmPassword" required />
              </div>
            </div>
  
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-primary">Alterar</button>
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
      const response = await fetchWithAuth('http://127.0.0.1:3333/users/password', {
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
  