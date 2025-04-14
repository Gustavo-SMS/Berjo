<template>
  <div class="wrapper">
    <div class="box">
      <div class="row">
        <div class="col-2"><label class="form-label">Nome</label></div>
        <div class="col-2"><label class="form-label">Email</label></div>
        <div class="col-1"><label class="form-label">Telefone</label></div>
        <div class="col-2"><label class="form-label">Rua</label></div>
        <div class="col-1"><label class="form-label">Número</label></div>
        <div class="col-2"><label class="form-label">Cidade</label></div>
        <div class="col-1"><label class="form-label">Bairro</label></div>
        <div class="col-1"><label class="form-label">CEP</label></div>
        <div class="col-1"><label class="form-label">Dívida</label></div>
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

      <div>
        <button class="btn btn-outline-warning" @click="openChangePasswordModal">Alterar senha</button>
        <ChangePasswordModal ref="changePasswordModal" />
        <button class="btn btn-outline-warning" @click="openChangeLoginModal">Alterar login</button>
        <ChangeLoginModal ref="changeLoginModal" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CustomerRow from '@/components/customer/CustomerRow.vue'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { fetchWithAuth } from '@/utils/api'
import ChangeLoginModal from '@/components/modal/ChangeLoginModel.vue'
import ChangePasswordModal from '@/components/modal/ChangePasswordModel.vue'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const customer = ref(null)

const getCustomer = async () => {
  try {
    const response = await fetchWithAuth(`/customers/${authStore.customerId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

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
div.wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

div.box {
  width: 80vw;
  height: 60vh;
  border-radius: 8px;
  box-shadow: 1px 1px 5px #333;
  background-color: #f8f9fa;
  padding: 40px;
  overflow: scroll;
}

label {
  font-family: "Roboto", sans-serif;
  font-weight: 700;
}
</style>