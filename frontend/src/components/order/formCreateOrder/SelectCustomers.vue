<template>
    <select @change="$emit('selectedOption', $event, customerNames)" class="form-select w-25 mb-3" aria-label="Selecione um cliente">
        <option v-for="(customer, index) in customerNames" :key="index" :value="customer.id">
            {{ customer.name }}
        </option>
    </select>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { fetchWithAuth } from '@/utils/api'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const notificationStore = useNotificationStore()

defineEmits(['selectedOption']) 

const customerNames = ref([])

onMounted(async () => {
    try {
        const response = await fetchWithAuth("http://127.0.0.1:3333/customers", {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
        },
            credentials: 'include'
        }, authStore, router)
    
        if (!response.ok) {
            throw new Error('Erro ao buscar clientes')
        }
        
        const customers = await response.json()

        customerNames.value = [
            { id: '', name: '' },
            ...customers.map(customer => ({
                id: customer.id,
                name: customer.name
            }))
        ]
    } catch (error) {
        console.log(error.message)
        notificationStore.addNotification(error.message, 'error')
    }
})


</script>