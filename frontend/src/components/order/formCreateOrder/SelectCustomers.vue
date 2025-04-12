<template>
    <select  @change="$emit('selectedOption', $event, customerNames)" class="form-select w-25 mb-3" aria-label="Selecione um cliente">
        <option v-for="(customer, index) in customerNames" :key="index">
            {{ customer.name }}
        </option>
    </select>
</template>

<script setup>
import { reactive } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { fetchWithAuth } from '@/utils/api'

const notificationStore = useNotificationStore()

defineEmits(['selectedOption']) 

const customerNames = reactive([])

try {
    await fetchWithAuth("http://127.0.0.1:3333/customers", {
        method: 'GET',
        headers: {
            'Content-type': 'application/json'
        },
        credentials: 'include'
    }).then((res) => {
        res.json().then((customers) => {
            customerNames.push('')
            customers.map((customer) => {
                customerNames.push({id: customer.id, name: customer.name}) 
            })
        })
    })
} catch (error) {
    console.log(error.message)
    notificationStore.addNotification(error.message, 'error')
}
    
        
</script>