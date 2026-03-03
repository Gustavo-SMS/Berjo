<template>
    <v-select
        class="vselect-custom"
        v-model="selectedCustomer"
        :options="customers"
        :filterable="false"
        :placeholder="'Buscar cliente...'"
        label="name"
        @search="searchCustomers"
        :loading="loading"
    />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { fetchWithAuth } from '@/utils/api'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

const props = defineProps(['isActive'])

const router = useRouter()
const authStore = useAuthStore()

const selectedCustomer = ref(null)
const customers = ref([])

const loading = ref(false)

async function searchCustomers(searchTerm) {
    loading.value = true

    try {
        const nameQuery = searchTerm
            ? `name=${encodeURIComponent(searchTerm)}`
            : ''
        const activeQuery = `isActive=${props.isActive}`

        const url = `/customers/search?${nameQuery}&${activeQuery}`

        const res = await fetchWithAuth(url, {
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

onMounted(() => {
  searchCustomers('')
})
</script>