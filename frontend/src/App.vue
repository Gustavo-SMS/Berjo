<template>

  <div class="app-layout">
    <Sidebar />
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

const authStore = useAuthStore()
authStore.loadFromStorage()
  
</script>

<style>
.app-layout {
  display: flex;
  min-height: 100vh;
}

/* Sidebar fixa */
.sidebar {
  width: 260px;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  z-index: 100;
}

/* Conteúdo */
.main-content {
  margin-left: 260px; /* MESMA largura da sidebar */
  width: calc(100% - 260px);
  padding: 32px;
    background: radial-gradient(
    circle at top,
    #1a1a1a,
    #0f0f0f
  );
}

</style>