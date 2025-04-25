<template>
    <select v-model="selectedCustomerId" @change="$emit('selectedOption', selectedCustomerId)" class="form-select">
      <option disabled value="">Selecione um cliente</option>
      <option v-for="customer in unlinkedCustomers" :key="customer.id" :value="customer.id">
        {{ customer.name }}
      </option>
    </select>
  </template>
  
<script setup>
import { ref, onMounted, watch } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { fetchWithAuth } from '@/utils/api'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

defineEmits(['selectedOption'])
const props = defineProps(['refreshKey'])

const authStore = useAuthStore()
const router = useRouter()
const notificationStore = useNotificationStore()
  
const selectedCustomerId = ref('')
const unlinkedCustomers = ref([])
  
const fetchUnlinkedCustomers = async () => {
    try {
      const response = await fetchWithAuth('http://127.0.0.1:3333/customers/unlinked', {
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

      unlinkedCustomers.value = data
    } catch (error) {
      console.error(error.message)
      notificationStore.addNotification(error.message, 'error')
    }
  }

onMounted(fetchUnlinkedCustomers)

watch(() => props.refreshKey, () => {
  fetchUnlinkedCustomers()
})
</script>