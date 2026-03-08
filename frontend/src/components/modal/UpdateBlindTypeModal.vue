<template>
  <div class="modal fade" ref="blindTypeModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content dark-modal">

        <div class="modal-header">
          <h5 class="modal-title">Editar tipo de persiana</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>

        <div class="modal-body">
          <form class="dark-input w-100 d-flex flex-column gap-3" @submit.prevent="handleUptadeBlindType">

            <div class="w-100">
              <label class="form-label">Tipo *</label>
              <SelectType
                :key="editableType"
                :typeValue="editableType"
                @selectedOption="selectedType"
              />
            </div>

            <div class="w-100">
              <label class="form-label">Coleção *</label>
              <input
                v-model="editableCollection"
                type="text"
                class="form-control"
                required
              >
            </div>

            <div class="w-100">
              <label class="form-label">Cor *</label>
              <input
                v-model="editableColor"
                type="text"
                class="form-control"
                required
              >
            </div>

            <div class="w-100">
              <label class="form-label">Largura máx.</label>
              <input
                v-model="editableMaxWidth"
                type="number"
                class="form-control"
                min="0"
                step="0.01"
              >
            </div>

            <div class="w-100">
              <label class="form-label">Preço *</label>
              <input
                v-model="editablePrice"
                type="number"
                class="form-control"
                min="0"
                step="0.01"
                required
              >
            </div>

            <div class="d-flex w-100 gap-3 mt-3">
              <button type="submit" class="btn btn-primary w-100">
                Salvar
              </button>

              <button type="button" class="btn btn-danger w-100" data-bs-dismiss="modal">
                Cancelar
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  </div>
</template>
   
<script setup>
import { ref, onMounted, watch } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { fetchWithAuth } from '@/utils/api'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import SelectType from '@/components/order/formCreateOrder/SelectType.vue'
  
const authStore = useAuthStore()
const router = useRouter()
const notificationStore = useNotificationStore()
  
const props = defineProps(['blindType'])
  
const editableType = ref('')
const editableCollection = ref('')
const editableColor = ref('')
const editableMaxWidth = ref('')
const editablePrice = ref('')

const selectedType = (event, arrayBlindTypes) => {
    editableType.value = arrayBlindTypes[event.target.selectedIndex] || null
}
  
const handleUptadeBlindType = async () => {
    const data = {
      id: props.blindType.id,
      type: editableType.value,
      collection: editableCollection.value,
      color: editableColor.value,
      max_width: editableMaxWidth.value,
      price: editablePrice.value
    }
    
     try {
      const response = await fetchWithAuth("/blind_types", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }, authStore, router)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao atualizar tipo')
      }

      notificationStore.addNotification('Tipo atualizado com sucesso!', 'success')
      resetFields()
      hideModal()
      props.blindType.getBlindTypes()
    } catch (error) {
      console.error('Erro ao enviar os dados:', error.message)
      notificationStore.addNotification(error.message, 'error')
    }
}
    
const blindTypeModal = ref(null)
let modalInstance = null
    
onMounted(() => {
  if (blindTypeModal.value) {
    modalInstance = new bootstrap.Modal(blindTypeModal.value)
  }
})
  
const showModal = () => {
  if (modalInstance) modalInstance.show()
}
  
const hideModal = () => {
  if (modalInstance) modalInstance.hide()
}
  
const resetFields = () => {
    editableType.value = ''
    editableCollection.value = ''
    editableColor.value = ''
    editableMaxWidth.value = ''
    editablePrice.value = ''
}
  
watch(() => props.blindType, (newBlindType) => {
  if (!newBlindType || typeof newBlindType !== 'object') return
  
  editableType.value = newBlindType.type || ''
  editableCollection.value = newBlindType.collection || ''
  editableColor.value = newBlindType.color || ''
  editableMaxWidth.value = newBlindType.max_width || ''
  editablePrice.value = newBlindType.price || ''
}, { immediate: true })
  
defineExpose({ showModal })
</script>
