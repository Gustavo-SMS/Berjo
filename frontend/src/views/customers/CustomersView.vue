<template>
    <div class="container">
        <div class="box">
            <div v-if="authStore.userRole === 'ADMIN'" class="search-bar">
                <input type="text" id="searchByName" class="form-control" placeholder="Buscar por nome" />
                <button @click="getByName" class="btn btn-primary">Buscar</button>
            </div>

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
                <div>Ações</div>
            </div>

            <CustomerRow
                v-for="customer in customers"
                :key="customer.id"
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
                :getCustomers="getCustomers"
            />
        </div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import CustomerRow from '@/components/customer/CustomerRow.vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { fetchWithAuth } from '@/utils/api'

const authStore = useAuthStore()
const router = useRouter()
const notificationStore = useNotificationStore()

const customers = ref([])

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

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Erro ao buscar clientes')
            }   

            const data = await response.json()
            customers.value = Array.isArray(data) ? data : [data]
        } catch (error) {
            console.log(error.message)
            notificationStore.addNotification(error.message, 'error')
        }
    }

    onMounted(getCustomers)

    const getByName = async (event) => {
        event.preventDefault()

        const input = document.querySelector('#searchByName')

        if(!input.value) {
            return getCustomers()
        }

        try {
            const response = await fetchWithAuth(`http://127.0.0.1:3333/customers/name/${input.value}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                }
            }, authStore, router)

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Erro ao buscar cliente')
            }   

            const data = await response.json()
            customers.value = Array.isArray(data) ? data : [data]
        } catch (error) {
            console.log(error.message)
            notificationStore.addNotification(error.message, 'error')
        }
        
    }

onMounted(() => {
  document.body.classList.add('no-scroll')
})
onUnmounted(() => {
  document.body.classList.remove('no-scroll')
})
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
  height: 70vh;
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

  .search-bar {
    flex-direction: column;
  }

  .search-bar input,
  .search-bar button {
    width: 100%;
  }
}

.search-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;
}
</style>
