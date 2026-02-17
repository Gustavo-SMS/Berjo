<template>

  <div class="container-page">
    <div class="page-header">
      <h1>Perfil</h1>
    </div>

      <CustomerRow
          v-if="customer"
          :key="customer.id"
          :customer="customer"
          :getCustomers="getCustomers"
          :canDelete="false"
      />

      <div class="d-flex flex-column flex-md-row gap-2 mt-4">
        <button class="btn btn-primary w-100" @click="openChangePasswordModal">Alterar senha</button>
        <ChangePasswordModal ref="changePasswordModal" />

        <button class="btn btn-primary w-100" @click="openChangeLoginModal">Alterar login</button>
        <ChangeLoginModal ref="changeLoginModal" />
      </div>
      
 </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notificationStore'
import { fetchWithAuth } from '@/utils/api'
import CustomerRow from '@/components/customer/CustomerRow.vue'
import ChangeLoginModal from '@/components/modal/ChangeLoginModal.vue'
import ChangePasswordModal from '@/components/modal/ChangePasswordModal.vue'

const authStore = useAuthStore()
const router = useRouter()
const notificationStore = useNotificationStore()

const customer = ref(null)

const getCustomers = async () => {
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

onMounted(getCustomers)
</script>

<style scoped>

</style>