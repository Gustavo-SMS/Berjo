<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-lg-8">

        <h2 class="mb-4">Relatórios</h2>

        <div v-if="authStore.userRole && authStore.userRole === 'ADMIN'" class="card shadow-sm rounded-4 mb-4">
          <div class="card-body">
            <h5 class="card-title">Pedidos por Período</h5>
            <form @submit.prevent="generateByPeriod">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Data inicial</label>
                  <input type="date" v-model="period.startDate" class="form-control" :max="today" required />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Data final</label>
                  <input type="date" v-model="period.endDate" class="form-control" :max="today" required />
                </div>
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-primary">Gerar PDF</button>
              </div>
            </form>
          </div>
        </div>

        <div class="card shadow-sm rounded-4">
          <div class="card-body">
            <h5 v-if="authStore.userRole && authStore.userRole === 'ADMIN'" class="card-title">Pedidos por Cliente</h5>
            <h5 v-else class="card-title">Pedidos por período</h5>
            <form @submit.prevent="generateByCustomer">
              <div v-if="authStore.userRole && authStore.userRole === 'ADMIN'" class="mb-3">
                <label class="form-label">Nome do Cliente</label>
                <SelectCustomers v-model="selectedCustomer" />
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Data inicial</label>
                  <input type="date" v-model="customerPeriod.startDate" class="form-control" :max="today" required />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Data final</label>
                  <input type="date" v-model="customerPeriod.endDate" class="form-control" :max="today" required />
                </div>
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-primary">Gerar PDF</button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { fetchWithAuth } from '@/utils/api'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import SelectCustomers from '@/components/order/formCreateOrder/SelectCustomers.vue'

const router = useRouter()
const authStore = useAuthStore()

const apiUrl = import.meta.env.VITE_API_URL

const selectedCustomer = ref(null)

const today = new Date().toISOString().split('T')[0]

const period = ref({
  startDate: '',
  endDate: ''
})

const customerPeriod = ref({
  startDate: '',
  endDate: ''
})

const generateByPeriod = () => {
  const { startDate, endDate } = period.value
  if (startDate && endDate) {
    const url = `${apiUrl}/report/by-period?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
    window.open(url, '_blank')
  }
}

const generateByCustomer = () => {
  const { startDate, endDate } = customerPeriod.value

  const customerId = authStore.userRole === 'ADMIN' ? selectedCustomer.value.id : authStore.customerId

  if (customerId && startDate && endDate) {
    const url = `${apiUrl}/report/by-customer?customerId=${encodeURIComponent(customerId)}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
    window.open(url, '_blank')
  }
}
</script>