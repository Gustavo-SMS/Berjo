<template>
  <aside v-if="authStore.userRole" class="sidebar">
    <div class="sidebar-brand">
      <RouterLink to="/" class="brand-title" href="#">Berjo</RouterLink>
    </div>

    <nav class="sidebar-menu">
      <RouterLink
        to="/customers"
        class="menu-item"
        active-class="active"
      >
        <i class="bi bi-people"></i>
        <span>Clientes</span>
      </RouterLink>

      <RouterLink
        to="/orders"
        class="menu-item"
        active-class="active"
      >
        <i class="bi bi-bag"></i>
        <span>Pedidos</span>
      </RouterLink>

      <RouterLink
        to="/blindTypes"
        class="menu-item"
        active-class="active"
      >
        <i class="bi bi-grid"></i>
        <span>Tipos de Persiana</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
</script>

<style scoped>
.sidebar {
  width: 260px;
  height: 100vh;
  background-color: #111111;
  color: #e5e5e5;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(212, 175, 55, 0.2);
}

.sidebar-brand {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
}

.brand-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #d4af37;
  letter-spacing: 0.5px;
}

.sidebar-menu {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 8px;
  color: #cfcfcf;
  text-decoration: none;
  font-size: 0.95rem;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.menu-item i {
  font-size: 1.1rem;
}

.menu-item:hover {
  background-color: rgba(212, 175, 55, 0.12);
  color: #ffffff;
}

.menu-item.active {
  background-color: rgba(212, 175, 55, 0.18);
  color: #ffffff;
}

.menu-item.active i {
  color: #d4af37;
}
</style>