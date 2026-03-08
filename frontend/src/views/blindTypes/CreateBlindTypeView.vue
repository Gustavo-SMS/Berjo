<template>
  <main class="page-content">
    <div class="card register-card">
      <div class="card-body">
        <div class="page-header">
          <h1>Cadastrar tipo de persiana</h1>
        </div>

        <form @submit.prevent="submitForm" novalidate class="dark-input">
          <div class="mb-3">
            <label class="form-label">Tipo *</label>
              <v-select
                v-model="type"
                :options="typeOptions"
                label="label"
                :reduce="option => option.value"
                :clearable="false"
                class="vselect-custom"
              />
          </div>

          <div class="mb-3">
            <label class="form-label">Coleção *</label>
            <input
              v-model="collection"
              type="text"
              class="form-control"
              required
            />
          </div>

          <div class="mb-3">
            <label class="form-label">Cor *</label>
            <input
              v-model="color"
              type="text"
              class="form-control"
              required
            />
          </div>

          <div class="mb-3">
            <label class="form-label">Largura máx.</label>
            <input
              v-model="maxWidth"
              type="number"
              class="form-control"
              min="0"
            />
          </div>

          <div class="mb-4">
            <label class="form-label">Preço *</label>
            <input
              v-model="price"
              type="number"
              class="form-control"
              min="0"
              required
            />
          </div>

          <button type="submit" class="btn btn-primary w-100">
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  </main>
</template>


<script setup>
import { ref, computed } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { fetchWithAuth } from '@/utils/api'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

const authStore = useAuthStore()
const router = useRouter()
const notificationStore = useNotificationStore()

const type = ref('')
const collection = ref('')
const color = ref('')
const maxWidth = ref('')
const price = ref('')

const submitForm = async () => {
  const data = {
    type: type.value,
    collection: collection.value,
    color: color.value,
    max_width: maxWidth.value,
    price: price.value
  }

    try {
        const response = await fetchWithAuth('/blind_types', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
        }, authStore, router)
        
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Erro ao cadastrar tipo de persiana')
        }

        notificationStore.addNotification('Tipo cadastrado com sucesso!', 'success')
        router.push('/blindTypes')
    } catch (error) {
        console.log(error.message)
        notificationStore.addNotification(error.message, 'error')
    }
}

// const typeOptions = ['Persiana vertical', 'PH 25mm', 'Rolo', 'Romana']
const typeOptions = [
  { label: 'Persiana vertical', value: 'Persiana vertical' },
  { label: 'PH 25mm', value: 'PH 25mm' },
  { label: 'Rolo', value: 'Rolo' },
  { label: 'Romana', value: 'Romana' }
]
</script>

<style scoped>
.register-card {
  max-width: 520px;
  margin: 5rem auto;
}
</style>