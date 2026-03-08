<template>
  <v-select
    v-model="selectedCustomer"
    :options="unlinkedCustomers"
    label="name"
    class="vselect-custom"
    :clearable="false"
    @update:modelValue="value => emit('selectedOption', value?.id)"
  />
  </template>
  
<script setup>
import { ref, onMounted, watch } from 'vue'
import { fetchWithAuth } from '@/utils/api'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

const emit =defineEmits(['selectedOption'])
const props = defineProps(['refreshKey'])

const authStore = useAuthStore()
const router = useRouter()
  
const selectedCustomer = ref(null)
const unlinkedCustomers = ref([])
  
const fetchUnlinkedCustomers = async () => {
    try {
      const response = await fetchWithAuth('/customers/unlinked', {
              method: 'GET',
              headers: {
                  'Content-type': 'application/json'
              }
          }, authStore, router)

      const data = await response.json()
      
      if (!response.ok) {
          throw new Error(data.error || 'Erro ao buscar clientes')
      }

      unlinkedCustomers.value = data
    } catch (error) {
      console.error(error.message)
    }
  }

onMounted(fetchUnlinkedCustomers)

watch(() => props.refreshKey, async () => {
  await fetchUnlinkedCustomers()

  if (
    selectedCustomer.value &&
    !unlinkedCustomers.value.some(c => c.id === selectedCustomer.value.id)
  ) {
    selectedCustomer.value = null
  }
})
</script>