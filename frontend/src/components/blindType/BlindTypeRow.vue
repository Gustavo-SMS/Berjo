<template>
  <form @submit.prevent="submitUpdate" class="blind-type-row">
    
    <div class="field">
      <span class="mobile-label">Tipo</span>
      <p>{{ props.blindType.type }}</p>
    </div>

    <div class="field">
      <span class="mobile-label">Coleção</span>
      <p>{{ props.blindType.collection }}</p>
    </div>

    <div class="field">
      <span class="mobile-label">Cor</span>
      <p>{{ props.blindType.color }}</p>
    </div>

    <div class="field">
      <span class="mobile-label">Largura Máx.</span>
      <p>{{ props.blindType.max_width }}</p>
    </div>

    <div class="field">
      <span class="mobile-label">Preço</span>
      <p>R$ {{ props.blindType.price }}</p>
    </div>

    <div class="actions" v-if="authStore.userRole === 'ADMIN'">
      <button @click="openUpdateBlindTypeModal" type="button" class="btn btn-primary btn-sm">
        Editar
      </button>
      <button @click="openDeleteModal" type="button" class="btn btn-danger btn-sm">
        Excluir
      </button>
    </div>

  </form>

        <ConfirmationModal
          v-if="showModal"
          :show="showModal"
          message="Tem certeza que deseja excluir este tipo?"
          @confirm="deleteBlindType"
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
        const response = await fetchWithAuth(`/blind_types/${props.blindType.id}`, {
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

<style scoped>
.blind-type-row {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 2fr 1fr 2fr;
  gap: 1rem;
  align-items: center;
  width: 100%;
  padding: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.field {
  display: flex;
  align-items: center;
}

.mobile-label {
  display: none;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-gold);
  margin-bottom: 2px;
}

p {
  margin: 0;
  font-size: 14px;
}

.actions {
  display: flex;
  gap: 8px;
}

@media (max-width: 768px) {
  .blind-type-row {
    grid-template-columns: 1fr;
    background: var(--color-card);
    border-radius: 12px;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .field {
    flex-direction: column;
    align-items: flex-start;
  }

  .mobile-label {
    display: block;
  }

  .actions {
    margin-top: 0.75rem;
  }
}
</style>