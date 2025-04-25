<template>
  <div class="container">
    <div class="box">
      <div class="row fw-bold mb-3 text-center">
        <div class="col-2">Nome</div>
        <div class="col-2">Email</div>
        <div class="col-1">Telefone</div>
        <div class="col-2">Rua</div>
        <div class="col-1">Número</div>
        <div class="col-2">Cidade</div>
        <div class="col-1">Bairro</div>
        <div class="col-1">CEP</div>
        <div class="col-1">Dívida</div>
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
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;
}

.box {
  width: 100%;
  max-width: 1200px;
  height: 60vh;

  background-color: var(--color-surface);
  padding: 2rem;
  border-radius: 8px;
  overflow: auto;
  box-shadow: 1px 1px 5px #333;
}

label {
  font-family: "Roboto", sans-serif;
  font-weight: 700;
}
</style>