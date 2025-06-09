<template>
  <div class="container">
    <div class="box">
      <div class="search-bar row g-2 align-items-center">
        <div class="col-md-6">
          <div class="input-group">
            <input v-model="searchTerm" type="text" id="searchByName" class="form-control" placeholder="Buscar por nome"/>
            <button @click="getByName" class="btn btn-secondary">Buscar</button>
          </div>
        </div>

        <div class="col-md-3">
          <select v-model="isActive" name="isActive" id="isActive" class="form-select">
            <option :value="true">Ativos</option>
            <option :value="false">Inativos</option>
          </select>
        </div>
      </div>
      
      <div v-if="customers.length === 0" class="order-card text-center">
        <p class="mb-0">Nenhum cliente encontrado.</p>
      </div>

      <CustomerRow v-for="customer in paginatedCustomers" 
        :key="customer.id" 
        :customer="customer"
        :canDelete="true"
        :getCustomers="getCustomers" 
      />

      <nav v-if="totalPages > 1" class="mt-3">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
              Anterior
            </button>
          </li>

          <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
            <button class="page-link" @click="goToPage(page)">
              {{ page }}
            </button>
          </li>

          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">
              Próxima
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import CustomerRow from '@/components/customer/CustomerRow.vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { fetchWithAuth } from '@/utils/api'

const apiUrl = import.meta.env.VITE_API_URL

const authStore = useAuthStore()
const router = useRouter()

const customers = ref([])
const searchTerm = ref('')
const isActive = ref(true)

const currentPage = ref(1)
const itemsPerPage = 2

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
.container {
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

.box>*:not(:last-child) {
  margin-bottom: 1rem;
}

.search-bar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.order-card {
  background-color: var(--color-surface);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
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
