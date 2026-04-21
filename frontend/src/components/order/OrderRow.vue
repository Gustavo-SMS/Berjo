<template>
  <div class="blind-row">

    <div class="cell">
      <span class="label">Qtd</span>
      <span class="value">{{ quantity }}</span>
    </div>

    <div class="cell">
      <span class="label">Tipo</span>
      <span class="value">{{ type }}</span>
    </div>

    <div class="cell">
      <span class="label">Coleção / Cor</span>
      <span class="value">{{ collection + ' ' + color }}</span>
    </div>

    <div class="cell">
      <span class="label">Larg.</span>
      <span class="value">{{ width }}</span>
    </div>

    <div class="cell">
      <span class="label">Alt.</span>
      <span class="value">{{ height }}</span>
    </div>

    <div class="cell">
      <span class="label">Cmd.</span>
      <span class="value">{{ command_height }}</span>
    </div>

    <div class="cell">
      <span class="label">Lado</span>
      <span class="value">{{ model }}</span>
    </div>

    <div class="cell">
      <span class="label">Preço</span>
      <span class="value price">R$ {{ editableBlind_price }}</span>
    </div>

    <div
      v-if="props.status !== 'Concluído' &&
            !(authStore.userRole === 'CUSTOMER' && props.status !== 'Em espera')"
      class="cell actions"
    >
      <span class="label">Ações</span>

      <div class="dropdown">
        <button
          class="btn btn-sm btn-outline-gold"
          type="button"
          data-bs-toggle="dropdown"
        >
          ⋮
        </button>

        <ul class="dropdown-menu dark-select">
          <li>
            <button
              class="dropdown-item value"
              @click="openUpdateBlindModal"
            >
              Editar
            </button>
          </li>
          <li>
            <button
              class="dropdown-item text-danger"
              @click="openDeleteModal"
            >
              Excluir
            </button>
          </li>
        </ul>
      </div>
    </div>

  </div>

  <UpdateBlindModal ref="updateBlindModal" :blind="blindData" />

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

const props = defineProps([
  'id',
  'quantity',
  'type',
  'collection',
  'blindTypeId',
  'color',
  'width',
  'height',
  'command_height',
  'model',
  'status',
  'blind_price',
  'getOrders'
])

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
    const response = await fetchWithAuth(
      `/blinds/${props.id}`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      },
      authStore,
      router
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Erro ao excluir persiana')
    }

    notificationStore.addNotification('Persiana excluída', 'success')
    props.getOrders(props.status)

  } catch (error) {
    console.error(error.message)
    notificationStore.addNotification(error.message, 'error')
  } finally {
    showModal.value = false
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
.blind-row {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 1rem;
  padding: 1rem 0.75rem;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  transition: background 0.2s ease;
}

.blind-row:hover {
  background-color: rgba(212, 175, 55, 0.05);
}

.cell {
  display: flex;
  flex-direction: column;
}

.label {
  display: none;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-gold);
  margin-bottom: 2px;
}

.value {
  font-size: 0.95rem;
  color: var(--text-primary);
  font-weight: 500;
}

.price {
  font-weight: 600;
}

@media (max-width: 768px) {

  .blind-row {
    grid-template-columns: 1fr 1fr;
    background: rgba(255,255,255,0.02);
    border-radius: 10px;
    padding: 1rem;
    margin-bottom: 0.75rem;
  }

  .label {
    display: block;
  }

  .value {
    font-size: 1rem;
  }

  .actions {
    grid-column: span 2;
  }
}

.dropdown-menu.dark-select .dropdown-item:hover {
  background-color: rgba(212, 175, 55, 0.2);
}

.dropdown-menu.dark-select .dropdown-item.text-danger:hover {
  background-color: rgba(192, 57, 43, 0.12);
}
</style>