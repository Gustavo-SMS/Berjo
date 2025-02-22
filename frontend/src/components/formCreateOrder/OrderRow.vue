<template>
    <div class="row">
        <div class="col-1">
            <input type="number" class="form-control" v-model="row.quantity" @input="$emit('updateRow', { field: 'quantity', value: row.quantity })">
        </div>
        <div class="col-2">
             <SelectType @selectedOption="selectedType"/>
        </div>
        <div class="col-4" id="selectBlindType">
            <SelectBlindType 
                v-if="type" 
                :key="type"
                @selectedOption="selectedBlindTypeId" 
                :type="type"
                @change="$emit('updateRow', { field: 'type', value: blindTypeId })"
            />
        </div>
        <div class="col-1">
            <input type="number" class="form-control" v-model="row.width" @input="$emit('updateRow', { field: 'width', value: row.width })">
        </div>
        <div class="col-1">
            <input type="number" class="form-control" v-model="row.height" @input="$emit('updateRow', { field: 'height', value: row.height })">
        </div>
        <div class="col-1">
            <input type="number" class="form-control" v-model="row.command_height" @input="$emit('updateRow', { field: 'command_height', value: row.command_height })">
        </div>
        <div class="col-1">
            <input type="text" class="form-control" v-model="row.model" @input="$emit('updateRow', { field: 'model', value: row.model })">
        </div>
    </div>
</template>

<script setup>
import { watch, defineProps, defineEmits, ref } from 'vue'
import SelectBlindType from './SelectBlindType.vue'
import SelectType from './SelectType.vue'

defineProps(['row'])
defineEmits(['updateRow', 'selectedBlindTypeId'])

const blindTypeId = ref('')
const type = ref(null)

const selectedType = (event, arrayBlindTypes) => {
    type.value = arrayBlindTypes[event.target.selectedIndex] || null
}

const selectedBlindTypeId = (event, arrayBlindTypes) => {
    blindTypeId.value = arrayBlindTypes[event.target.selectedIndex].id || ''
}

watch(type, () => {
    blindTypeId.value = ''
})

// vertical = ['Lateral', 'Central', 'Invertida']
// horizontal = ['Dir', 'Esq']
// rolo/romana/dv = ['Dir', 'Esq', 'Duplex']
</script>