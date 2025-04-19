<template>
    <div class="wrapper">
        <div class="box">
            <select v-model="selectedStatus" name="selectStatus" id="selectStatus">
                <option value="Em espera">Em espera</option>
                <option value="Em produção">Em produção</option>
                <option value="Concluido">Concluido</option>
            </select>
            <SelectCustomers v-if="authStore.userRole === 'ADMIN'" @selectedOption="selectedCustomerId" />
            <button @click="getWithFilter">Filtrar</button>
            
            <div v-for="order in orders" :key="order.id" class="order-block">
                <div class="order-header">
                    <h3>Cliente: {{ order.customer.name }}</h3>

                    <select v-if="editingOrderId === order.id" v-model="statusMap[order.id]">
                        <option value="Em espera">Em espera</option>
                        <option value="Em produção">Em produção</option>
                        <option value="Concluido">Concluído</option>
                    </select>
                    <h3 v-else>({{ order.status }})</h3>

                    <button v-if="editingOrderId === order.id" @click="changeStatus(order.id)" class="btn btn-success">Confirmar</button>
                    <button v-else v-if="authStore.userRole === 'ADMIN'" @click="editStatus(order.id, order.status)" class="btn btn-primary">Mudar Status</button>

                    <h3>Total: {{ order.total_price }}</h3>

                    <button v-if="authStore.userRole === 'ADMIN' || (authStore.userRole === 'CUSTOMER' && order.status === 'Em espera')"
                    @click="deleteOrder(order.id)" class="btn btn-danger">Excluir</button>
                </div>

                <div class="row header">
                    <div class="col-1"><strong>Qtd</strong></div>
                    <div class="col-2"><strong>Tipo</strong></div>
                    <div class="col-2"><strong>Cor</strong></div>
                    <div class="col-1"><strong>Largura</strong></div>
                    <div class="col-1"><strong>Altura</strong></div>
                    <div class="col-1"><strong>Alt. Comando</strong></div>
                    <div class="col-1"><strong>Modelo</strong></div>
                    <div class="col-1"><strong>Preço</strong></div>
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
div.wrapper {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

div.box {
    width: 70vw;
    height: 60vh;
    border-radius: 8px;
    box-shadow: 1px 1px 5px #333;
    background-color: #f8f9fa;
    padding: 30px;
    overflow: scroll;
}

.order-block {
    background: white;
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 8px;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.row.header {
    font-weight: bold;
    border-bottom: 2px solid #ddd;
    margin-bottom: 10px;
    padding-bottom: 5px;
}
</style>