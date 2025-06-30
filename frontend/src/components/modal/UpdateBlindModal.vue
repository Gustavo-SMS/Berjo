<template>
    <div class="modal fade" ref="blindModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
  
            <div class="container">
                <form class="form" @submit.prevent="handleUptadeBlind">
                    <h3 class="form-title">Editar persiana</h3>

                    <div class="form-group">
                        <label for="type">Qtde *</label>
                        <input v-model="editableQuantity" type="number" name="type" id="type" class="form-input" required>
                    </div>
                                
                    <div class="form-group">
                        <label for="collection">Tipo *</label>
                        <SelectType :key="editableType" :typeValue="editableType" @selectedOption="selectedType" class="form-input" />
                    </div>
                        
                    <div class="form-group">
                        <label for="color">Coleção - Cor *</label>
                        <SelectBlindType 
                            :key="editableType"
                            :typeValue="editableType"
                            :collection="editableCollection"
                            @selectedOption="selectedBlindTypeId" 
                            class="form-input"
                        />
                    </div>

                    <div class="form-group">
                        <label for="max_width">Largura</label>
                        <input v-model="editableWidth" type="number" name="max_width" id="max_width" class="form-input" min="0" step="0.01">
                    </div>

                    <div class="form-group">
                        <label for="price">Altura *</label>
                        <input v-model="editableHeight" type="number" name="price" id="price" class="form-input" min="0" step="0.01" required>
                    </div>

                    <div class="form-group">
                        <label for="price">Alt. comando *</label>
                        <input v-model="editableCommand_height" type="number" name="price" id="price" class="form-input" min="0" step="0.01" required>
                    </div>

                    <div class="form-group">
                        <label for="price">Modelo *</label>
                        <select v-if="modelOptions.length" class="form-input" v-model="editableModel">
                            <option value="" disabled></option>
                            <option v-for="option in modelOptions" :key="option" :value="option">
                                {{ option }}
                            </option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="price">Observações</label>
                        <input v-model="editableObservation" type="text" name="observation" id="observation" class="form-input" min="0" step="0.01">
                    </div>

                    <div class="col-12 d-grid gap-2">
                        <button type="submit" class="btn btn-primary">Salvar alterações</button>
                        <button type="button" class="btn btn-cancel" data-bs-dismiss="modal">Cancelar</button>
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
  
<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background-color: var(--color-background);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--color-text);
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.form-input {
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-surface);
  color: var(--color-text);
}

.form-input:focus {
  outline: 2px solid var(--color-primary);
}

.btn-primary {
  background-color: var(--color-primary);
  color: #fff;
  /* padding: 0.75rem; */
  font-weight: bold;
  border: none;
  /* border-radius: 4px; */
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
}
</style>