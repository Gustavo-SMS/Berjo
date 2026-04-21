<template>
  <main class="page-content">
    <div class="card">
      <div class="card-body">

        <div class="page-header">
          <h1>Criar Pedido</h1>
        </div>

        <form @submit.prevent="submitForm">

          <div v-if="authStore.userRole === 'ADMIN'" class="mb-4">
            <label class="form-label">Cliente</label>
            <div style="max-width: 420px">
              <SelectCustomers
                v-model="selectedCustomer"
                :isActive="true"
              />
            </div>
          </div>

          <div class="row list-header d-none d-md-flex">
            <div class="col-lg-1">Qtd</div>
            <div class="col-lg-2">Tipo</div>
            <div class="col-lg-3">Modelo</div>
            <div class="col-lg-1">Largura</div>
            <div class="col-lg-1">Altura</div>
            <div class="col-lg-1">Comando</div>
            <div class="col-lg-2">Lado</div>
            <div class="col-lg-1">Ação</div>
          </div>

          <CreateOrderRow 
            v-for="row in orderRows" 
            :key="row.id" 
            :row="row"
            :rowId="row.id"
            :canDelete="orderRows.length > 1"
            @updateRow="updateRow(row.id, $event.field, $event.value)"
            @deleteRow="deleteRow"
          />

          <div class="col-12 dark-input">
            <label class="form-label">Observações</label>
            <input
              type="text"
              class="form-control"
              placeholder="Observações"
              v-model="observation"
            >
          </div>

          <div class="d-flex gap-3 mt-4 flex-wrap">
            <button
              @click="addRow"
              type="button"
              :disabled="orderRows.length >= MAX_ROWS"
              class="btn btn-secondary flex-fill"
            >
              Adicionar linha ({{ orderRows.length }} / {{ MAX_ROWS }})
            </button>

            <button
              type="submit"
              class="btn btn-primary flex-fill"
            >
              Enviar
            </button>
          </div>

        </form>

      </div>
    </div>
  </main>
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

const orderRows = ref([])
const observation = ref('')
const MAX_ROWS = 5

let idCounter = 0

function addRow() {
    if (orderRows.value.length >= MAX_ROWS) {
      notificationStore.addNotification(`Máximo de ${MAX_ROWS} itens por pedido.`, 'warning')
      return
    }

    orderRows.value.push({
        id: idCounter++,
        quantity: '',
        type_id: '',
        width: '',
        height: '',
        command_height: '',
        model: ''
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

    if (authStore.userRole === 'ADMIN' && !selectedCustomer.value) {
        notificationStore.addNotification('Selecione um cliente', 'error')
        return
    }

    const data = {
        customer: authStore.userRole === 'ADMIN' ? selectedCustomer.value.id : authStore.customerId,
        blinds,
        observation: observation.value
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
select,
:deep(.select-customers) {
  max-width: 420px;
}

.list-header {
  color: var(--color-gold);
  font-weight: 600;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 0.5rem;
}
</style>