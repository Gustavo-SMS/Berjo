<template>
    <select  @change="$emit('selectedOption', $event, blindCollections)" class="form-select" aria-label="Selecione uma coleção">
        <option v-for="(blindType, index) in blindCollections" :key="index">
            {{ blindType.collection + " " + blindType.color }}
        </option>
    </select>
</template>

<script setup>
import { reactive } from 'vue';

    defineEmits('selectedOption') 

    const blindCollections = reactive([])

    fetch("http://127.0.0.1:3333/blind_types", {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        }).then((res) => {
            res.json().then((blindTypes) => {
                blindCollections.push({collection: '', color: ''})
                blindTypes.map((blindType) => {
                    blindCollections.push({id: blindType.id, collection: blindType.collection, color: blindType.color}) 
                })
            })
        })
</script>