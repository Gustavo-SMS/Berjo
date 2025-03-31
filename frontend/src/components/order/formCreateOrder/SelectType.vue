<template>
    <select v-model="selectedType"  @change="$emit('selectedOption', $event, arrayBlindTypes)" class="form-select" aria-label="Selecione uma coleção">
        <option v-for="(type, index) in arrayBlindTypes" :key="index">
            {{ type }}
        </option>
    </select>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'

const notificationStore = useNotificationStore()

defineEmits(['selectedOption'])
const props = defineProps(['typeValue'])

let arrayBlindTypes = reactive([])

const selectedType = ref(props.typeValue || '')

try {
    fetch("http://127.0.0.1:3333/blind_types/type", {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        }).then((res) => {
            res.json().then((types) => {
                arrayBlindTypes.splice(0, arrayBlindTypes.length, ...[...new Set(types.map(item => item.type))])
                arrayBlindTypes.unshift('')

                if (props.typeValue && arrayBlindTypes.includes(props.typeValue)) {
                    selectedType.value = props.typeValue
                }
            })
        })
} catch (error) {
    console.log(error.message)
    notificationStore.addNotification(error.message, 'error')
}
</script>