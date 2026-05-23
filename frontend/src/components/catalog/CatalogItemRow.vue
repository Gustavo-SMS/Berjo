<template>
  <form @submit.prevent="submitUpdate" class="catalog-item-row">
    
    <div class="field">
      <span class="mobile-label">Tipo</span>
      <p>{{ props.catalogItem.type }}</p>
    </div>

    <div class="field">
      <span class="mobile-label">Coleção</span>
      <p>{{ props.catalogItem.collection }}</p>
    </div>

    <div class="field">
      <span class="mobile-label">Cor</span>
      <p>{{ props.catalogItem.color }}</p>
    </div>

    <div class="field">
      <span class="mobile-label">Largura Máx.</span>
      <p>{{ props.catalogItem.max_width }}</p>
    </div>

    <div class="field">
      <span class="mobile-label">Preço</span>
      <p>{{ formattedPrice }}</p>
    </div>

    <div class="actions justify-content-end" v-if="authStore.userRole === 'ADMIN'">
      <button @click="openUpdateCatalogItemModal" type="button" class="btn btn-primary btn-sm">
        Editar
      </button>
      <button @click="openDeleteModal" type="button" class="btn btn-danger btn-sm">
        Excluir
      </button>
    </div>

  </form>

    <UpdateCatalogItemModal :catalogItem="catalogItemData" ref="updateCatalogItemModal" />

        <ConfirmationModal
          v-if="showModal"
          :show="showModal"
          message="Tem certeza que deseja excluir este item?"
          @confirm="deleteCatalogItem"
          @close="showModal = false"
        />
</template>
                        
<script setup>
import { ref, nextTick, computed } from 'vue'
import UpdateCatalogItemModal from '../modal/UpdateCatalogItemModal.vue'
import ConfirmationModal from '@/components/modal/ConfirmationModal.vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { useAuthStore } from '@/stores/authStore'
import { fetchWithAuth } from '@/utils/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const props = defineProps(['catalogItem', 'getCatalogItems'])

const showModal = ref(false)

const openDeleteModal = () => {
  showModal.value = true
}

const deleteCatalogItem = async () => {
  try {
        const response = await fetchWithAuth(`/catalog-items/${props.catalogItem.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        }, authStore, router)

        if (!response.ok) {
            throw new Error('Erro ao excluir item')
        }

        notificationStore.addNotification('Item excluído com sucesso', 'success')
        
        props.getCatalogItems()
      } catch (error) {
        console.error('Erro ao excluir item:', error.message)
        notificationStore.addNotification(error.message, 'error')
      }
}

const formattedPrice = computed(() => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(props.catalogItem.price || 0)
})

const catalogItemData = ref({})
const updateCatalogItemModal = ref(null)

const openUpdateCatalogItemModal = async () => {
  catalogItemData.value = {
    id: props.catalogItem.id,
    type: props.catalogItem.type,
    collection: props.catalogItem.collection,
    color: props.catalogItem.color,
    max_width: props.catalogItem.max_width,
    price: props.catalogItem.price,
    getCatalogItems: props.getCatalogItems
  }
  await nextTick()
  updateCatalogItemModal.value?.showModal()
}
</script>

<style scoped>
.catalog-item-row {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 2fr 1fr 2fr;
  gap: 1rem;
  align-items: center;
  width: 100%;
  padding: 0.75rem 0;
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
  text-transform: capitalize;
}

.actions {
  display: flex;
  gap: 8px;
  justify-content: end;
}

@media (max-width: 768px) {
  .catalog-item-row {
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