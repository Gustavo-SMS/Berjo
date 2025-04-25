<template>
    <div class="container">
            <form @submit.prevent="submitForm">
                <div v-if="authStore.userRole === 'ADMIN'" class="mb-3">
                    <label for="selectCustomer" class="form-label">Cliente</label>
                    <SelectCustomers id="selectCustomer" @selectedOption="selectedCustomerId" />
                </div>

                <div class="header-row">
                    <span>Quantidade</span>
                    <span>Tipo</span>
                    <span>Coleção - Cor</span>
                    <span>Largura</span>
                    <span>Altura</span>
                    <span>Alt. Comando</span>
                    <span>Modelo</span>
                </div>

                <CreateOrderRow 
                    v-for="(row, index) in orderRows" 
                    :key="index" 
                    :row="row"
                    @updateRow="updateRow(index, $event.field, $event.value)"
                    @selectedBlindTypeId="selectedBlindTypeId(index, $event.field, $event.value)"
                />
                
                <button type="submit" class="btn btn-primary w-100 mt-4">Enviar</button>
            </form>
            <button @click="addRow" class="btn btn-outline-secondary w-100 mt-3">Add linha</button>
    </div>
</template>

<script setup>
import SelectCustomers from '../../components/order/formCreateOrder/SelectCustomers.vue'
import CreateOrderRow from '../../components/order/formCreateOrder/CreateOrderRow.vue'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { fetchWithAuth } from '@/utils/api'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
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
        }, authStore, router)
        
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
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background-color: var(--color-background);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
}

.header-row {
  display: grid;
  grid-template-columns: 1fr 1.2fr 2fr 1fr 1fr 1.2fr 1fr;
  gap: 1rem;
  padding: 0.75rem 0;
  font-weight: bold;
  border-bottom: 2px solid var(--color-border);
  margin-bottom: 1rem;
  color: var(--color-text);
}
</style>