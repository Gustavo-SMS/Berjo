<template>
    <div class="container">
        <div class="box">
            <div v-if="authStore.userRole === 'ADMIN'" class="search-bar">
                <!-- <input type="text" id="searchByName" class="form-control" placeholder="Buscar por nome" />
                <button @click="getByName" class="btn btn-primary">Buscar</button> -->
                <input
                  v-model="searchTerm"
                  type="text"
                  class="form-control"
                  placeholder="Buscar por nome..."
                />
            </div>
           
            <CustomerRow
                v-for="customer in paginatedCustomers"
                :key="customer.id"
                :customer="customer"
                :getCustomers="getCustomers"
            />

            <nav v-if="totalPages > 1" class="mt-3">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button class="page-link" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
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
import { useNotificationStore } from '@/stores/notificationStore'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { fetchWithAuth } from '@/utils/api'

const authStore = useAuthStore()
const router = useRouter()
const notificationStore = useNotificationStore()

const customers = ref([])
const searchTerm = ref('')

const currentPage = ref(1)
const itemsPerPage = 2

const getCustomers = async () => {
    try {
        let url = 'http://127.0.0.1:3333/customers'

        if (authStore.userRole === 'CUSTOMER') {
            url += `/${authStore.customerId}`
        }

        const response = await fetchWithAuth(url, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
            credentials: 'include'
        }, authStore, router)

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao buscar clientes')
        }   

        customers.value = Array.isArray(data) ? data : [data]
    } catch (error) {
        console.log(error.message)
        notificationStore.addNotification(error.message, 'error')
      }
}

onMounted(getCustomers)

const filteredCustomers = computed(() => {
  return customers.value.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

const totalPages = computed(() =>
  Math.ceil(filteredCustomers.value.length / itemsPerPage)
)

const paginatedCustomers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredCustomers.value.slice(start, start + itemsPerPage)
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

watch(searchTerm, () => {
  currentPage.value = 1
})

// const getByName = async (event) => {
//     event.preventDefault()

//     const input = document.querySelector('#searchByName')

//     if(!input.value) {
//         return getCustomers()
//     }

//     try {
//         const response = await fetchWithAuth(`http://127.0.0.1:3333/customers/name/${input.value}`, {
//             method: 'GET',
//             headers: {
//                 'Content-type': 'application/json'
//             }
//         }, authStore, router)

//         if (!response.ok) {
//             const errorData = await response.json()
//             throw new Error(errorData.error || 'Erro ao buscar cliente')
//         }   

//         const data = await response.json()
//         customers.value = Array.isArray(data) ? data : [data]
//     } catch (error) {
//         console.log(error.message)
//         notificationStore.addNotification(error.message, 'error')
//       }    
// }
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
