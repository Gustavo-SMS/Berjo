<template>
    <form @submit.prevent="submitUpdate" class="customer-row">
        <div>
            <p>{{ name }}</p>
        </div>
        <div>
            <p>{{ email }}</p>
        </div>
        <div>
            <p>{{ docNumber }}</p>
        </div>
        <div>
            <p>{{ phone }}</p>
        </div>
        <div>
            <p>{{ street }}</p>
        </div>
        <div>
            <p>{{ house_number }}</p>
        </div>
        <div>
            <p>{{ complement }}</p>
        </div>
        <div>
            <p>{{ city }}</p>
        </div>
        <div>
            <p>{{ district }}</p>
        </div>
        <div>
            <p>{{ state }}</p>
        </div>
        <div>
            <p>{{ zip }}</p>
        </div>
        <div>
            <p>{{ debt }}</p>
        </div>

        <div class="actions">
            <button @click="openUpdateCustomerModal" type="button" class="btn btn-primary">Editar</button>
            <UpdateCustomerModal ref="updateCustomerModal" :customer="customerData" />
            <button v-if="authStore.userRole === 'ADMIN'" @click="openDeleteModal" type="button" class="btn btn-danger">Excluir</button>
        </div>
      </form>

        <ConfirmationModal
          v-if="showModal"
          :show="showModal"
          message="Tem certeza que deseja excluir este cliente?"
          :onConfirm="deleteCustomer"
          @close="showModal = false"
        />
</template>
                        
<script setup>
import { ref, nextTick } from 'vue'
import ConfirmationModal from '@/components/modal/ConfirmationModal.vue'
import UpdateCustomerModal from '@/components/modal/UpdateCustomerModal.vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { useAuthStore } from '@/stores/authStore'
import { fetchWithAuth } from '@/utils/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const props = defineProps(['id', 'name', 'email', 'docNumber', 'phone', 'street', 'house_number', 'complement', 'city', 'district', 'state', 'zip', 'debt', 'getCustomers'])

const showModal = ref(false)

const openDeleteModal = () => {
  showModal.value = true
}

const deleteCustomer = async () => {
  try {
        const response = await fetchWithAuth(`http://127.0.0.1:3333/customers/${props.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        },authStore, router)

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Erro ao excluir cliente')
        }

        notificationStore.addNotification('Cliente excluído com sucesso', 'success')
        
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
    id: props.id,
    name: props.name,
    email: props.email,
    docNumber: props.docNumber,
    phone: props.phone,
    street: props.street,
    house_number: props.house_number,
    complement: props.complement,
    city: props.city,
    district: props.district,
    state: props.state,
    zip: props.zip,
    debt: props.debt,
    getCustomers: props.getCustomers
  }
  await nextTick()
  updateCustomerModal.value?.showModal()
}
</script>

<style scoped>
.customer-row {
  display: grid;
  grid-template-columns: 6fr 5fr 2.5fr 5fr 1fr 3fr 3fr 2fr 1.5fr 5.2fr;
  gap: 8px;
  align-items: center;
  margin-bottom: 0.5rem;
  text-align: start;
}

.customer-row > div:not(.actions) {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.customer-row p,
.customer-row input {
  width: 100%;
  text-align: start;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.actions {
  display: flex;
  justify-content: flex-start;
  gap: 8px;
}

.customer-row p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
}

.customer-row input {
  width: 100%;
}

.customer-row button {
  width: auto;
  min-width: 70px;
}

@media (max-width: 768px) {
  .customer-row {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
  }
  
  .customer-row button {
    width: 100%;
  }
}
</style>