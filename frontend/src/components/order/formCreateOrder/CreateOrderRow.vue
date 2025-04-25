<template>
    <div class="row mb-3">
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
                :typeValue="type"
                @selectedOption="selectedBlindTypeId" 
                @change="$emit('updateRow', { field: 'type_id', value: type_id })"
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
            <select v-if="modelOptions.length" class="form-control" v-model="row.model" @change="$emit('updateRow', { field: 'model', value: row.model })">
                <option value="" disabled></option>
                <option v-for="option in modelOptions" :key="option" :value="option">
                    {{ option }}
                </option>
            </select>
        </div>
        <div class="col-12 mt-2">
            <input type="text" class="form-control" placeholder="Observações" v-model="row.observation" @input="$emit('updateRow', { field: 'observation', value: row.observation })">
        </div>
    </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue'
import SelectBlindType from './SelectBlindType.vue'
import SelectType from './SelectType.vue'

defineProps(['row'])
defineEmits(['updateRow', 'selectedBlindTypeId'])

const type = ref(null)
const type_id = ref('')
const model = ref('')

const selectedType = (event, arrayBlindTypes) => {
    type.value = arrayBlindTypes[event.target.selectedIndex] || null
}

const selectedBlindTypeId = (event, arrayBlindTypes) => {
    type_id.value = arrayBlindTypes[event.target.selectedIndex].id || ''
}

const modelOptions = computed(() => {
    if (!type.value) return []
    const typeMap = {
        'Vertical': ['Lateral', 'Central', 'Invertida'],
        'Horizontal': ['Dir', 'Esq'],
        'Rolo': ['Dir', 'Esq', 'Duplex'],
        'Romana': ['Dir', 'Esq', 'Duplex'],
        'Double Vision': ['Dir', 'Esq', 'Duplex'],
    }
    return typeMap[type.value] || []
})

watch(type, () => {
    type_id.value = ''
    model.value = ''
})
</script>