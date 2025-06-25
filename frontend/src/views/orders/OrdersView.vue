<template>
        <div class="container-lg px-3 mt-5">
            <div class="row g-3 align-items-center mb-4">
                <div v-if="authStore.userRole === 'ADMIN'" class="col-md-6 col-lg-4">
                    <div class="input-group">
                        <input v-model="searchTerm" type="text" class="form-control" placeholder="Buscar por nome"/>
                        <button @click="getByCustomer" class="btn btn-secondary">Buscar</button>
                    </div>
                </div>
                <div class="col-md-6 col-lg-4">
                    <select v-model="selectedStatus" name="selectStatus" id="selectStatus" class="form-select">
                        <option value="Em espera">Em espera</option>
                        <option value="Em produção">Em produção</option>
                        <option value="Concluido">Concluido</option>
                    </select>
                </div>
            </div>

            <div v-if="paginatedOrders.length === 0" class="order-card text-center">
                <p class="mb-0">Nenhum pedido encontrado.</p>
            </div>

            <div v-else v-for="order in paginatedOrders" :key="order.id" class="order-card">
                <div class="order-header">
                    <div class="order-title-status">
                        <h5 class="order-client-name">Cliente: {{ order.customer.name }}</h5>

                        <div v-if="editingOrderId === order.id" class="status-edit">
                            <select v-model="statusMap[order.id]" class="form-select">
                                <option value="Em espera">Em espera</option>
                                <option value="Em produção">Em produção</option>
                                <option value="Concluido">Concluído</option>
                            </select>
                            <button @click="() => changeStatus(order.id)" class="btn btn-success">Confirmar</button>
                        </div>

                        <div v-else class="status-view">
                            <span :class="['badge-status', statusClass(order.status)]">{{ order.status }}</span>
                            <button
                            v-if="authStore.userRole === 'ADMIN' && selectedStatus !== 'Concluido'"
                            @click="editStatus(order.id, order.status)"
                            class="btn btn-primary"
                            >
                            Mudar Status
                            </button>
                        </div>
                    </div>

                    <div class="order-actions">
                        <span class="fw-bold">Total: R$ {{ order.total_price }}</span>

                        <button
                            v-if="(authStore.userRole === 'ADMIN' && order.status !== 'Concluido') || (authStore.userRole === 'CUSTOMER' && order.status === 'Em espera')"
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
                    :id="blind.id"
                    :quantity="blind.quantity"
                    :type="blind.type.type"
                    :collection="blind.type.collection"
                    :blindTypeId="blind.type.id"
                    :color="blind.type.color"
                    :width="blind.width"
                    :height="blind.height"
                    :command_height="blind.command_height"
                    :model="blind.model"
                    :blind_price="blind.blind_price"
                    :observation="blind.observation"
                    :status="order.status"
                    :getOrders="getOrders"
                />
            </div>

            <nav v-if="totalPages > 1" class="mt-3">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button class="page-link" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
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
                  <button class="page-link" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">
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
</script>

<style scoped>
.order-card {
  background-color: var(--color-surface);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.order-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.order-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}

.order-table-header {
  display: grid;
  grid-template-columns: 0.5fr 1.5fr 1.5fr 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 0.5rem;
  padding: 0.5rem 0;
  font-weight: bold;
  border-bottom: 2px solid var(--color-border);
  color: var(--color-text);
}

.order-title-status {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.order-client-name {
  margin: 0;
}

.status-edit,
.status-view {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.badge-status {
  font-size: 1rem;
  padding: 0.375rem 0.75rem;
  line-height: 1.5;
  display: inline-flex;
  align-items: center;
  margin-right: 0.5rem;
  height: calc(1rem * 1.5 + 0.75rem);
  border-radius: var(--border-radius);
  font-weight: 500;
  color: white;
}

.badge-espera {
  background-color: var(--color-accent);
  color: var(--color-text);
}

.badge-producao {
  background-color: var(--color-info);
}

.badge-concluido {
  background-color: #28a745;
}
</style>