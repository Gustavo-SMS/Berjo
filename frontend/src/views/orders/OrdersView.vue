<template>
    <div class="wrapper">
        <div class="box">
            <select v-model="selected" name="selectStatus" id="selectStatus">
                <option value=""></option>
                <option value="Em espera">Em espera</option>
                <option value="Em produção">Em produção</option>
                <option value="Concluido">Concluido</option>
            </select>
            <button @click="getByStatus">Filtrar</button>
            
            <div v-for="order in orders" :key="order.id" class="order-block">
                <div class="order-header">
                    <h3>Cliente: {{ order.customer.name }} ({{ order.status }})</h3>
                    <button @click="deleteOrder(order.id)" class="btn btn-danger">Excluir</button>
                </div>

                <div class="row header">
                    <div class="col-1"><strong>Qtd</strong></div>
                    <div class="col-2"><strong>Tipo</strong></div>
                    <div class="col-2"><strong>Cor</strong></div>
                    <div class="col-1"><strong>Largura</strong></div>
                    <div class="col-1"><strong>Altura</strong></div>
                    <div class="col-1"><strong>Alt. Comando</strong></div>
                    <div class="col-2"><strong>Modelo</strong></div>
                </div>

                <OrderRow 
                    v-for="blind in order.blind" 
                    :key="blind.id"
                    :id="blind.id"
                    :quantity="blind.quantity"
                    :type="blind.type.type"
                    :collection="blind.type.collection"
                    :color="blind.type.color"
                    :width="blind.width"
                    :height="blind.height"
                    :command_height="blind.command_height"
                    :model="blind.model"
                    :getByStatus="getByStatus"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import OrderRow from '@/components/order/OrderRow.vue';
import { ref, onMounted } from 'vue';

const selected = ref('')
const orders = ref([])

const getOrders = async (status) => {
    try {
        const response = await fetch(`http://127.0.0.1:3333/orders/status/${status}`, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' },
            credentials: 'include'
        })

        if (!response.ok) throw new Error('Erro ao buscar pedidos')

        const data = await response.json()
        orders.value = data
    } catch (error) {
        console.error(error.message)
    }
}

onMounted(() => getOrders('Em espera'))

const getByStatus = async (event) => {
    if (selected.value) getOrders(selected.value)
}

const deleteOrder = async (orderId) => {
    if (!confirm('Tem certeza que deseja excluir este pedido?')) return

    try {
        const response = await fetch(`http://127.0.0.1:3333/orders/${orderId}`, {
            method: 'DELETE',
            headers: { 'Content-type': 'application/json' },
            credentials: 'include'
        })

        if (!response.ok) throw new Error('Erro ao excluir pedido')

        orders.value = orders.value.filter(order => order.id !== orderId)
    } catch (error) {
        console.error(error.message)
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