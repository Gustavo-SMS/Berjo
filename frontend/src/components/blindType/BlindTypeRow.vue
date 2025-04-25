<template>
    <form @submit.prevent="submitUpdate" class="row align-items-center mb-3 gx-2">
        <div class="col-2">
            <input v-if="isEditing" type="text" class="form-control" v-model="editableType" id="type" name="type">
            <p v-else class="mb-0">{{ type }}</p>
        </div>
        <div class="col-2">
            <input v-if="isEditing" type="text" class="form-control" v-model="editableCollection" id="collection" name="collection">
            <p v-else class="mb-0">{{ collection }}</p>
        </div>
        <div class="col-1">
            <input v-if="isEditing" type="text" class="form-control" v-model="editableColor" id="color" name="color">
            <p v-else class="mb-0">{{ color }}</p>
        </div>
        <div class="col-2">
            <input v-if="isEditing" type="number" class="form-control" v-model="editableMaxWidth" id="max_width" name="max_width" min="0">
            <p v-else class="mb-0">{{ max_width }}</p>
        </div>
        <div class="col-1">
            <input v-if="isEditing" type="number" class="form-control" v-model="editablePrice" id="price" name="price" min="0" step="0.01">
            <p v-else class="mb-0">R$ {{ price }}</p>
        </div>

        <div v-if="authStore.userRole === 'ADMIN'" class="col-4 d-flex gap-2 justify-content-end">
          <button @click="changeToInput" type="button" class="btn btn-outline-warning">Editar</button>
          <button type="submit" class="btn btn-success" :disabled="disabled">Enviar</button>
          <button @click="openDeleteModal" type="button" class="btn btn-outline-danger">Excluir</button>
        </div>
      </form>

      <Teleport to="body">
        <ConfirmationModal
          v-if="showModal"
          :show="showModal"
          message="Tem certeza que deseja excluir este tipo?"
          :onConfirm="deleteCustomer"
          @close="showModal = false"
        />
      </Teleport>
</template>
                        
<script setup>
import { ref } from 'vue'
import ConfirmationModal from '@/components/modal/ConfirmationModal.vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { useAuthStore } from '@/stores/authStore'
import { fetchWithAuth } from '@/utils/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const props = defineProps(['id', 'type', 'collection', 'color', 'max_width', 'price', 'getBlindTypes'])

const showModal = ref(false)

const openDeleteModal = () => {
  showModal.value = true
}

const isEditing = ref(false)
let disabled = ref(true)

const changeToInput = () => {
    isEditing.value = !isEditing.value
    disabled.value = !disabled.value
}

const editableType = ref(props.type)
const editableCollection = ref(props.collection)
const editableColor = ref(props.color)
const editableMaxWidth = ref(props.max_width)
const editablePrice = ref(props.price)

const submitUpdate = async (event) => {
      event.preventDefault();

      const payload = {
        id: props.id,
        type: editableType.value,
        collection: editableCollection.value,
        color: editableColor.value,
        max_width: editableMaxWidth.value,
        price: editablePrice.value
      }

      try {
        const response = await fetchWithAuth("http://127.0.0.1:3333/blind_types", {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }, authStore, router)

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Erro ao atualizar tipo')
        }

        notificationStore.addNotification('Tipo atualizado com sucesso!', 'success')

        props.getBlindTypes()
        changeToInput()
      } catch (error) {
        console.error('Erro ao enviar os dados:', error.message)
        notificationStore.addNotification(error.message, 'error')
      }
    }

const deleteCustomer = async () => {
  try {
        const response = await fetchWithAuth(`http://127.0.0.1:3333/blind_types/${props.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        }, authStore, router)

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Erro ao excluir tipo')
        }

        notificationStore.addNotification('Tipo excluído com sucesso', 'success')
        
        props.getBlindTypes()
      } catch (error) {
        console.error('Erro ao excluir cliente:', error.message)
        notificationStore.addNotification(error.message, 'error')
      }
}

</script>

<style>
p {
  margin: 0;
  padding: 0;
  font-size: 14px;
}
</style>