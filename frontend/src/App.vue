<template>
  <div class="app-layout" :class="{ 'with-sidebar': showSidebar }">
    <Sidebar v-if="showSidebar" />
    <Notification />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue'
import Notification from '@/components/Notification.vue'
import { useAuthStore } from '@/stores/authStore'
import { computed } from 'vue'

const authStore = useAuthStore()
authStore.loadFromStorage()

const showSidebar = computed(() => !!authStore.userRole)
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 260px;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  z-index: 100;
}

.main-content {
  width: 100%;
  background: radial-gradient(circle at top, #1a1a1a, #0f0f0f);
}

.with-sidebar .main-content {
  margin-left: 260px;
  width: calc(100% - 260px);
}
</style>