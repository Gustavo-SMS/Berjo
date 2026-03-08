<template>
  <v-select
    v-model="selectedCollection"
    :options="formattedCollections"
    label="label"
    :reduce="option => option.collection"
    :clearable="false"
    class="vselect-custom"
  />
</template>

<script setup>
import { ref, watch, computed, nextTick } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { fetchWithAuth } from '@/utils/api'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

const emit = defineEmits(['selectedOption'])

const props = defineProps(['typeValue', 'collection'])

const authStore = useAuthStore()
const router = useRouter()
const notificationStore = useNotificationStore()

const selectedCollection = ref(props.collection || null)
const blindCollections = ref([])

const formattedCollections = computed(() =>
  blindCollections.value.map(bc => ({
    ...bc,
    label: bc.collection
      ? `${bc.collection} ${bc.color}`
      : 'Selecione'
  }))
)

const fetchBlindCollections = async (type) => {
  if (!type) return

  try {
    const response = await fetchWithAuth(`/blind_types/search?name=${type}`, {
        method: 'GET',
        headers: { 'Content-type': 'application/json' }
      },
      authStore,
      router
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Erro ao buscar coleções')
    }

    const blindTypes = await response.json()

    blindCollections.value = blindTypes.map(bt => ({
      id: bt.id,
      collection: bt.collection,
      color: bt.color
    }))

    await nextTick()

    if (props.collection) {
      selectedCollection.value = props.collection
    }

  } catch (error) {
    console.log(error.message)
    notificationStore.addNotification(error.message, 'error')
  }
}

watch(() => props.typeValue, fetchBlindCollections, { immediate: true })

watch(selectedCollection, (newValue) => {
  const selectedObject = blindCollections.value.find(
    bc => bc.collection === newValue
  )

  if (selectedObject) {
    emit('selectedOption', selectedObject)
  }
})

watch(() => props.collection, (newValue) => {
  selectedCollection.value = newValue || null
}, { immediate: true })
</script>