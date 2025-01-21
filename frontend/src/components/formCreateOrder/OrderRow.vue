<template>
    <div class="row mb-2">
        <div class="col-1">
            <input type="number" class="form-control" id="quantity" name="quantity">
        </div>
        <div class="col-2">
            <input type="text" class="form-control" id="type" name="type">
        </div>
        <div class="col-4">
            <SelectBlindType @selectedOption="selectedBlindTypeId" @change="$emit('selectedBlindTypeId', blindTypeId)"/>
        </div>
        <div class="col-1">
            <input type="number" class="form-control" id="width" name="width">
        </div>
        <div class="col-1">
            <input type="number" class="form-control" id="height" name="height">
        </div>
        <div class="col-1">
            <input type="number" class="form-control" id="command_height" name="command_height">
        </div>
        <div class="col-1">
            <input type="text" class="form-control" id="model" name="model">
        </div>

        <div class="col-1 row justify-content-center">
            <button type="reset" class="btn btn-danger col-6">X</button>
        </div>
    </div>
    
</template>

<script setup>
import SelectBlindType from './SelectBlindType.vue';
import { ref } from 'vue';

    defineEmits('selectedBlindTypeId')

    let blindTypeId = ref('')

    function selectedBlindTypeId(event, arrayBlindTypes) {
        blindTypeId = arrayBlindTypes[event.target.selectedIndex].id
    }
</script>

