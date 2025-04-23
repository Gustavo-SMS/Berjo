<template>
    <div class="modal fade" ref="recoverPasswordModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="handleRecoverPassword">
            <div class="modal-header">
              <h5 class="modal-title">Recuperar Senha</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
  
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Digite seu email</label>
                <input type="email" class="form-control" v-model="email" required />
              </div>
            </div>
  
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-primary">Enviar</button>
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

  const email = ref('')
  
  const handleRecoverPassword = async () => {
    try {
      const response = await fetchWithAuth('http://127.0.0.1:3333/users/recoverPassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email.value,
        })
      }, authStore, router)
  
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || data.msg || 'Erro ao recuperar senha')
      }
  
      notificationStore.addNotification('Senha enviada com sucesso!', 'success')
      resetFields()
      hideModal()
    } catch (err) {
      notificationStore.addNotification(err.message, 'error')
    }
  }
  
const recoverPasswordModal = ref(null)
let modalInstance = null

onMounted(() => {
  if (recoverPasswordModal.value) {
      modalInstance = new bootstrap.Modal(recoverPasswordModal.value)
    }
})

const showModal = () => {
    if (modalInstance) modalInstance.show()
}

const hideModal = () => {
  if (modalInstance) modalInstance.hide()
}

const resetFields = () => {
  email.value = ''
}
  
  defineExpose({ showModal })
  </script>
  