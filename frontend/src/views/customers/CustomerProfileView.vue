<template>
  <div class="container">
    <div class="box">

      <CustomerRow
          v-if="customer"
          :key="customer.id"
          :customer="customer"
          :canDelete="false"
      />

      <div class="d-flex flex-column flex-md-row gap-2 mt-4">
        <button class="btn btn-warning w-100" @click="openChangePasswordModal">Alterar senha</button>
        <ChangePasswordModal ref="changePasswordModal" />

        <button class="btn btn-warning w-100" @click="openChangeLoginModal">Alterar login</button>
        <ChangeLoginModal ref="changeLoginModal" />
      </div>
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
  min-height: 100vh;
  padding: 2rem 1rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background-color: var(--color-background, #f8f9fa);
}

.box {
  width: 100%;
  max-width: 1200px;
  background-color: var(--color-surface, #ffffff);
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.box > *:not(:last-child) {
  margin-bottom: 1rem;
}

.search-bar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
  }

  .search-bar input,
  .search-bar button {
    width: 100%;
  }
}
</style>