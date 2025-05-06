<template>
  <div class="card mb-3">
    <div class="card-body row g-3">
      <div class="col-md-3 col-sm-6" v-for="(field, index) in fields" :key="index">
        <label class="form-label mb-1 fw-bold">{{ field.label }}</label>
        <p class="form-control-plaintext">{{ field.value }}</p>
      </div>

      <div class="col-12 d-flex justify-content-end gap-2 mt-3">
        <button @click="openUpdateCustomerModal" type="button" class="btn btn-primary">Editar</button>
        <UpdateCustomerModal ref="updateCustomerModal" :customer="customerData" />
        <button v-if="authStore.userRole === 'ADMIN'" @click="openDeleteModal" type="button" class="btn btn-danger">Excluir</button>
      </div>
    </div>
  </div>

  <ConfirmationModal
    v-if="showModal"
    :show="showModal"
    message="Tem certeza que deseja excluir este cliente?"
    :onConfirm="deleteCustomer"
    @close="showModal = false"
  />
</template>
                        
<script setup>
import { ref, nextTick, computed } from 'vue'
import ConfirmationModal from '@/components/modal/ConfirmationModal.vue'
import UpdateCustomerModal from '@/components/modal/UpdateCustomerModal.vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { useAuthStore } from '@/stores/authStore'
import { fetchWithAuth } from '@/utils/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const props = defineProps(['customer', 'getCustomers'])

const fields = computed(() => [
  { label: 'Nome', value: props.customer.name },
  { label: 'Email', value: props.customer.email },
  { label: 'CPF/CNPJ', value: props.customer.docNumber },
  { label: 'Telefone', value: props.customer.phone },
  { label: 'Rua', value: props.customer.address.street },
  { label: 'Nº', value: props.customer.address.house_number },
  { label: 'Complemento', value: props.customer.address.complement },
  { label: 'Cidade', value: props.customer.address.city },
  { label: 'Bairro', value: props.customer.address.district },
  { label: 'UF', value: props.customer.address.state },
  { label: 'CEP', value: props.customer.address.zip },
  { label: 'Dívida', value: props.customer.debt }
])

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
    id: props.customer.id,
    name: props.customer.name,
    email: props.customer.email,
    docNumber: props.customer.docNumber,
    phone: props.customer.phone,
    street: props.customer.address.street,
    house_number: props.customer.address.house_number,
    complement: props.customer.address.complement,
    city: props.customer.address.city,
    district: props.customer.address.district,
    state: props.customer.address.state,
    zip: props.customer.address.zip,
    debt: props.customer.debt,
    getCustomers: props.getCustomers
  }
  await nextTick()
  updateCustomerModal.value?.showModal()
}
</script>

<style scoped>

</style>