<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-lg-8">

        <h2 class="mb-4">Relatórios</h2>

        <div class="card shadow-sm rounded-4 mb-4">
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
            <h5 class="card-title">Pedidos por Cliente</h5>
            <form @submit.prevent="generateByCustomer">
              <div class="mb-3">
                <label class="form-label">Nome do Cliente</label>
                   <v-select
                        v-model="selectedCustomer"
                        :options="customers"
                        :filterable="false"
                        :placeholder="'Buscar cliente...'"
                        label="name"
                        @search="searchCustomers"
                        :loading="loading"
                    />
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

const router = useRouter()
const authStore = useAuthStore()

const today = new Date().toISOString().split('T')[0]

const period = ref({
  startDate: '',
  endDate: ''
})

const selectedCustomer = ref(null)
const customers = ref([])
const loading = ref(false)

async function searchCustomers(searchTerm) {
  if (!searchTerm) return

  loading.value = true
  try {
    const res = await fetchWithAuth(`/customers/search?name=${encodeURIComponent(searchTerm)}`, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' }
        }, authStore, router)

    const data = await res.json()

    customers.value = Array.isArray(data) ? data : []
  } catch (err) {
    console.error('Erro ao buscar cliente:', err)
  } finally {
    loading.value = false
  }
}
const baseUrl = import.meta.env.VITE_API_URL
const generateByPeriod = () => {
  const { startDate, endDate } = period.value
  if (startDate && endDate) {
    const url = `${baseUrl}/report/by-period?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
    window.open(url, '_blank')
  }
}

const generateByCustomer = () => {
  if (selectedCustomer.value) {
    const url = `${baseUrl}/report/by-customer?customerId=${encodeURIComponent(selectedCustomer.value.id)}`
    window.open(url, '_blank')
  }
}
</script>