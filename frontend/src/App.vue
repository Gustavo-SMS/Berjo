<template>
  
    <Navbar />
    <Notification />
    <div class="wrapper">
      <RouterView />
    </div>
    
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import Notification from '@/components/Notification.vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
authStore.loadFromStorage()
  
</script>

<style>

</style>
