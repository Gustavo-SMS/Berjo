<template>
    <select v-model="selectedType"  @change="$emit('selectedOption', $event, arrayBlindTypes)" class="form-select" aria-label="Selecione uma coleção">
        <option v-for="(type, index) in arrayBlindTypes" :key="index">
            {{ type }}
        </option>
    </select>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { fetchWithAuth } from '@/utils/api'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const notificationStore = useNotificationStore()

defineEmits(['selectedOption'])
const props = defineProps(['typeValue'])

let arrayBlindTypes = reactive([])

const selectedType = ref(props.typeValue || '')

const fetchTypes = async () => {
    try {
        const response = await fetchWithAuth("http://127.0.0.1:3333/blind_types/type", {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        }, authStore, router)
        
        const types = await response.json()

        arrayBlindTypes.splice(0, arrayBlindTypes.length, ...[...new Set(types.map(item => item.type))])
        arrayBlindTypes.unshift('')

        if (props.typeValue && arrayBlindTypes.includes(props.typeValue)) {
            selectedType.value = props.typeValue
        }
    } catch (error) {
        console.log(error.message)
        notificationStore.addNotification(error.message, 'error')
    }
}

onMounted(() => {
    fetchTypes()
})
</script>