<template>
    <select v-model="selectedUserId" @change="$emit('selectedOption', selectedUserId)" class="form-select">
      <option value="">Selecione um usuário</option>
      <option v-for="user in unlinkedUsers" :key="user.id" :value="user.id">
        {{ user.login }}
      </option>
    </select>
  </template>
  
<script setup>
import { ref, onMounted, watch } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { fetchWithAuth } from '@/utils/api'

defineEmits(['selectedOption'])
const props = defineProps(['refreshKey'])

const notificationStore = useNotificationStore()
  
const selectedUserId = ref('')
const unlinkedUsers = ref([])
  
const fetchUnlinkedUsers = async () => {
    try {
      const response = await fetchWithAuth('http://127.0.0.1:3333/users/unlinked', {
              method: 'GET',
              headers: {
                  'Content-type': 'application/json'
              },
              credentials: 'include'
          })

      const data = await response.json()

      if (!response.ok) {
          throw new Error(data.error || 'Erro ao buscar usuários')
      }

      unlinkedUsers.value = data
    } catch (error) {
      console.error(error.message)
      notificationStore.addNotification(error.message, 'error')
    }
  }

onMounted(fetchUnlinkedUsers)

watch(() => props.refreshKey, () => {
  fetchUnlinkedUsers()
})
</script>