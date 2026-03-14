<template>
  <div class="card order-row-card mb-3">
    <div class="card-body">

      <div class="row g-3 align-items-end">

        <div class="col-sm-6 col-md-1 dark-input">
          <label class="form-label">Qtd</label>
          <input
            type="number"
            class="form-control"
            v-model="row.quantity"
            min="1"
            @input="$emit('updateRow', { field: 'quantity', value: row.quantity })"
          >
        </div>

        <div class="col-sm-6 col-md-2">
          <label class="form-label">Tipo</label>
          <SelectType
            :typeValue="type"
            @selectedOption="handleTypeSelected"
          />
        </div>

        <div class="col-12 col-md-4">
          <label class="form-label">Modelo</label>
          <SelectBlindType  
            :key="type"
            :typeValue="type"
            @selectedOption="handleBlindTypeSelected" 
            :disabled="!type"
          />
        </div>

        <div class="col-6 col-md-1 dark-input">
          <label class="form-label">Largura</label>
          <input
            type="number"
            class="form-control"
            v-model="row.width"
            min="0"
            step="0.01"
            @input="$emit('updateRow', { field: 'width', value: row.width })"
          >
        </div>

        <div class="col-6 col-md-1 dark-input">
          <label class="form-label">Altura</label>
          <input
            type="number"
            class="form-control"
            v-model="row.height"
            min="0"
            step="0.01"
            @input="$emit('updateRow', { field: 'height', value: row.height })"
          >
        </div>

        <div class="col-6 col-md-1 dark-input">
          <label class="form-label">Comando</label>
          <input
            type="number"
            class="form-control"
            v-model="row.command_height"
            min="0"
            step="0.01"
            @input="$emit('updateRow', { field: 'command_height', value: row.command_height })"
          >
        </div>

        <div class="col-6 col-md-1">
          <label class="form-label">Lado</label>
          <v-select
            v-model="row.model"
            :options="modelOptions"
            :clearable="false"
            :disabled="!modelOptions.length"
            class="vselect-custom"
          />
        </div>

        <div class="col-6 col-md-1 d-flex align-items-end">
          <button
            @click="$emit('deleteRow', rowId)"
            class="btn btn-danger w-100"
            type="button"
            :disabled="!canDelete"
          >
            <i class="bi bi-trash"></i>
          </button>
        </div>

        <div class="col-12 dark-input">
          <label class="form-label">Observações</label>
          <input
            type="text"
            class="form-control"
            placeholder="Observações"
            v-model="row.observation"
            @input="$emit('updateRow', { field: 'observation', value: row.observation })"
          >
        </div>

      </div>

    </div>
  </div>
</template>


<script setup>
import { computed, watch, ref } from 'vue'
import SelectBlindType from './SelectBlindType.vue'
import SelectType from './SelectType.vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

const props = defineProps(['row', 'canDelete', 'rowId'])
const emit = defineEmits(['updateRow', 'deleteRow'])

const type = ref(null)

const handleTypeSelected  = (selected) => {
  type.value = selected

  emit('updateRow', { field: 'type_id', value: '' })
  emit('updateRow', { field: 'model', value: '' })
}

const handleBlindTypeSelected  = (selectedObject) => {
  if (!selectedObject) return

  emit('updateRow', {
    field: 'type_id',
    value: selectedObject.id
  })
}

const modelConfig = {
  'Persiana vertical': {
    includeDefault: false,
    extra: ['Lateral', 'Central', 'Invertida']
  },
  'PH 25mm': {
    includeDefault: true,
    extra: ['Duplex']
  },
  'Rolo': {
    includeDefault: true,
    extra: ['Duplex']
  },
  'Romana': {
    includeDefault: true,
    extra: ['Duplex']
  },
  'Double Vision': {
    includeDefault: true,
    extra: ['Duplex']
  }
}

const modelOptions = computed(() => {
    if (!type.value) return []

    const defaultOptions = ['Dir', 'Esq']
    const config = modelConfig[type.value]
    
    if (!config) return defaultOptions

    return config.includeDefault ? [...defaultOptions, ...config.extra] : config.extra
})

watch(type, () => {
  emit('updateRow', { field: 'type_id', value: '' })
  emit('updateRow', { field: 'model', value: '' })
})

watch(() => props.row.model, (newValue) => {
  emit('updateRow', { field: 'model', value: newValue })
})
</script>