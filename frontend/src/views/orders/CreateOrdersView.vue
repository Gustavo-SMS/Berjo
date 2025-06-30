<template>
    <div class="container mt-5">
            <form @submit.prevent="submitForm">
                <div v-if="authStore.userRole === 'ADMIN'" class="mb-4">
                    <label for="selectCustomer" class="form-label">Cliente</label>
                    <div class="row">
                        <div class="col-12 col-sm-6 col-md-4 col-lg-4">
                            <SelectCustomers id="selectCustomer" v-model="selectedCustomer" :isActive="true" />
                        </div>
                    </div>
                </div>

                <CreateOrderRow 
                    v-for="row in orderRows" 
                    :key="row.id" 
                    :row="row"
                    :rowId="row.id"
                    :canDelete="orderRows.length > 1"
                    @updateRow="updateRow(row.id, $event.field, $event.value)"
                    @selectedBlindTypeId="selectedBlindTypeId(index, $event.field, $event.value)"
                    @deleteRow="deleteRow"
                />

                <div class="row mt-4">
                    <div class="col-12 col-md-6 mb-3 mb-md-0">
                        <button @click="addRow" type="button" class="btn btn-secondary w-100">
                            Adicionar linha
                        </button>
                    </div>
                    <div class="col-12 col-md-6">
                        <button type="submit" class="btn btn-primary w-100">
                            Enviar
                        </button>
                    </div>
                </div>
            </form>
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

let idCounter = 0

function addRow() {
    orderRows.value.push({
        id: idCounter++,
        quantity: '',
        type_id: '',
        width: '',
        height: '',
        command_height: '',
        model: '',
        observation: ''
    })
}

addRow()

function updateRow(id, field, value) {
  const row = orderRows.value.find(r => r.id === id)
  if (row) row[field] = value
}

function deleteRow(id) {
  if (orderRows.value.length > 1) {
    const index = orderRows.value.findIndex(r => r.id === id)
    if (index !== -1) {
      orderRows.value.splice(index, 1)
    }
  }
}

const selectedCustomer = ref(null)
const submitForm = async () => {
    const blinds = orderRows.value.map(({ id, ...rest }) => rest)

    const data = {
        customer: authStore.userRole === 'ADMIN' ? selectedCustomer.value.id : authStore.customerId,
        blinds
    }

    try {
        const response = await fetchWithAuth(`/orders`, {
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
        router.push('/orders')
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
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
}
</style>