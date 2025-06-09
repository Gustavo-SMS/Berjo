<template>
    <div class="container">
        <div class="search-section d-flex align-items-center justify-content-start gap-2 mb-3">
          <div class="input-group" style="max-width: 350px">
            <input v-model="searchTerm" type="text" id="searchByType" class="form-control" placeholder="Buscar por tipo">
            <button @click="getWithFilter" class="btn btn-secondary">Buscar</button>
          </div>
            <select v-model="selectedOption" class="form-select w-auto" style="min-width: 150px">
              <option value="type">Tipo</option>
              <option value="collection">Coleção</option>
            </select>
        </div>

        <div class="header-row">
            <span>Tipo</span>
            <span>Coleção</span>
            <span>Cor</span>
            <span>Largura Máx.</span>
            <span>Preço</span>
            <span>Ações</span>
        </div>

        <BlindTypeRow
            v-for="blindType in paginatedBlindTypes" 
            :key="blindType.id"
            :blindType="blindType"
            :getBlindTypes="getBlindTypes"
        />
        
        <nav v-if="totalPages > 1" class="mt-3">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button class="page-link" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
                    Anterior
                  </button>
                </li>

                <li
                  v-for="page in totalPages"
                  :key="page"
                  class="page-item"
                  :class="{ active: currentPage === page }"
                >
                  <button class="page-link" @click="goToPage(page)">
                    {{ page }}
                  </button>
                </li>

                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <button class="page-link" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">
                    Próxima
                  </button>
                </li>
              </ul>
            </nav>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { fetchWithAuth } from '@/utils/api'
import BlindTypeRow from '@/components/blindType/BlindTypeRow.vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const blindTypes = ref([])
const searchTerm = ref('')

const currentPage = ref(1)
const itemsPerPage = 2

const selectedOption = ref('type')

const getBlindTypes = async () => {
    try {
        const response = await fetchWithAuth("/blind_types", {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
        }, authStore, router)

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Erro ao buscar clientes')
        }   

        const data = await response.json()
        blindTypes.value = data
        currentPage.value = 1
    } catch (error) {
        console.log(error.message)
    }
}

const getWithFilter = async () => {
  const name = encodeURIComponent(searchTerm.value.trim())

  if(!searchTerm.value) {
      return getBlindTypes()
  }

  try {
      const response = await fetchWithAuth(`/blind_types/search?name=${name}&filter=${selectedOption.value}`, {
          method: 'GET',
          headers: {
              'Content-type': 'application/json'
          }
      }, authStore, router)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar tipo')
      }   

      blindTypes.value = data
  } catch (error) {
      console.log(error.message)
  }
}

onMounted(getBlindTypes)

const totalPages = computed(() =>
  Math.ceil(blindTypes.value.length / itemsPerPage)
)

const paginatedBlindTypes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return blindTypes.value.slice(start, start + itemsPerPage)
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

watch(searchTerm, () => {
  currentPage.value = 1
})
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

.header-row {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 2fr 1fr 2fr;
  gap: 1rem;
  padding: 0.75rem;
  font-weight: bold;
  background-color: var(--color-surface);
  border-bottom: 2px solid var(--color-border);
  margin-bottom: 1rem;
  color: var(--color-text);
}

@media (max-width: 768px) {
  .header-row {
    display: none;
  }
}
</style>
