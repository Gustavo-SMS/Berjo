<template>
    <div class="modal fade" ref="paymentModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content card">

          <div class="modal-header">
            <h5 class="modal-title">Adicionar Pagamento</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
              <form @submit.prevent="submitPayment">
                  <div class="dark-input w-100 d-flex flex-column gap-3">
                      <div class="mb-3 dark-input">
                          <label class="form-label">Valor</label>
                          <input type="number" class="form-control" v-model="amount" min="0" required />
                        </div>
                        <div class="mb-3 dark-input">
                            <label class="form-label">Data</label>
                            <input type="date" class="form-control" v-model="date" :max="today" required />
                        </div>
                    </div>
                    
                    <div class="d-flex w-100 gap-3 mt-3">
                        <button type="submit" class="btn btn-primary w-100">Enviar</button>
                        <button type="button" class="btn btn-danger w-100" data-bs-dismiss="modal">Cancelar</button>
                    </div>
                </form>
            </div>
            
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

  const props = defineProps(['orderId'])
  const emit = defineEmits(['payment-added'])

  const amount = ref('')
  const date = ref('')
  
  const submitPayment = async () => {
    const payload = {
      amount: parseFloat(amount.value),
      date: date.value,
      orderId: props.orderId
    }
    try {
      const response = await fetchWithAuth('/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }, authStore, router)
  
      const contentType = response.headers.get('content-type') || ''

      let data = {}
      if (contentType.includes('application/json')) {
        data = await response.json()
      } else {
        const text = await response.text()
        throw new Error(text || 'Erro desconhecido do servidor')
      }

      if (!response.ok) {
        throw new Error(data.error || data.msg || 'Erro ao enviar pagamento')
      }
  
      notificationStore.addNotification('Pagamento adicionado com sucesso!', 'success')
      resetFields()
      hideModal()
      emit('payment-added')
    } catch (err) {
      const message = err.message.includes('Failed to fetch') ? 'Servidor indisponível. Tente novamente mais tarde.' : err.message
      console.log(err.message)
      notificationStore.addNotification(err.message, 'error')
    }
  }
  
const today = new Date().toISOString().split('T')[0]

const paymentModal = ref(null)
let modalInstance = null

onMounted(() => {
  if (paymentModal.value) {
      modalInstance = new bootstrap.Modal(paymentModal.value)
    }
})

const showModal = () => {
    if (modalInstance) modalInstance.show()
}

const hideModal = () => {
  if (modalInstance) modalInstance.hide()
}

const resetFields = () => {
  amount.value = ''
  date.value = ''
}
  
defineExpose({ showModal })
</script>
