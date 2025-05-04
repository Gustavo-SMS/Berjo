<template>
    <form @submit.prevent="submitUpdate" class="order-row-wrapper">
      <div class="order-row">
        <div>
          <p>{{ quantity }}</p>
        </div>
        
        <div>
            <p>{{ type }}</p>
        </div>
        
        <div>
            <p>{{ collection + ' ' + color }}</p>
        </div>
        
        <div>
            <p>{{ width }}</p>
        </div>
        <div>
            <p>{{ height }}</p>
        </div>
        <div>
          <p>{{ command_height }}</p>
        </div>
        <div>
            <p>{{ model }}</p>
        </div>
        <div>
            <p>{{ editableBlind_price }}</p>
        </div>
        
        <div class="order-actions">
            <button @click="openUpdateBlindModal" type="button" class="btn btn-primary">Editar</button>
            <UpdateBlindModal ref="updateBlindModal" :blind="blindData" />
            <button v-if="authStore.userRole === 'ADMIN'" @click="openDeleteModal" type="button" class="btn btn-danger">Excluir</button>
        </div>
      </div>
        
        <template class="observation">
            <label for="observation">Observações: </label>
            <p>{{ observation }}</p>
        </template>
    </form>

      <ConfirmationModal
        v-if="showModal"
        :show="showModal"
        message="Tem certeza que deseja excluir?"
        :onConfirm="deleteBlind"
        @close="showModal = false"
      />
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { fetchWithAuth } from '@/utils/api'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import ConfirmationModal from '@/components/modal/ConfirmationModal.vue'
import UpdateBlindModal from '@/components/modal/UpdateBlindModal.vue'

const props = defineProps(['id', 'quantity', 'type', 'collection', 'blindTypeId', 'color', 
'width', 'height', 'command_height', 'model', 'observation', 'status', 'blind_price', 'getOrders'])

const authStore = useAuthStore()
const router = useRouter()
const notificationStore = useNotificationStore()
const showModal = ref(false)

const editableBlind_price = ref(props.blind_price)

const openDeleteModal = () => {
  showModal.value = true
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

const blindData = ref({})
const updateBlindModal = ref(null)

const openUpdateBlindModal = async () => {
  blindData.value = {
    id: props.id,
    quantity: props.quantity,
    type: props.type,
    collection: props.collection,
    blindTypeId: props.blindTypeId,
    color: props.color,
    width: props.width,
    height: props.height,
    command_height: props.command_height,
    model: props.model,
    observation: props.observation,
    status: props.status,
    getOrders: props.getOrders
  }
  await nextTick()
  updateBlindModal.value?.showModal()
}

watch(() => props.blind_price, (newVal) => {
  editableBlind_price.value = newVal
})
</script>

<style scoped>
.order-row-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.order-row {
  display: grid;
  grid-template-columns: 0.5fr 1.5fr 1.5fr 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 0.5rem;
  align-items: center;
}

.order-actions {
  display: flex;
  justify-content: flex-start;
  gap: 8px;
}

.observation {
  display: flex;
  flex-direction: column;
}

p {
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 768px) {
  .order-row, .order-table-header {
    grid-template-columns: repeat(2, 1fr);
  }

  .order-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .observation {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>