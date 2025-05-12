<template>
    <form @submit.prevent="submitUpdate" class="blind-type-row">
        <div>
            <p>{{ props.blindType.type }}</p>
        </div>
        <div>
            <p>{{ props.blindType.collection }}</p>
        </div>
        <div>
            <p>{{ props.blindType.color }}</p>
        </div>
        <div>
            <p>{{ props.blindType.max_width }}</p>
        </div>
        <div>
            <p>R$ {{ props.blindType.price }}</p>
        </div>

        <div class="actions" v-if="authStore.userRole === 'ADMIN'">
            <button @click="openUpdateBlindTypeModal" type="button" class="btn btn-primary">Editar</button>
            <UpdateBlindTypeModal ref="updateBlindTypeModal" :blindType="blindTypeData" />
            <button v-if="authStore.userRole === 'ADMIN'" @click="openDeleteModal" type="button" class="btn btn-danger">Excluir</button>
        </div>
      </form>

        <ConfirmationModal
          v-if="showModal"
          :show="showModal"
          message="Tem certeza que deseja excluir este tipo?"
          :onConfirm="deleteBlindType"
          @close="showModal = false"
        />
</template>
                        
<script setup>
import { ref, nextTick } from 'vue'
import UpdateBlindTypeModal from '../modal/UpdateBlindTypeModal.vue'
import ConfirmationModal from '@/components/modal/ConfirmationModal.vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { useAuthStore } from '@/stores/authStore'
import { fetchWithAuth } from '@/utils/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const props = defineProps(['blindType', 'getBlindTypes'])

const showModal = ref(false)

const openDeleteModal = () => {
  showModal.value = true
}

const deleteBlindType = async () => {
  try {
        const response = await fetchWithAuth(`http://127.0.0.1:3333/blind_types/${props.blindType.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        }, authStore, router)

        if (!response.ok) {
            throw new Error('Erro ao excluir tipo')
        }

        notificationStore.addNotification('Tipo excluído com sucesso', 'success')
        
        props.getBlindTypes()
      } catch (error) {
        console.error('Erro ao excluir tipo de persiana:', error.message)
        notificationStore.addNotification(error.message, 'error')
      }
}

const blindTypeData = ref({})
const updateBlindTypeModal = ref(null)

const openUpdateBlindTypeModal = async () => {
  blindTypeData.value = {
    id: props.blindType.id,
    type: props.blindType.type,
    collection: props.blindType.collection,
    color: props.blindType.color,
    max_width: props.blindType.max_width,
    price: props.blindType.price,
    getBlindTypes: props.getBlindTypes
  }
  await nextTick()
  updateBlindTypeModal.value?.showModal()
}
</script>

<style>
p {
  margin: 0;
  padding: 0;
  font-size: 14px;
}

.blind-type-row {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 2fr 1fr 2fr;
  gap: 1rem;
  align-items: center;
  width: 100%;
  padding: 0.75rem;
}

.blind-type-row > div {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.actions {
  display: flex;
  justify-content: flex-start;
  gap: 8px;
}

.blind-type-row button {
  width: auto;
  min-width: 70px;
}

@media (max-width: 768px) {
  .blind-type-row {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.d-flex {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  align-items: center;
}

button {
  white-space: nowrap;
}
</style>