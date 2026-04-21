<template>
      <div class="row g-3 mb-2 blind-row">
        <div class="col-6 col-lg-1 dark-input">
          <label class="mobile-label">Qtd</label>
          <input
            type="number"
            class="form-control"
            v-model="row.quantity"
            min="1"
            @input="$emit('updateRow', { field: 'quantity', value: row.quantity })"
            required
          >
        </div>

        <div class="col-6 col-lg-2">
          <label class="mobile-label">Tipo</label>
          <SelectType
            :typeValue="type"
            @selectedOption="handleTypeSelected"
          />
        </div>

        <div class="col-12 col-lg-3">
          <label class="mobile-label">Modelo</label>
          <SelectBlindType  
            :key="type"
            :typeValue="type"
            @selectedOption="handleBlindTypeSelected" 
            :disabled="!type"
          />
        </div>

        <div class="col-6 col-lg-1 dark-input">
          <label class="mobile-label">Largura</label>
          <input
            type="number"
            class="form-control"
            v-model="row.width"
            min="0"
            step="0.01"
            @input="$emit('updateRow', { field: 'width', value: row.width })"
            required
          >
        </div>

        <div class="col-6 col-lg-1 dark-input">
          <label class="mobile-label">Altura</label>
          <input
            type="number"
            class="form-control"
            v-model="row.height"
            min="0"
            step="0.01"
            @input="$emit('updateRow', { field: 'height', value: row.height })"
            required
          >
        </div>

        <div class="col-6 col-lg-1 dark-input">
          <label class="mobile-label">Comando</label>
          <input
            type="number"
            class="form-control"
            v-model="row.command_height"
            min="0"
            step="0.01"
            @input="$emit('updateRow', { field: 'command_height', value: row.command_height })"
            required
          >
        </div>

        <div class="col-6 col-lg-2">
          <label class="mobile-label">Lado</label>
          <v-select
            v-model="row.model"
            :options="modelOptions"
            :clearable="false"
            :disabled="!modelOptions.length"
            class="vselect-custom"
          />
        </div>

        <div class="col-12 col-lg-1 d-flex align-items-end">
          <button
            @click="$emit('deleteRow', rowId)"
            class="btn btn-danger w-100"
            type="button"
            :disabled="!canDelete"
          >
            <i class="bi bi-trash"></i>
          </button>
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

<style scoped>
.blind-row {
  padding-bottom: 0.5rem;
}

.mobile-label {
  display: none;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-gold);
  margin-bottom: 2px;
}

@media (max-width: 768px) {
  .mobile-label {
    display: block;
  }
}
</style>