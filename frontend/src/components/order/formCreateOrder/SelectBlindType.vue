<template>
    <select v-model="selectedCollection" @change="$emit('selectedOption', $event, blindCollections)" class="form-select" aria-label="Selecione uma coleção">
        <option v-for="(blindType, index) in blindCollections" :key="index" :value="blindType.collection">
            {{ blindType.collection + " " + blindType.color }}
        </option>
    </select>
</template>

<script setup>
import { reactive, ref, watch, nextTick } from 'vue';

defineEmits(['selectedOption']) 
const props = defineProps(['typeValue', 'collection'])

const selectedCollection = ref(props.collection || '')

const blindCollections = reactive([])

const fetchBlindCollections = async (type) => {
    if (!type) return

    try {
        const response = await fetch(`http://127.0.0.1:3333/blind_types/type/${type}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                }
            })

        if (!response.ok) throw new Error("Erro ao buscar coleções")

        const blindTypes = await response.json()

        blindCollections.splice(0, blindCollections.length, { collection: '', color: '' }, ...blindTypes.map(bt => ({
            id: bt.id,
            collection: bt.collection,
            color: bt.color
        })))

        await nextTick()

        if (props.collection) {
            const match = blindCollections.find(bc => bc.collection === props.collection)
            if (match) selectedCollection.value = match.collection
        }
    } catch (error) {
        console.log(error.message)
    }
}

watch(() => props.typeValue, fetchBlindCollections, { immediate: true })

watch(() => props.collection, (newValue) => {
    if (newValue) {
        const match = blindCollections.find(bc => bc.collection === newValue)
        if (match) selectedCollection.value = match.collection
    }
}, { immediate: true })
        
</script>