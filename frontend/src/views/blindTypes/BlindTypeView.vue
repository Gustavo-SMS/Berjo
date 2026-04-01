<template>
  <main class="page-content">
    <div class="card">
      <div class="card-body">
        <div class="page-header d-flex justify-content-between align-items-center flex-wrap gap-3">
          <h1>Tipos de persiana</h1>
        </div>

          <div class="d-flex align-items-center gap-2 flex-wrap mb-4 justify-content-start">
            <div class="input-group dark-input" style="max-width: 350px">
              <input
                v-model="searchTerm"
                type="text"
                class="form-control"
                placeholder="Buscar"
              />
              <button @click="getWithFilter" class="btn btn-outline-gold">
                Buscar
              </button>
            </div>

            <v-select
              v-model="selectedOption"
              :options="statusOptions"
              label="label"
              :reduce="option => option.value"
              :clearable="false"
              class="vselect-custom"
            />

            <div v-if="authStore.userRole === 'ADMIN'" class="ms-auto">
              <RouterLink to="/createBlindTypes" class="btn btn-primary">
                Adicionar tipo
              </RouterLink>
            </div>
          </div>

        <div class="list-header d-none d-md-grid">
          <span>Tipo</span>
          <span>Coleção</span>
          <span>Cor</span>
          <span>Largura Máx.</span>
          <span>Preço</span>
          <span v-if="authStore.userRole === 'ADMIN'">Ações</span>
        </div>

        <BlindTypeRow
          v-for="blindType in paginatedBlindTypes"
          :key="blindType.id"
          :blindType="blindType"
          :getBlindTypes="getBlindTypes"
        />

        <nav v-if="totalPages > 1" class="pagination-wrapper">
          <ul class="pagination pagination-dark">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="goToPage(currentPage - 1)">
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
              <button class="page-link" @click="goToPage(currentPage + 1)">
                Próxima
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { fetchWithAuth } from '@/utils/api'
import BlindTypeRow from '@/components/blindType/BlindTypeRow.vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

const authStore = useAuthStore()
const router = useRouter()

const blindTypes = ref([])
const searchTerm = ref('')

const currentPage = ref(1)
const itemsPerPage = 3

const selectedOption = ref('type')

const statusOptions = [
  { label: 'Tipo', value: 'type' },
  { label: 'Coleção', value: 'collection' }
]

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
            throw new Error(errorData.error || 'Erro ao buscar tipos de persiana')
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
.list-header {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 2fr 1fr 2fr;
  gap: 1rem;
  padding: 0.75rem 1rem;
  color: var(--color-gold);
  font-weight: 600;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 1rem;
}
</style>