<template>
    <v-select
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { fetchWithAuth } from '@/utils/api'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

const props = defineProps(['isActive'])

const router = useRouter()
const authStore = useAuthStore()

const selectedCustomer = defineModel()
const customers = ref([])

const isActive = ref('')

const loading = ref(false)

async function searchCustomers(searchTerm) {
    if (!searchTerm) return

    loading.value = true
    isActive.value = props.isActive

    try {
        const res = await fetchWithAuth(`/customers/search?name=${encodeURIComponent(searchTerm)}&isActive=${isActive.value}`, {
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
</script>