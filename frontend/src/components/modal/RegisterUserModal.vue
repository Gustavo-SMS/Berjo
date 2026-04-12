<template>
  <div class="modal fade" ref="registerUserModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content card">

        <div class="modal-header">
            <h5 class="modal-title">Cadastrar usuário</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>

        <form @submit.prevent="submitForm" class="modal-body dark-input" novalidate>
            <label for="login" class="form-label">Cliente *</label>
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

            <button type="submit" class="btn btn-primary w-100">
                Cadastrar usuário
            </button>
        </form>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
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

const selectedUnlinkedCustomer = (selectedCustomerId) => {
    unlinkedCustomerId.value = selectedCustomerId
}

const submitForm = async () => {
  if (!validateForm()) return

  const data = {
    login: login.value,
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
        hideModal()
    } catch (error) {
        console.log(error.message)
        notificationStore.addNotification(error.message, 'error')
    }
}

const loginError = ref(false)
const customerError = ref(false)

const validateForm = () => {
  loginError.value = !login.value.trim()
  customerError.value = !unlinkedCustomerId.value

  const errors = []

  if (!login.value.trim()) {
    errors.push('Login é obrigatório')
  }

  if (!unlinkedCustomerId.value) {
    errors.push('É necessário selecionar um cliente')
  }

  if (errors.length > 0) {
    errors.forEach(err => notificationStore.addNotification(err, 'error'))
  }

  return !(loginError.value || customerError.value)
}

const resetForm = () => {
  login.value = ''
}

const registerUserModal = ref(null)
let modalInstance = null
    
onMounted(() => {
  if (registerUserModal.value) {
    modalInstance = new bootstrap.Modal(registerUserModal.value)
  }
})
  
const showModal = () => {
  if (modalInstance) modalInstance.show()
}
  
const hideModal = () => {
  if (modalInstance) modalInstance.hide()
}

defineExpose({ showModal })
</script>