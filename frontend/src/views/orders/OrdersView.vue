<template>
        <div class="container">
            <div class="filter-section d-flex flex-column flex-md-row gap-2 align-items-start align-items-md-center mb-4">
                <select v-model="selectedStatus" name="selectStatus" id="selectStatus" class="form-select w-100 w-md-auto">
                    <option value="Em espera">Em espera</option>
                    <option value="Em produção">Em produção</option>
                    <option value="Concluido">Concluido</option>
                </select>
                <SelectCustomers v-if="authStore.userRole === 'ADMIN'" @selectedOption="selectedCustomerId" />
                <button @click="getWithFilter" class="btn btn-outline-primary">Filtrar</button>
            </div>
            
            <div v-for="order in orders" :key="order.id" class="order-card">
                <div class="order-header">
                    <h5>Cliente: {{ order.customer.name }}</h5>

                    <div class="d-flex flex-wrap gap-2 align-items-center">
                        <div v-if="editingOrderId === order.id" class="d-flex gap-2 align-items-center">
                            <select v-model="statusMap[order.id]" class="form-select">
                                <option value="Em espera">Em espera</option>
                                <option value="Em produção">Em produção</option>
                                <option value="Concluido">Concluído</option>
                            </select>
                            <button v-if="editingOrderId === order.id" @click="changeStatus(order.id)" class="btn btn-success">Confirmar</button>
                            <button v-else v-if="authStore.userRole === 'ADMIN'" @click="editStatus(order.id, order.status)" class="btn btn-primary">Mudar Status</button>
                        </div>
                        <div v-else class="d-flex gap-2 align-items-center">
                            <span class="badge bg-secondary">{{ order.status }}</span>
                            <button v-if="authStore.userRole === 'ADMIN' "@click="editStatus(order.id, order.status)" class="btn btn-outline-primary">
                                Mudar Status
                            </button>
                        </div>
                
                    <span class="fw-bold">Total: R$ {{ order.total_price }}</span>

                    <button v-if="authStore.userRole === 'ADMIN' || (authStore.userRole === 'CUSTOMER' && order.status === 'Em espera')"
                    @click="deleteOrder(order.id)" class="btn btn-outline-danger">Excluir</button>
                </div>
            </div>

                <div class="order-table-header">
                    <span>Qtd</span>
                    <span>Tipo</span>
                    <span>Cor</span>
                    <span>Largura</span>
                    <span>Altura</span>
                    <span>Alt. Cmd</span>
                    <span>Modelo</span>
                    <span>Preço</span>
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
        </div>
</template>

<script setup>
import OrderRow from '@/components/order/OrderRow.vue'
import SelectCustomers from '@/components/order/formCreateOrder/SelectCustomers.vue'
import { ref, onMounted } from 'vue'
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

const customerId = ref('')

const getWithFilter = async () => {
    await getOrders(selectedStatus.value, customerId.value)
}

function selectedCustomerId(event, arrayNomes) {
    customerId.value = arrayNomes[event.target.selectedIndex].id
}

const getOrders = async (status, customerId) => {
    let url = 'http://127.0.0.1:3333/orders/filter/'
    
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
            headers: { 'Content-type': 'application/json' },
            credentials: 'include'
        }, authStore, router)

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Erro ao buscar pedidos')
        }
        const data = await response.json()
        orders.value = data
    } catch (error) {
        console.error(error.message)
        notificationStore.addNotification(error.message, 'error')
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
        const response = await fetchWithAuth(`http://127.0.0.1:3333/orders/status/`, {
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload)
        }, authStore, router)

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Erro ao mudar status')
        }

        await getOrders(selectedStatus.value || 'Em espera')

        editingOrderId.value = null
    } catch (error) {
        console.error(error.message)
        notificationStore.addNotification(error.message, 'error')
    }
}

const deleteOrder = async (orderId) => {
    if (!confirm('Tem certeza que deseja excluir este pedido?')) return

    try {
        const response = await fetchWithAuth(`http://127.0.0.1:3333/orders/${orderId}`, {
            method: 'DELETE',
            headers: { 'Content-type': 'application/json' },
            credentials: 'include'
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
    }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.order-card {
  background-color: var(--color-surface);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.order-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.order-table-header {
  display: grid;
  grid-template-columns: 1fr 2fr 2fr 1fr 1fr 1fr 1fr 1fr;
  font-weight: bold;
  padding: 0.5rem 0;
  border-bottom: 2px solid var(--color-border);
  color: var(--color-text);
}
</style>