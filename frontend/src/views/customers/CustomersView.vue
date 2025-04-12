<template>
    <div class="wrapper">
        <div class="box">
                <input v-if="authStore.userRole === 'ADMIN'" type="text" id="searchByName">
                <button v-if="authStore.userRole === 'ADMIN'" @click="getByName">Buscar</button>
            <div class="row">
                    <div class="col-2">
                        <label for="" class="form-label">Nome</label>
                    </div>
                    <div class="col-2">
                        <label for="" class="form-label">Email</label>
                    </div>
                    <div class="col-1">
                        <label for="" class="form-label">Telefone</label>
                    </div>
                    <div class="col-2">
                        <label for="" class="form-label">Rua</label>
                    </div>
                    <div class="col-1">
                        <label for="" class="form-label">Número</label>
                    </div>
                    <div class="col-2">
                        <label for="" class="form-label">Cidade</label>
                    </div>
                    <div class="col-1">
                        <label for="" class="form-label">Bairro</label>
                    </div>
                    <div class="col-1">
                        <label for="" class="form-label">CEP</label>
                    </div>
                    <div class="col-1">
                        <label for="" class="form-label">Dívida</label>
                    </div>
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
import { onMounted, ref } from 'vue'
import CustomerRow from '@/components/customer/CustomerRow.vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { useAuthStore } from '@/stores/authStore'
import { fetchWithAuth } from '@/utils/api'

const authStore = useAuthStore()
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
            })

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
            })

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
