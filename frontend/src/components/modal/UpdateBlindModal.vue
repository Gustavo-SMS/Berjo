<template>
    <div class="modal fade" ref="blindModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content card">

          <div class="modal-header">
            <h5 class="modal-title">Editar persiana</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
  
            <div class="modal-body">
                <form class="dark-input w-100 d-flex flex-column gap-3" @submit.prevent="handleUptadeBlind">

                    <div class="w-100">
                        <label for="type">Qtde *</label>
                        <input v-model="editableQuantity" type="number" name="type" id="type" class="form-control" required>
                    </div>
                                
                    <div class="w-100">
                        <label for="collection">Tipo *</label>
                        <SelectType :key="editableType" :typeValue="editableType" @selectedOption="selectedType" class="form-control" />
                    </div>
                        
                    <div class="w-100">
                        <label for="color">Coleção - Cor *</label>
                        <SelectBlindType 
                            :key="editableType"
                            :typeValue="editableType"
                            :collection="editableCollection"
                            @selectedOption="selectedBlindTypeId" 
                            class="form-control"
                        />
                    </div>

                    <div class="w-100">
                        <label for="max_width">Largura</label>
                        <input v-model="editableWidth" type="number" name="max_width" id="max_width" class="form-control" min="0" step="0.01">
                    </div>

                    <div class="w-100">
                        <label for="price">Altura *</label>
                        <input v-model="editableHeight" type="number" name="price" id="price" class="form-control" min="0" step="0.01" required>
                    </div>

                    <div class="w-100">
                        <label for="price">Alt. comando *</label>
                        <input v-model="editableCommand_height" type="number" name="price" id="price" class="form-control" min="0" step="0.01" required>
                    </div>

                    <div class="w-100">
                        <label for="price">Modelo *</label>
                        <select v-if="modelOptions.length" class="form-control" v-model="editableModel">
                            <option value="" disabled></option>
                            <option v-for="option in modelOptions" :key="option" :value="option">
                                {{ option }}
                            </option>
                        </select>
                    </div>

                    <div class="w-100">
                        <label for="price">Observações</label>
                        <input v-model="editableObservation" type="text" name="observation" id="observation" class="form-control" min="0" step="0.01">
                    </div>

                    <div class="col-12 d-grid gap-2">
                        <button type="submit" class="btn btn-primary">Salvar alterações</button>
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                    </div>
                </form>
            </div>
            
        </div>
      </div>
    </div>
</template>
   
<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { fetchWithAuth } from '@/utils/api'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import SelectType from '@/components/order/formCreateOrder/SelectType.vue'
import SelectBlindType from '@/components/order/formCreateOrder/SelectBlindType.vue'
  
const authStore = useAuthStore()
const router = useRouter()
const notificationStore = useNotificationStore()
  
const props = defineProps(['blind'])
  
const editableQuantity = ref('')
const editableType = ref('')
const editableCollection = ref('')
const editableWidth = ref('')
const editableHeight = ref('')
const editableCommand_height = ref('')
const editableModel = ref('')
const editableObservation = ref('')
const editableBlindTypeId = ref('')

const selectedType = (event, arrayBlindTypes) => {
    editableType.value = arrayBlindTypes[event.target.selectedIndex] || null
    editableCollection.value = ''
}

const selectedBlindTypeId = (event, arrayBlindTypes) => {
    editableBlindTypeId.value = arrayBlindTypes[event.target.selectedIndex].id || props.blindTypeId
}

const modelOptions = computed(() => {
    if (!editableType.value) return []

    const defaultOptions = ['Dir', 'Esq']

    const extraOptionsMap  = {
        'Vertical': ['Lateral', 'Central', 'Invertida'],
        'Horizontal': ['Duplex'],
        'Rolo': ['Duplex'],
        'Romana': ['Duplex'],
        'Double Vision': ['Duplex'],
    }
    const extra = extraOptionsMap[editableType.value] || []
    return [...defaultOptions, ...extra]
})
  
const handleUptadeBlind = async () => {
    const data = {
        id: props.blind.id,
        quantity: editableQuantity.value,
        type_id: editableBlindTypeId.value,
        width: editableWidth.value,
        height: editableHeight.value,
        command_height: editableCommand_height.value,
        model: editableModel.value,
        observation: editableObservation.value
      }
    
     try {
      const response = await fetchWithAuth(`/blinds`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }, authStore, router)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao atualizar persiana')
      }

      notificationStore.addNotification('Persiana atualizada', 'success')
      resetFields()
      hideModal()
      props.blind.getOrders(props.blind.status)
    } catch (error) {
      console.error('Erro ao enviar os dados:', error.message)
      notificationStore.addNotification(error.message, 'error')
    }
}
    
const blindModal = ref(null)
let modalInstance = null
    
onMounted(() => {
  if (blindModal.value) {
    modalInstance = new bootstrap.Modal(blindModal.value)
  }
})
  
const showModal = () => {
  if (modalInstance) modalInstance.show()
}
  
const hideModal = () => {
  if (modalInstance) modalInstance.hide()
}
    
const resetFields = () => {
    editableQuantity.value = ''
    editableType.value = ''
    editableCollection.value = ''
    editableWidth.value = ''
    editableHeight.value = ''
    editableCommand_height.value = ''
    editableModel.value = ''
    editableObservation.value = ''
    editableBlindTypeId.value = ''
}
  
watch(() => props.blind, (newBlind) => {
  if (!newBlind || typeof newBlind !== 'object') return
  
  editableQuantity.value = newBlind.quantity || ''
  editableType.value = newBlind.type || ''
  editableCollection.value = newBlind.collection || ''
  editableWidth.value = newBlind.width || ''
  editableHeight.value = newBlind.height || ''
  editableCommand_height.value = newBlind.command_height || ''
  editableModel.value = newBlind.model || ''
  editableObservation.value = newBlind.observation || ''
  editableBlindTypeId.value = newBlind.blindTypeId || ''
}, { immediate: true })
  
defineExpose({ showModal })
</script>
  
