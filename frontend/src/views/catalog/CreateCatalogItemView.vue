<template>
  <main class="container-page">
    <div class="card register-card">
      <div class="card-body">
        <div class="page-header">
          <h1>Cadastrar Item</h1>
        </div>

        <form @submit.prevent="submitForm" novalidate class="input-custom">
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
              v-model="priceFormatted"
              type="text"
              class="form-control"
              @input="formatPrice"
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
import { ref } from 'vue'
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
const price = ref(0)
const priceFormatted = ref('')

const MAX_PRICE = 99999.99

const formatPrice = (event) => {
  let value = event.target.value.replace(/\D/g, '')

  value = value.slice(0, 8)

  value = Number(value) / 100

  if (value > MAX_PRICE) {
    value = MAX_PRICE
  }

  price.value = value

  priceFormatted.value = value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

const submitForm = async () => {
  if (price.value > MAX_PRICE) {
    notificationStore.addNotification(
      'O preço máximo permitido é R$ 99.999,99',
      'error'
    )
    return
  }

  const data = {
    type: type.value,
    collection: collection.value,
    color: color.value,
    max_width: maxWidth.value,
    price: price.value
  }

    try {
        const response = await fetchWithAuth('/catalog-items', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
        }, authStore, router)
        
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Erro ao cadastrar item do catálogo')
        }

        notificationStore.addNotification('Item cadastrado com sucesso!', 'success')
        router.push('/catalog')
    } catch (error) {
        console.log(error.message)
        notificationStore.addNotification(error.message, 'error')
    }
}

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