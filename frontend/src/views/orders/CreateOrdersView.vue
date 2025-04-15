<template>
    <div class="wrapper">
        <div class="box">
            <form>
                <div v-if="authStore.userRole === 'ADMIN'">
                    <label for="" class="form-label">Cliente</label>
                    <SelectCustomers @selectedOption="selectedCustomerId" />
                </div>

                <div class="row">
                    <div class="col-1">
                        <label for="" class="form-label">Quantidade</label>
                    </div>
                    <div class="col-2">
                        <label for="" class="form-label">Tipo</label>
                    </div>
                    <div class="col-4">
                        <label for="" class="form-label">Coleção - Cor</label>
                    </div>
                    <div class="col-1">
                        <label for="" class="form-label">Largura</label>
                    </div>
                    <div class="col-1">
                        <label for="" class="form-label">Altura</label>
                    </div>
                    <div class="col-1">
                        <label for="" class="form-label">Alt.Comando</label>
                    </div>
                    <div class="col-1">
                        <label for="" class="form-label">Modelo</label>
                    </div>
                </div>

                <CreateOrderRow 
                    v-for="(row, index) in orderRows" 
                    :key="index" 
                    :row="row"
                    @updateRow="updateRow(index, $event.field, $event.value)"
                    @selectedBlindTypeId="selectedBlindTypeId(index, $event.field, $event.value)"
                />
                
                    <button @click="submitForm" type="submit" class="btn btn-primary w-100 py-1">Enviar</button>
                </form>
                <button @click="addRow" class="btn btn-primary w-100 py-1">Add linha</button>
        </div>
    </div>
</template>

<script setup>
import SelectCustomers from '../../components/order/formCreateOrder/SelectCustomers.vue'
import CreateOrderRow from '../../components/order/formCreateOrder/CreateOrderRow.vue'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { fetchWithAuth } from '@/utils/api'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const customerId = ref('')
const orderRows = ref([])

function addRow() {
    orderRows.value.push({
        quantity: '',
        type_id: '',
        width: '',
        height: '',
        command_height: '',
        model: '',
        observation: ''
    })
}

function updateRow(index, field, value) {
    orderRows.value[index][field] = value
}

function selectedCustomerId(event, arrayNomes) {
    customerId.value = arrayNomes[event.target.selectedIndex].id
}

const submitForm = async (event) => {
    event.preventDefault()

    const data = {
        customer: customerId.value,
        blinds: orderRows.value
    }
    
    try {
        const response = await fetchWithAuth('http://127.0.0.1:3333/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Erro ao criar pedido')
        }

        notificationStore.addNotification('Pedido criado com sucesso!', 'success')
    } catch (error) {
        console.log(error.message)
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
</style>