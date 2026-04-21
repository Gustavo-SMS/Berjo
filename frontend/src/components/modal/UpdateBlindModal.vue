<template>
    <div class="modal fade" ref="blindModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content card">

          <div class="modal-header">
            <h5 class="modal-title">Editar persiana</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
  
            <div class="modal-body">
                <form class="dark-input row g-3" @submit.prevent="handleUptadeBlind">

                    <div class="col-12 col-md-6">
                        <label for="type" class="form-label">Qtde *</label>
                        <input v-model="editableQuantity" type="number" name="type" id="type" class="form-control" required>
                    </div>

                    <div class="col-12 col-md-6">
                        <label for="collection" class="form-label">Tipo *</label>
                        <SelectType :typeValue="editableType" @selectedOption="handleTypeSelected" />
                    </div>

                    <div class="col-12 col-md-12">
                        <label for="color" class="form-label">Coleção - Cor *</label>
                        <SelectBlindType 
                          :key="editableType"
                          :typeValue="editableType"
                          :collection="editableCollection"
                          :selectedId="editableBlindTypeId"
                          @selectedOption="handleBlindTypeSelected" 
                        />
                    </div>

                    <div class="col-12 col-md-6">
                        <label for="max_width" class="form-label">Largura</label>
                        <input v-model="editableWidth" type="number" name="max_width" id="max_width" class="form-control" min="0" step="0.01" required>
                    </div>

                    <div class="col-12 col-md-6">
                        <label for="price" class="form-label">Altura *</label>
                        <input v-model="editableHeight" type="number" name="price" id="price" class="form-control" min="0" step="0.01" required>
                    </div>

                    <div class="col-12 col-md-6">
                        <label for="price" class="form-label">Alt. comando *</label>
                        <input v-model="editableCommand_height" type="number" name="price" id="price" class="form-control" min="0" step="0.01" required>
                    </div>

                    <div class="col-12 col-md-6">
                        <label for="price" class="form-label">Modelo *</label>
                        <v-select
                          v-model="editableModel"
                          :options="modelOptions"
                          :clearable="false"
                          :disabled="!modelOptions.length"
                          class="vselect-custom"
                        />
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
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
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
const editableBlindTypeId = ref('')

const handleTypeSelected  = (selected) => {
  editableType.value = selected || null
} 

const handleBlindTypeSelected  = (selectedObject) => {
  if (!selectedObject) return

  editableBlindTypeId.value = selectedObject.id || null
}

const modelConfig = {
  'Persiana vertical': {
    includeDefault: false,
    extra: ['Lateral', 'Central', 'Invertida']
  },
  'PH 25mm': {
    includeDefault: true,
    extra: ['Duplex']
  },
  'Rolo': {
    includeDefault: true,
    extra: ['Duplex']
  },
  'Romana': {
    includeDefault: true,
    extra: ['Duplex']
  },
  'Double Vision': {
    includeDefault: true,
    extra: ['Duplex']
  }
}

const modelOptions = computed(() => {
    if (!editableType.value) return []

    const defaultOptions = ['Dir', 'Esq']
    const config = modelConfig[editableType.value]

    if (!config) return defaultOptions

    return config.includeDefault ? [...defaultOptions, ...config.extra] : config.extra
})
  
const handleUptadeBlind = async () => {
    const data = {
        id: props.blind.id,
        quantity: editableQuantity.value,
        type_id: editableBlindTypeId.value,
        width: editableWidth.value,
        height: editableHeight.value,
        command_height: editableCommand_height.value,
        model: editableModel.value
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
  editableBlindTypeId.value = newBlind.blindTypeId || ''

}, { immediate: true })
  
defineExpose({ showModal })
</script>