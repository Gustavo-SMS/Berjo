<template>
    <select  @change="$emit('selectedOption', $event, arrayBlindTypes)" class="form-select" aria-label="Selecione uma coleção">
        <option v-for="(type, index) in arrayBlindTypes" :key="index">
            {{ type }}
        </option>
    </select>
</template>

<script setup>
import { reactive } from 'vue';

    defineEmits(['selectedOption']) 

    let arrayBlindTypes = reactive([])

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
                })
            })
    } catch (error) {
        console.log(error.message)
    }
</script>