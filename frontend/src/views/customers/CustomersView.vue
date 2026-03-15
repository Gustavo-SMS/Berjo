<template>
  <div class="container-page">

    <div class="page-header">
      <h1>Clientes</h1>
    </div>

    <div class="filters row g-3 align-items-center">
      <div class="col-md-6 col-lg-5">
        <div class="input-group dark-input">
          <input
            v-model="searchTerm"
            type="text"
            class="form-control"
            placeholder="Buscar por nome"
          />
          <button @click="getByName" class="btn btn-outline-gold">
            Buscar
          </button>
        </div>
      </div>

      <div class="col-md-3 col-lg-2">
        <v-select
          v-model="isActive"
          :options="statusOptions"
          label="label"
          :reduce="option => option.value"
          :clearable="false"
          class="vselect-custom"
        />
      </div>

      <div v-if="authStore.userRole === 'ADMIN'" class="col-auto ms-auto d-flex gap-2">
        <RouterLink :to="'/createCustomer'" class="btn btn-primary">
          Adicionar cliente
        </RouterLink>
        <RouterLink :to="'/register'" class="btn btn-primary">
          Cadastrar usuário
        </RouterLink>
      </div>
    </div>

    <div v-if="customers.length === 0" class="empty-state">
      Nenhum cliente encontrado.
    </div>

    <div class="customers-grid">
      <CustomerRow
        v-for="customer in paginatedCustomers"
        :key="customer.id"
        :customer="customer"
        :canDelete="true"
        :getCustomers="getCustomers"
      />
    </div>

    <nav v-if="totalPages > 1" class="pagination-wrapper">
      <ul class="pagination pagination-dark">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="goToPage(currentPage - 1)">
            Anterior
          </button>
        </li>

        <li
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: currentPage === page }"
        >
          <button class="page-link" @click="goToPage(page)">
            {{ page }}
          </button>
        </li>

        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="goToPage(currentPage + 1)">
            Próxima
          </button>
        </li>
      </ul>
    </nav>

  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import CustomerRow from '@/components/customer/CustomerRow.vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { fetchWithAuth } from '@/utils/api'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

const apiUrl = import.meta.env.VITE_API_URL

const authStore = useAuthStore()
const router = useRouter()

const customers = ref([])
const searchTerm = ref('')
const isActive = ref(true)

const currentPage = ref(1)
const itemsPerPage = 8

const statusOptions = [
  { label: 'Ativos', value: true },
  { label: 'Inativos', value: false }
]

const getCustomers = async () => {
  let url = `${apiUrl}/customers`

  if(!isActive.value) {
    url = url + "/inactive"
  }
  
  try {

    if (authStore.userRole === 'CUSTOMER') {
      url += `/${authStore.customerId}`
    }

    const response = await fetchWithAuth(url, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json'
      }
    }, authStore, router)

    const data = await response.json()

    if (!response.ok) {
      customers.value = []
      throw new Error(data.error || 'Erro ao buscar clientes')
    }

    customers.value = [...(Array.isArray(data) ? data : [data])]
    currentPage.value = 1
  } catch (error) {
    console.log(error.message)
  }
}

onMounted(getCustomers)

const totalPages = computed(() =>
  Math.ceil(customers.value.length / itemsPerPage)
)

const paginatedCustomers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return customers.value.slice(start, start + itemsPerPage)
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const getByName = async () => {
  const name = encodeURIComponent(searchTerm.value.trim())

  if (!name) {
    return getCustomers()
  }

  const url = `${apiUrl}/customers/search?name=${name}&isActive=${isActive.value}`

    try {
        const response = await fetchWithAuth(url, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        }, authStore, router)

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao buscar cliente')
        }   

        customers.value = [...(Array.isArray(data) ? data : [data])]
        currentPage.value = 1
    } catch (error) {
        console.log(error.message)
      }    
}

watch(isActive, () => {
  if (searchTerm.value.trim()) {
    getByName()
  } else {
    getCustomers()
  }
})
</script>

<style scoped>
.filters {
  margin-bottom: 32px;
}

.customers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 24px;
}

.empty-state {
  background-color: #141414;
  border: 1px dashed rgba(212, 175, 55, 0.3);
  color: #bfbfbf;
  padding: 32px;
  border-radius: 12px;
  text-align: center;
}

@media (min-width: 1400px) {
  .customers-grid {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }
}
</style>
