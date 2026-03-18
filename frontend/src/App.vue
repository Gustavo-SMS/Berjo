<template>
  <div class="app-layout">
    <div 
      v-if="isMobile && isSidebarOpen"
      class="sidebar-overlay"
      @click="isSidebarOpen = false"
    ></div>

    <Sidebar 
      v-if="showSidebar"
      :class="{ open: isSidebarOpen }"
    />

    <Notification />

    <main class="main-content" :class="{ 'with-sidebar': showSidebar }">
      <button
        v-if="showSidebar"
        class="hamburger-btn"
        @click="toggleSidebar"
      >
        ☰
      </button>
      <RouterView />
    </main>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Notification from '@/components/Notification.vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
authStore.loadFromStorage()

const showSidebar = computed(() => !!authStore.userRole)

const isSidebarOpen = ref(false)
const isMobile = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const checkScreen = () => {
  isMobile.value = window.innerWidth < 992
  if (!isMobile.value) {
    isSidebarOpen.value = true
  } else {
    isSidebarOpen.value = false
  }
}

onMounted(() => {
  checkScreen()
  window.addEventListener('resize', checkScreen)
})
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 260px;
  height: 100vh;
  background: #111;
  transition: transform 0.3s ease;
  z-index: 200;
}

@media (min-width: 992px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    transform: translateX(0);
  }

  .with-sidebar {
    margin-left: 260px;
    width: calc(100% - 260px);
  }

  .hamburger-btn {
    display: none;
  }
}

@media (max-width: 991px) {

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    transform: translateX(-100%);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .main-content {
    width: 100%;
    margin-left: 0;
  }

  .hamburger-btn {
    position: fixed;
    top: 15px;
    left: 15px;
    z-index: 300;
    background: #000;
    color: #d4af37;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
  }

  .sidebar-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    z-index: 150;
  }
}

.main-content {
  background: radial-gradient(circle at top, #1a1a1a, #0f0f0f);
  min-height: 100vh;
  width: 100vw;
}
</style>