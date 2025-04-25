<template>
    <div class="container">
        <div class="search-section">
            <input v-model="searchTerm" type="text" id="searchByType" class="form-input" placeholder="Buscar por tipo">
            <button @click="getByType" class="btn-secondary">Buscar</button>
        </div>

        <div class="header-row">
            <span>Tipo</span>
            <span>Coleção</span>
            <span>Cor</span>
            <span>Largura Máx.</span>
            <span>Preço</span>
        </div>

        <BlindTypeRow
            v-for="blindType in blindTypes" 
            :key="blindType.id"
            :id="blindType.id"
            :type="blindType.type"
            :collection="blindType.collection"
            :color="blindType.color"
            :max_width="blindType.max_width"
            :price="blindType.price"
            :getBlindTypes="getBlindTypes"
        />
        
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { fetchWithAuth } from '@/utils/api'
import BlindTypeRow from '@/components/blindType/BlindTypeRow.vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const notificationStore = useNotificationStore()

const blindTypes = ref([])
const searchTerm = ref('')

    const getBlindTypes = async () => {
        try {
            const response = await fetchWithAuth("http://127.0.0.1:3333/blind_types", {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                },
                credentials: 'include'
            }, authStore, router)

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Erro ao buscar clientes')
            }   

            const data = await response.json()
            blindTypes.value = data
        } catch (error) {
            console.log(error.message)
            notificationStore.addNotification(error.message, 'error')
        }
    }

    onMounted(getBlindTypes)

    const getByType = async (event) => {
        event.preventDefault()

        if(!searchTerm.value) {
            return getBlindTypes()
        }

        try {
            const response = await fetchWithAuth(`http://127.0.0.1:3333/blind_types/type/${searchTerm.value}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                }
            }, authStore, router)

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Erro ao buscar tipo')
            }   

            const data = await response.json()
            blindTypes.value = data
        } catch (error) {
            console.log(error.message)
            notificationStore.addNotification(error.message, 'error')
        }
        
    }
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background-color: var(--color-background);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
}

.search-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.form-input {
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-surface);
  color: var(--color-text);
  min-width: 200px;
}

.btn-secondary {
  background-color: var(--color-secondary);
  color: #fff;
  padding: 0.75rem 1rem;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-secondary:hover {
  background-color: var(--color-secondary-dark);
}

.header-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  padding: 0.75rem;
  font-weight: bold;
  background-color: var(--color-surface);
  border-bottom: 2px solid var(--color-border);
  margin-bottom: 1rem;
  color: var(--color-text);
}
</style>
