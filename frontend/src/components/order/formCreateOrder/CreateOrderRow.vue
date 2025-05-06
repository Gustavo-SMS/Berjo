<template>
    <div class="row g-3 align-items-end mb-4 border rounded shadow-sm p-3 bg-white">
        <div class="col-sm-6 col-md-1">
            <label class="form-label">Qtd</label>
            <input type="number" class="form-control" v-model="row.quantity" min="1" @input="$emit('updateRow', { field: 'quantity', value: row.quantity })">
        </div>

        <div class="col-sm-6 col-md-2">
            <label class="form-label">Tipo</label>
             <SelectType @selectedOption="selectedType"/>
        </div>

        <div class="col-12 col-md-4">
            <label class="form-label">Modelo</label>
            <SelectBlindType  
                :key="type"
                :typeValue="type"
                @selectedOption="selectedBlindTypeId" 
                @change="$emit('updateRow', { field: 'type_id', value: type_id })"
                :disabled="!type"
            />
        </div>

        <div class="col-6 col-md-1">
            <label class="form-label">Largura</label>
            <input type="number" class="form-control" v-model="row.width" min="0" step="0.01" @input="$emit('updateRow', { field: 'width', value: row.width })">
        </div>

        <div class="col-6 col-md-1">
            <label class="form-label">Altura</label>
            <input type="number" class="form-control" v-model="row.height" min="0" step="0.01" @input="$emit('updateRow', { field: 'height', value: row.height })">
        </div>

        <div class="col-6 col-md-1">
            <label class="form-label">Comando</label>
            <input type="number" class="form-control" v-model="row.command_height" min="0" step="0.01" @input="$emit('updateRow', { field: 'command_height', value: row.command_height })">
        </div>

        <div class="col-6 col-md-1">
            <label class="form-label">Lado</label>
            <select :disabled="!modelOptions.length" class="form-control" v-model="row.model" @change="$emit('updateRow', { field: 'model', value: row.model })">
                <option value="" disabled></option>
                <option v-for="option in modelOptions" :key="option" :value="option">
                    {{ option }}
                </option>
            </select>
        </div>

        <div class="col-6 col-md-1 d-flex align-items-end">
            <button @click="$emit('deleteRow', rowId)" class="btn btn-danger" type="button" :disabled="!canDelete">
                Excluir
            </button>
        </div>

        <div class="col-12 mb-2">
            <label class="form-label">Observações</label>
            <input type="text" class="form-control" placeholder="Observações" v-model="row.observation" @input="$emit('updateRow', { field: 'observation', value: row.observation })">
        </div>
            
    </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue'
import SelectBlindType from './SelectBlindType.vue'
import SelectType from './SelectType.vue'

defineProps(['row', 'canDelete', 'rowId'])
defineEmits(['updateRow', 'selectedBlindTypeId', 'deleteRow'])

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

    const defaultOptions = ['Dir', 'Esq']

    const extraOptionsMap  = {
        'Vertical': ['Lateral', 'Central', 'Invertida'],
        'Horizontal': ['Duplex'],
        'Rolo': ['Duplex'],
        'Romana': ['Duplex'],
        'Double Vision': ['Duplex'],
    }
    const extra = extraOptionsMap[type.value] || []
    return [...defaultOptions, ...extra]
})

watch(type, () => {
    type_id.value = ''
    model.value = ''
})
</script>