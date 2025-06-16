<template>
  <form @submit.prevent="submitUpdate" class="order-row-wrapper">
    <div class="card p-3">
      <div class="row gy-3 align-items-start">
        <div class="col-6 col-md-1">
          <label class="form-label fw-semibold">Qtd.</label>
          <p class="mb-0">{{ quantity }}</p>
        </div>

        <div class="col-6 col-md-2">
          <label class="form-label fw-semibold">Tipo</label>
          <p class="mb-0">{{ type }}</p>
        </div>

        <div class="col-12 col-md-3">
          <label class="form-label fw-semibold">Coleção / Cor</label>
          <p class="mb-0">{{ collection + ' ' + color }}</p>
        </div>

        <div class="col-6 col-md-1">
          <div class="col-6 col-md-1">
            <label class="form-label fw-semibold label-full">Largura</label>
            <label class="form-label fw-semibold label-short">Larg.</label>
            <p class="mb-0">{{ width }}</p>
          </div>
        </div>

        <div class="col-6 col-md-1">
          <label class="form-label fw-semibold">Altura</label>
          <p class="mb-0">{{ height }}</p>
        </div>

        <div class="col-6 col-md-1">
          <div class="col-6 col-md-1">
            <label class="form-label fw-semibold label-full">Comando</label>
            <label class="form-label fw-semibold label-short">Cmd.</label>
            <p class="mb-0">{{ command_height }}</p>
          </div>
        </div>

        <div class="col-6 col-md-1">
          <label class="form-label fw-semibold">Lado</label>
          <p class="mb-0">{{ model }}</p>
        </div>

        <div class="col-6 col-md-1">
          <label class="form-label fw-semibold">Preço</label>
          <p class="mb-0">{{ editableBlind_price }}</p>
        </div>

        <div class="col-6 col-md-1" v-if="props.status !== 'Concluido' && !(authStore.userRole === 'CUSTOMER' && props.status !== 'Em espera')">
          <label class="form-label fw-semibold">Ações</label>
          <div class="dropdown">
            <button
              class="btn"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              ⋮
            </button>
            <ul class="dropdown-menu">
              <li>
                <button class="dropdown-item" @click="openUpdateBlindModal">Editar</button>
              </li>
              <li>
                <button class="dropdown-item text-danger" @click="openDeleteModal">Excluir</button>
              </li>
            </ul>
          </div>
        </div>

        <div class="col-12">
          <label class="form-label fw-semibold">Observações</label>
          <p class="mb-0">{{ observation }}</p>
        </div>
      </div>
    </div>

    <UpdateBlindModal ref="updateBlindModal" :blind="blindData" />

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
        const response = await fetchWithAuth(`/blinds/${props.id}`, {
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
.form-label {
  white-space: nowrap;
}

.label-full {
  display: block;
}

.label-short {
  display: none;
}

@media (max-width: 999.98px) and (min-width: 768px) {
  .label-full {
    display: none;
  }

  .label-short {
    display: block;
  }
}

</style>