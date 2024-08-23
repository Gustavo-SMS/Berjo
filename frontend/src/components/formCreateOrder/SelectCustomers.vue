<template>
    <select class="form-select w-25 mb-3" aria-label="Selecione um cliente">
        <option v-for="(name, index) in customerNames" :key="index">
            {{ name }}
        </option>
    </select>
</template>

<script setup>
import { reactive } from 'vue';

    const customerNames = reactive([])
    
    fetch("http://127.0.0.1:3333/customers", {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        }).then((res) => {
            res.json().then((customers) => {
                customerNames.push('')
                customers.map((customer) => {
                    customerNames.push(customer.name)
                })
            })
        })
</script>