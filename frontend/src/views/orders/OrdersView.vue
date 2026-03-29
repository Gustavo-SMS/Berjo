<template>
      <div class="card-body">
        <div class="page-header d-flex justify-content-between align-items-center flex-wrap gap-3">
          <h1>Pedidos</h1>
        </div>

          <div class="d-flex align-items-center gap-2 flex-wrap mb-4">
            <div v-if="authStore.userRole === 'ADMIN'" class="input-group dark-input" style="max-width: 350px">
              <input
                v-model="searchTerm"
                type="text"
                class="form-control"
                placeholder="Buscar por nome"
              />
              <button @click="getByCustomer" class="btn btn-outline-gold">Buscar</button>
            </div>

            <v-select
              v-model="selectedStatus"
              :options="statusOptions"
              label="label"
              :reduce="option => option.value"
              :clearable="false"
              class="vselect-custom"
            />

            <div class="ms-auto">
              <RouterLink to="/createOrder" class="btn btn-primary">
                Adicionar pedido
              </RouterLink>
            </div>
          </div>

        <div v-if="paginatedOrders.length === 0" class="empty-state">
          Nenhum pedido encontrado.
        </div>

        <div
          v-else
          v-for="order in paginatedOrders"
          :key="order.id"
          class="order-card"
        >
          <div class="order-header">
            <div class="order-title-status">
              <h5 class="order-info">{{ new Date(order.created_at).toLocaleDateString('pt-BR') }}</h5>
              <h5 class="order-info">Cliente: {{ order.customer.name }}</h5>

              <div v-if="editingOrderId === order.id" class="status-edit">
                <v-select
                  v-model="statusMap[order.id]"
                  :options="statusOptions"
                  label="label"
                  :reduce="option => option.value"
                  :clearable="false"
                  class="vselect-custom status-select"
                />
                <button @click="() => changeStatus(order.id)" class="btn btn-success">
                  Confirmar
                </button>
              </div>

              <div v-else class="status-view">
                <span :class="['badge-status', statusClass(order.status)]">
                  {{ order.status }}
                </span>

                <button
                  v-if="authStore.userRole === 'ADMIN' && selectedStatus !== 'Concluído'"
                  @click="editStatus(order.id, order.status)"
                  class="btn btn-primary"
                >
                  Mudar Status
                </button>
              </div>
            </div>

            <div class="order-actions">
              <span class="order-info">Total: R$ {{ order.total_price }}</span>

              <button
                v-if="(authStore.userRole === 'ADMIN' && order.status !== 'Concluido') ||
                       (authStore.userRole === 'CUSTOMER' && order.status === 'Em espera')"
                @click="() => openDeleteModal(order.id)"
                class="btn btn-danger"
              >
                Excluir
              </button>
            </div>
          </div>

          <OrderRow
            v-for="blind in order.blind"
            :key="blind.id"
            v-bind="blindProps(blind, order.status)"
            :getOrders="getOrders"
          />
        </div>

        <nav v-if="totalPages > 1" class="pagination-wrapper">
        <ul class="pagination pagination-dark">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="goToPage(currentPage - 1)">
                Anterior
            </button>
            </li>

            <li
            v-for="page in totalPages"
            :key="page"
            class="page-item"
            :class="{ active: currentPage === page }"
            >
            <button class="page-link" @click="goToPage(page)">
                {{ page }}
            </button>
            </li>

            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="goToPage(currentPage + 1)">
                Próxima
            </button>
            </li>
        </ul>
        </nav>

      </div>

    <ConfirmationModal
      v-if="showModal"
      :show="showModal"
      message="Tem certeza que deseja excluir?"
      @confirm="() => deleteOrder(orderToDeleteId)"
      @close="showModal = false"
    />
</template>


<script setup>
import OrderRow from '@/components/order/OrderRow.vue'
import ConfirmationModal from '@/components/modal/ConfirmationModal.vue'
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { fetchWithAuth } from '@/utils/api'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

const authStore = useAuthStore()
const router = useRouter()
const notificationStore = useNotificationStore()

const selectedStatus = ref('Em espera')
const orders = ref([])

const editingOrderId = ref(null)
const statusMap = ref({})

const searchTerm = ref('')

const currentPage = ref(1)
const itemsPerPage = 2

const statusOptions = [
  { label: 'Em espera', value: 'Em espera' },
  { label: 'Em produção', value: 'Em produção' },
  { label: 'Concluído', value: 'Concluído' }
]

const getOrders = async (status, customerId) => {
    let url = `/orders/filter/`
    
    if (authStore.userRole === 'CUSTOMER') {
        customerId = authStore.customerId
    }

    const params = new URLSearchParams()
    if (status) params.append('status', status)
    if (customerId) params.append('customerId', customerId)

    if (params.toString()) {
        url += `?${params.toString()}`
    }

    try {
        const response = await fetchWithAuth(url, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' }
        }, authStore, router)

        const data = await response.json()
        
        if (!response.ok) {
            throw new Error(data.error || 'Erro ao buscar pedidos')
        }

        orders.value = Array.isArray(data) ? data : []
    } catch (error) {
        orders.value = []
        console.error(error.message)
    }
}

const getByCustomer = async () => {
    const name = encodeURIComponent(searchTerm.value.trim())

    if (!name) {
        return getOrders(selectedStatus.value)
    }

    const url = `/orders/search?name=${name}&status=${selectedStatus.value}`

    try {
        const response = await fetchWithAuth(url, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        }, authStore, router)

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao buscar pedidos')
        }   

        orders.value = Array.isArray(data) ? data : []
        currentPage.value = 1
    } catch (error) {
        orders.value = []
        console.log(error.message)
    } 
}

onMounted(() => getOrders('Em espera'))

const editStatus = (orderId, currentStatus) => {
    editingOrderId.value = orderId
    statusMap.value[orderId] = currentStatus
}

const changeStatus = async (orderId) => {
    const newStatus = statusMap.value[orderId]

    if (!newStatus) {
        alert("Selecione um status válido.")
        return
    }

    const payload = { id: orderId, status: newStatus }
    
    try {
        const response = await fetchWithAuth(`/orders/status/`, {
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(payload)
        }, authStore, router)

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Erro ao mudar status')
        }

        orders.value = []
        await getOrders(selectedStatus.value || 'Em espera')
        currentPage.value = 1
        editingOrderId.value = null
    } catch (error) {
        console.error(error.message)
        notificationStore.addNotification(error.message, 'error')
    }
}

const showModal = ref(false)
const orderToDeleteId = ref(null)

const openDeleteModal = (id) => {
    orderToDeleteId.value = id
    showModal.value = true
}

const deleteOrder = async (orderId) => {
    try {
        const response = await fetchWithAuth(`/orders/${orderId}`, {
            method: 'DELETE',
            headers: { 'Content-type': 'application/json' }
        }, authStore, router)

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Erro ao excluir pedido')
        }

        notificationStore.addNotification('Pedido excluido', 'success')

        orders.value = orders.value.filter(order => order.id !== orderId)
    } catch (error) {
        console.error(error.message)
        notificationStore.addNotification(error.message, 'error')
    } finally {
        showModal.value = false
    }
}

const statusClass = (status) => {
  switch (status) {
    case 'Em espera':
      return 'badge-espera'
    case 'Em produção':
      return 'badge-producao'
    case 'Concluido':
    case 'Concluído':
      return 'badge-concluido'
    default:
      return 'bg-secondary'
  }
}

const totalPages = computed(() =>
  Math.ceil(orders.value.length / itemsPerPage)
)

const paginatedOrders = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return orders.value.slice(start, start + itemsPerPage)
})

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

watch(searchTerm, () => {
  currentPage.value = 1
})

watch(selectedStatus, () => {
  currentPage.value = 1
  if (searchTerm.value.trim()) {
    getByCustomer()
  } else {
    getOrders(selectedStatus.value)
  }
})

const blindProps = (blind, status) => ({
  id: blind.id,
  quantity: blind.quantity,
  type: blind.type.type,
  collection: blind.type.collection,
  blindTypeId: blind.type.id,
  color: blind.type.color,
  width: blind.width,
  height: blind.height,
  command_height: blind.command_height,
  model: blind.model,
  blind_price: blind.blind_price,
  observation: blind.observation,
  status
})
</script>

<style scoped>
.order-card {
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  margin-bottom: 2rem;
  background: var(--color-surface);
}

.order-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.order-title-status {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}

.order-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.order-info {
  color: var(--text-primary);
  font-weight: bold;
}

.empty-state {
  background-color: #141414;
  border: 1px dashed rgba(212, 175, 55, 0.3);
  color: #bfbfbf;
  padding: 32px;
  border-radius: 12px;
  text-align: center;
}

.status-view {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.status-edit {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: nowrap;
}

.status-edit .form-select {
  width: auto;
  min-width: 120px;
  max-width: 200px;
  padding: 0.5rem 0.75rem;
}

.status-edit {
  padding: 0.5rem 1rem;
  white-space: nowrap;
}

.badge-status {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
  border: 1px solid transparent;
}

.badge-status:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.badge-espera {
  background-color: rgba(212, 175, 55, 0.12);
  color: var(--color-gold);
  border-color: rgba(212, 175, 55, 0.3);
}

.badge-producao {
  background-color: rgba(33, 150, 243, 0.12);
  color: #64b5f6;
  border-color: rgba(33, 150, 243, 0.3);
}

.badge-concluido {
  background-color: rgba(76, 175, 80, 0.12);
  color: #81c784;
  border-color: rgba(76, 175, 80, 0.3);
}
</style>
