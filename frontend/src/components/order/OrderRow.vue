<template>
    <form @submit.prevent="submitUpdate" class="row mb-2">
        <div class="col-1">
            <input v-if="isEditing" type="text" class="form-control" v-model="editableQuantity" id="quantity" name="quantity">
            <p v-else>{{ quantity }}</p>
        </div>

        <div class="col-2">
            <SelectType v-if="isEditing" @selectedOption="selectedType" :typeValue="editableType"/>
            <p v-else>{{ type }}</p>
        </div>

        <div class="col-2">
          <SelectBlindType 
                v-if="isEditing" 
                :key="editableType"
                :typeValue="editableType"
                :collection="editableCollection"
                @selectedOption="selectedBlindTypeId" 
            />
            <p v-else>{{ collection + ' ' + color }}</p>
        </div>

        <div class="col-1">
            <input v-if="isEditing" type="number" class="form-control" v-model="editableWidth" id="width" name="width">
            <p v-else>{{ width }}</p>
        </div>
        <div class="col-1">
            <input v-if="isEditing" type="number" class="form-control" v-model="editableHeight" id="height" name="height">
            <p v-else>{{ height }}</p>
        </div>
        <div class="col-1">
            <input v-if="isEditing" type="number" class="form-control" v-model="editableCommand_height" id="command_height" name="command_height">
            <p v-else>{{ command_height }}</p>
        </div>
        <div class="col-1">
            <select v-if="isEditing" class="form-control" v-model="editableModel">
               <option v-for="option in modelOptions" :key="option" >{{ option }}</option>
            </select>
            <p v-else>{{ model }}</p>
        </div>
        <div class="col-1">
            <p>{{ editableBlind_price }}</p>
        </div>

        <template v-if="props.status === 'Em espera'">
          <button @click="changeToInput" type="button" class="btn btn-danger col-1">Editar</button>
          <button type="submit" class="btn btn-primary col-1" :disabled="disabled">Enviar</button>
          <button @click="openDeleteModal" type="button" class="btn btn-warning col-1">Excluir</button>
        </template>
        
        <div class="mt-2 col-12">
            <label for="observation">Observações: </label>
            <input v-if="isEditing" type="text" class="form-control" v-model="editableObservation" id="observation" name="observation">
            <p v-else>{{ observation }}</p>
        </div>
      </form>

      <Teleport to="body">
        <ConfirmationModal
          v-if="showModal"
          :show="showModal"
          message="Tem certeza que deseja excluir?"
          :onConfirm="deleteBlind"
          @close="showModal = false"
        />
      </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import ConfirmationModal from '@/components/modal/ConfirmationModal.vue'
import SelectType from './formCreateOrder/SelectType.vue'
import SelectBlindType from './formCreateOrder/SelectBlindType.vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { fetchWithAuth } from '@/utils/api'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const props = defineProps(['id', 'quantity', 'type', 'collection', 'blindTypeId', 'color', 
'width', 'height', 'command_height', 'model', 'observation', 'status', 'blind_price', 'getOrders'])

const authStore = useAuthStore()
const router = useRouter()
const notificationStore = useNotificationStore()
const showModal = ref(false)

const openDeleteModal = () => {
  showModal.value = true
}

const isEditing = ref(false)
const disabled = ref(true)

const changeToInput = () => {
    isEditing.value = !isEditing.value
    disabled.value = !disabled.value
}

const editableQuantity = ref(props.quantity)
const editableType = ref(props.type)
const editableCollection = ref(props.collection)
const editableWidth = ref(props.width)
const editableHeight = ref(props.height)
const editableCommand_height = ref(props.command_height)
const editableModel = ref(props.model)
const editableObservation = ref(props.observation)
const editableBlindTypeId = ref(props.blindTypeId)
const editableBlind_price = ref(props.blind_price)

const selectedType = (event, arrayBlindTypes) => {
    editableType.value = arrayBlindTypes[event.target.selectedIndex] || null
}

const selectedBlindTypeId = (event, arrayBlindTypes) => {
    editableBlindTypeId.value = arrayBlindTypes[event.target.selectedIndex].id || props.blindTypeId
}

const modelOptions = computed(() => {
    const typeMap = {
        'Vertical': ['Lateral', 'Central', 'Invertida'],
        'Horizontal': ['Dir', 'Esq'],
        'Rolo': ['Dir', 'Esq', 'Duplex'],
        'Romana': ['Dir', 'Esq', 'Duplex'],
        'Double Vision': ['Dir', 'Esq', 'Duplex'],
    }
    return typeMap[editableType.value] || []
})

const submitUpdate = async (event) => {
      event.preventDefault()

      const payload = {
        id: props.id,
        quantity: editableQuantity.value,
        type_id: editableBlindTypeId.value,
        width: editableWidth.value,
        height: editableHeight.value,
        command_height: editableCommand_height.value,
        model: editableModel.value,
        observation: editableObservation.value
      }
      try {
        const response = await fetchWithAuth("http://127.0.0.1:3333/blinds", {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }, authStore, router)

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Erro ao atualizar persiana')
        }
        
        notificationStore.addNotification('Persiana atualizada', 'success')
        props.getOrders(props.status)
        changeToInput()
      } catch (error) {
        console.error('Erro ao atualizar persiana: ', error.message)
        notificationStore.addNotification(error.message, 'error')
      }
    }

const deleteBlind = async () => {
  try {
        const response = await fetchWithAuth(`http://127.0.0.1:3333/blinds/${props.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        }, authStore, router)

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Erro ao excluir persiana')
        }

        notificationStore.addNotification('Persiana excluida', 'success')
        props.getOrders(props.status)
      } catch (error) {
        console.error('Erro ao excluir persiana:', error.message)
        notificationStore.addNotification(error.message, 'error')
      }
}

watch(() => props.blind_price, (newVal) => {
  editableBlind_price.value = newVal
})
</script>

<style scoped>
p {
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>