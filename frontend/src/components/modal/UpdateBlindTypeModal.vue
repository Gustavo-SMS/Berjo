<template>
    <div class="modal fade" ref="blindTypeModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
  
            <div class="container">
                <form class="form" @submit.prevent="handleUptadeBlindType">
                    <h3 class="form-title">Editar tipo de persiana</h3>

                    <div class="form-group">
                        <label for="type">Tipo *</label>
                        <input v-model="editableType" type="text" name="type" id="type" class="form-input" required>
                    </div>
                                
                    <div class="form-group">
                        <label for="collection">Coleção *</label>
                        <input v-model="editableCollection" type="text" name="collection" id="collection" class="form-input" required>
                    </div>
                        
                    <div class="form-group">
                        <label for="color">Cor *</label>
                        <input v-model="editableColor" type="text" name="color" id="color" class="form-input" required>
                    </div>

                    <div class="form-group">
                        <label for="max_width">Largura máx.</label>
                        <input v-model="editableMaxWidth" type="number" name="max_width" id="max_width" class="form-input" min="0" step="0.01">
                    </div>

                    <div class="form-group">
                        <label for="price">Preço *</label>
                        <input v-model="editablePrice" type="number" name="price" id="price" class="form-input" min="0" step="0.01" required>
                    </div>

                    <div class="col-12">
                        <button type="submit" class="btn btn-primary w-100">Salvar alterações</button>
                        <button type="button" class="btn btn-secondary w-100" data-bs-dismiss="modal">Cancelar</button>
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
  
const authStore = useAuthStore()
const router = useRouter()
const notificationStore = useNotificationStore()
  
const props = defineProps(['blindType'])
  
const editableType = ref('')
const editableCollection = ref('')
const editableColor = ref('')
const editableMaxWidth = ref('')
const editablePrice = ref('')
  
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
  padding: 0.75rem;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
}
</style>