<template>
  <div class="card customer-card">
    <div class="card-body">

      <div class="customer-header">
        <div>
          <h2 class="customer-name mb-1" :class="{ truncated: !isExpanded }">
            {{ props.customer.name }}
          </h2>

          <h3 class="customer-debt mb-0">
            {{ formattedDebt }}
          </h3>
        </div>

        <span
          class="status-badge"
          :class="props.customer.isActive ? 'active' : 'inactive'"
        >
          {{ props.customer.isActive ? 'ATIVO' : 'INATIVO' }}
        </span>
      </div>

      <div class="customer-info mt-3">
        <div class="info-item mb-2">
          <i class="bi bi-envelope me-2"></i>
          <span>{{ props.customer.email }}</span>
        </div>

        <div class="info-item mb-2">
          <i class="bi bi-telephone me-2"></i>
          <span>{{ formatPhone(props.customer.phone) }}</span>
        </div>

        <div class="info-item">
          <i class="bi bi-geo-alt me-2"></i>
          <span>
            {{ props.customer.address.city }} -
            {{ props.customer.address.state }}
          </span>
        </div>
      </div>

      <transition name="expand">
        <div v-if="isExpanded" class="pt-4 mt-3 border-top-gold">

          <div class="row g-3">
            <div
              v-for="(field, index) in hiddenFields"
              :key="index"
              class="col-12 col-md-6 col-lg-4"
            >
              <label class="form-label">
                {{ field.label }}
              </label>

              <p class="form-control-plaintext text-primary-custom">
                {{ field.value || '-' }}
              </p>
            </div>
          </div>

          <div class="col-12 d-flex justify-content-end gap-2 mt-3">
            <button @click="openUpdateCustomerModal" type="button" class="btn btn-primary">Editar</button>
            <button
              v-if="authStore.userRole === 'ADMIN' && canDelete"
              @click="props.customer.isActive ? openDeactivateModal() : reactivateCustomer()"
              :class="props.customer.isActive ? 'btn btn-danger' : 'btn btn-outline-gold'"
              type="button"
            >
              {{ props.customer.isActive ? 'Desativar' : 'Reativar' }}
            </button>
            <button
              v-if="authStore.userRole === 'ADMIN' && canDelete && !props.customer.isActive"
              @click="openDeleteModal()"
              class="btn btn-danger"
              type="button"
            >
              Excluir
            </button>
          </div>

        </div>
      </transition>

      <button
        class="btn btn-outline-gold w-100 mt-4"
        @click="toggleDetails"
      >
        {{ isExpanded ? 'Ocultar informações' : 'Ver mais informações' }}
      </button>

    </div>
  </div>
  <UpdateCustomerModal ref="updateCustomerModal" :customer="customerData" />

  <ConfirmationModal
    v-if="showModal"
    :show="showModal"
    message="Tem certeza que deseja desativar este cliente?"
    :onConfirm="deactivateCustomer"
    @close="showModal = false"
  />

  <DeleteConfirmationModal
    v-if="showDeleteModal"
    :show="showDeleteModal"
    message="Tem certeza que deseja excluir este cliente? Todos os dados relacionados a esse cliente serão excluídos!"
    :onConfirm="deleteCustomer"
    @close="showDeleteModal = false"
  />
</template>

<script setup>
import { ref, nextTick, computed } from 'vue'
import ConfirmationModal from '@/components/modal/ConfirmationModal.vue'
import UpdateCustomerModal from '@/components/modal/UpdateCustomerModal.vue'
import DeleteConfirmationModal from '@/components/modal/DeleteConfirmationModal.vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { useAuthStore } from '@/stores/authStore'
import { fetchWithAuth } from '@/utils/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const props = defineProps(['customer', 'getCustomers', 'canDelete'])

const isExpanded = ref(false)

const toggleDetails = () => {
  isExpanded.value = !isExpanded.value
}

const formattedDebt = computed(() => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(props.customer.debt || 0)
})

const hiddenFields = computed(() => [
  { label: 'CPF/CNPJ', value: formatDocNumber(props.customer.docNumber) },
  { label: 'Rua', value: props.customer.address.street },
  { label: 'Número', value: props.customer.address.house_number },
  { label: 'Complemento', value: props.customer.address.complement },
  { label: 'Bairro', value: props.customer.address.district },
  { label: 'CEP', value: formatCEP(props.customer.address.zip) }
])

function formatDocNumber(doc) {
  const cleaned = doc.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  } else if (cleaned.length === 14) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }
  return doc
}

function formatPhone(phone) {
  if (!phone) return ''
  const cleaned = String(phone).replace(/\D/g, '')
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return phone
}

function formatCEP(cep) {
  if (!cep) return ''
  return String(cep).replace(/^(\d{5})(\d{3})$/, '$1-$2')
}

const showModal = ref(false)

const openDeactivateModal = () => {
  showModal.value = true
}

const deactivateCustomer = async () => {
  try {
        const response = await fetchWithAuth(`/customers/${props.customer.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          }
        },authStore, router)

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Erro ao desativar cliente')
        }

        notificationStore.addNotification('Cliente desativado', 'success')
        
        showModal.value = false
        props.getCustomers()
      } catch (error) {
        console.error('Erro ao desativar cliente:', error.message)
        notificationStore.addNotification(error.message, 'error')
      }
}

const reactivateCustomer = async () => {
    try {
        const response = await fetchWithAuth(`/customers/reactivate/${props.customer.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          }
        },authStore, router)

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Erro ao reativar cliente')
        }
        
        props.getCustomers()
      } catch (error) {
        console.error('Erro ao reativar cliente:', error.message)
        notificationStore.addNotification(error.message, 'error')
      }
}

const showDeleteModal = ref(false)

const openDeleteModal = () => {
  showDeleteModal.value = true
}

const deleteCustomer = async () => {
  try {
        const response = await fetchWithAuth(`/customers/${props.customer.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        },authStore, router)

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Erro ao excluir cliente')
        }

        notificationStore.addNotification('Cliente foi excluído', 'success')
        
        showModal.value = false
        props.getCustomers()
      } catch (error) {
        console.error('Erro ao excluir cliente:', error.message)
        notificationStore.addNotification(error.message, 'error')
      }
}

const customerData = ref({})
const updateCustomerModal = ref(null)

const openUpdateCustomerModal = async () => {
  customerData.value = {
    id: props.customer.id,
    name: props.customer.name,
    email: props.customer.email,
    docNumber: props.customer.docNumber,
    phone: props.customer.phone,
    street: props.customer.address.street,
    house_number: props.customer.address.house_number,
    complement: props.customer.address.complement,
    city: props.customer.address.city,
    district: props.customer.address.district,
    state: props.customer.address.state,
    zip: props.customer.address.zip,
    debt: props.customer.debt,
    getCustomers: props.getCustomers
  }
  await nextTick()
  updateCustomerModal.value?.showModal()
}
</script>

<style scoped>
.customer-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.customer-header > div {
  flex: 1;
  min-width: 0;
}

.customer-name {
  color: var(--text-primary);
  font-weight: 600;
  text-transform: capitalize;
}

.customer-name.truncated {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.customer-debt {
  color: var(--color-gold);
  font-weight: 600;
}

.status-badge {
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  font-size: 0.7rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-weight: 500;
}

.status-badge.active {
  background-color: rgba(212, 175, 55, 0.15);
  color: var(--color-gold);
}

.status-badge.inactive {
  background-color: rgba(192, 57, 43, 0.15);
  color: var(--color-danger);
}

.info-item {
  display: flex;
  align-items: center;
}

.info-item i {
  color: var(--color-gold-soft);
}

.border-top-gold {
  border-top: 1px solid rgba(212, 175, 55, 0.15);
}

.expand-enter-active,
.expand-leave-active {
  transition: all var(--transition-base);
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.customer-card:hover {
  transform: translateY(-2px);
}
</style>