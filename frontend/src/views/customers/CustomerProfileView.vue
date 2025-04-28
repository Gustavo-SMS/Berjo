<template>
  <div class="container">
    <div class="box">
      <div class="customer-header">
        <div>Nome</div>
        <div>Email</div>
        <div>Telefone</div>
        <div>Rua</div>
        <div>Nº</div>
        <div>Cidade</div>
        <div>Bairro</div>
        <div>CEP</div>
        <div>Dívida</div>
      </div>

      <CustomerRow
        v-if="customer"
        :id="customer.id"
        :name="customer.name"
        :email="customer.email"
        :phone="customer.phone"
        :street="customer.address.street"
        :house_number="customer.address.house_number"
        :city="customer.address.city"
        :district="customer.address.district"
        :zip="customer.address.zip"
        :debt="customer.debt"
        :getCustomers="getCustomer"
      />

      <div class="d-flex flex-column flex-md-row gap-2 mt-4">
        <button class="btn btn-outline-warning w-100" @click="openChangePasswordModal">Alterar senha</button>
        <ChangePasswordModal ref="changePasswordModal" />

        <button class="btn btn-outline-warning w-100" @click="openChangeLoginModal">Alterar login</button>
        <ChangeLoginModal ref="changeLoginModal" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CustomerRow from '@/components/customer/CustomerRow.vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notificationStore'
import { fetchWithAuth } from '@/utils/api'
import ChangeLoginModal from '@/components/modal/ChangeLoginModel.vue'
import ChangePasswordModal from '@/components/modal/ChangePasswordModel.vue'

const authStore = useAuthStore()
const router = useRouter()
const notificationStore = useNotificationStore()
const customer = ref(null)

const getCustomer = async () => {
  try {
    const response = await fetchWithAuth(`/customers/${authStore.customerId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }, authStore, router)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Erro ao buscar dados do cliente')
    }

    const data = await response.json()
    customer.value = data
  } catch (error) {
    console.log(error.message)
    notificationStore.addNotification(error.message, 'error')
  }
}

const changeLoginModal = ref(null)
const openChangeLoginModal = () => {
  changeLoginModal.value?.showModal()
}

const changePasswordModal = ref(null)
const openChangePasswordModal = () => {
  changePasswordModal.value?.showModal()
}

onMounted(getCustomer)
</script>

<style scoped>
.container {
  width: 100vw;
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.box {
  width: 100%;
  height: 23vh;
  background-color: var(--color-surface);
  padding: 2rem;
  border-radius: 8px;
  overflow: auto;
  box-shadow: 1px 1px 5px #333;
}

.customer-header {
  display: grid;
  grid-template-columns: 6fr 5fr 2.5fr 5fr 1fr 3fr 3fr 2fr 1.5fr 5.2fr;
  gap: 8px;
  margin-bottom: 1rem;
  font-weight: bold;
  text-align: start;
}

.customer-header > div {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: start;
  overflow: hidden;
}

@media (max-width: 768px) {
  .customer-header {
    display: none;
  }
}
</style>