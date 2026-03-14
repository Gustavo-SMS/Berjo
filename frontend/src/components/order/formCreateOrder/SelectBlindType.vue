<template>
  <v-select
    v-model="selectedCollection"
    :options="formattedCollections"
    label="label"
    :clearable="false"
    class="vselect-custom"
  />
</template>

<script setup>
import { ref, watch, computed } from 'vue'
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

    if (props.collection) {
      selectedCollection.value = props.collection
    }

  } catch (error) {
    console.log(error.message)
    notificationStore.addNotification(error.message, 'error')
  }
}

watch(
  () => [props.typeValue, props.collection],
  async ([newType, newCollection]) => {

    if (!newType) {
      blindCollections.value = []
      selectedCollection.value = null
      return
    }

    await fetchBlindCollections(newType)

    if (newCollection) {
      const match = blindCollections.value.find(
        bc => bc.collection === newCollection
      )

      selectedCollection.value = match || null

    } else {
      selectedCollection.value = null
    }
  },
  { immediate: true }
)

watch(selectedCollection, (newValue) => {
  if (newValue) {
    emit('selectedOption', newValue)
  }
})

</script>