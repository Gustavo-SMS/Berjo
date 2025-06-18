<template>
    <div class="container">
        <form class="form" @submit.prevent="submitForm">
            <h1 class="form-title">Cadastrar Tipo de Persiana</h1>

            <div class="form-group">
                <label for="type">Tipo *</label>
                <input v-model="type" type="text" name="type" id="type" class="form-input" required>
            </div>
                        
            <div class="form-group">
                <label for="collection">Coleção *</label>
                <input v-model="collection" type="text" name="collection" id="collection" class="form-input" required>
            </div>
                
            <div class="form-group">
                <label for="color">Cor *</label>
                <input v-model="color" type="text" name="color" id="color" class="form-input" required>
            </div>

            <div class="form-group">
                <label for="max_width">Largura máx.</label>
                <input v-model="maxWidth" type="number" name="max_width" id="max_width" class="form-input" min="0">
            </div>

            <div class="form-group">
                <label for="price">Preço *</label>
                <input v-model="price" type="number" name="price" id="price" class="form-input" min="0" required>
            </div>

            <button type="submit" class="btn btn-primary">Cadastrar</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { fetchWithAuth } from '@/utils/api'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

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

</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 3rem auto;
  padding: 2rem 1rem;
  background-color: var(--color-background);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--color-text);
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.form-input {
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-surface);
  color: var(--color-text);
}

.form-input:focus {
  outline: 2px solid var(--color-primary);
}

.btn-primary {
  background-color: var(--color-primary);
  color: #fff;
  padding: 0.75rem;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
}
</style>