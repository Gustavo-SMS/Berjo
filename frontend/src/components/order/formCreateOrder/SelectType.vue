<template>
  <v-select
    v-model="selectedType"
    :options="arrayBlindTypes"
    :clearable="false"
    class="vselect-custom"
  />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { fetchWithAuth } from '@/utils/api'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

const emit = defineEmits(['selectedOption'])
const props = defineProps(['typeValue'])

const authStore = useAuthStore()
const router = useRouter()
const notificationStore = useNotificationStore()

const arrayBlindTypes = ref([])
const selectedType = ref(props.typeValue || null)

const fetchTypes = async () => {
  try {
    const response = await fetchWithAuth(
      "/blind_types/type",
      {
        method: 'GET',
        headers: { 'Content-type': 'application/json' }
      },
      authStore,
      router
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Erro ao buscar tipos')
    }

    const types = await response.json()

    arrayBlindTypes.value = [...new Set(types.map(item => item.type))]

    if (props.typeValue && arrayBlindTypes.value.includes(props.typeValue)) {
      selectedType.value = props.typeValue
    }

  } catch (error) {
    console.log(error.message)
    notificationStore.addNotification(error.message, 'error')
  }
}

onMounted(fetchTypes)

watch(selectedType, (newValue) => {
  emit('selectedOption', newValue)
})

watch(() => props.typeValue, (newValue) => {
  selectedType.value = newValue || null
})
</script>