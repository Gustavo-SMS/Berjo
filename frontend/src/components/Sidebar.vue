<template>
<aside v-if="authStore.userRole" class="sidebar">

  <div class="sidebar-brand">
    <RouterLink to="/" class="brand-title">Berjo</RouterLink>
  </div>

  <nav class="sidebar-menu">
    <RouterLink v-if="authStore.userRole && authStore.userRole === 'ADMIN'" to="/customers" class="menu-item" active-class="active">
      <i class="bi bi-people"></i>
      <span>Clientes</span>
    </RouterLink>

    <RouterLink to="/orders" class="menu-item" active-class="active">
      <i class="bi bi-bag"></i>
      <span>Pedidos</span>
    </RouterLink>

    <RouterLink to="/catalog" class="menu-item" active-class="active">
      <i class="bi bi-grid"></i>
      <span>Catálogo</span>
    </RouterLink>

    <RouterLink class="menu-item" to="/reports">
      <i class="bi bi-file-earmark-text"></i>
      Relatórios
    </RouterLink>

    <div class="menu-bottom">

      <RouterLink class="menu-item profile" to="/customerProfile">
        <i class="bi bi-person-circle"></i>
        Perfil
      </RouterLink>
    </div>
  </nav>


  <div class="sidebar-footer">
          

          
        <hr class="dropdown-divider">

    <button class="btn btn-danger logout-btn" @click="doLogout">
      <i class="bi bi-box-arrow-left"></i>
      Sair
    </button>

  </div>

</aside>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { fetchWithAuth } from '@/utils/api'
import { useLogout } from '@/utils/logout'

const router = useRouter()
const authStore = useAuthStore()

const doLogout = async () => {
  try {
    const response = await fetchWithAuth('/logout', {
      method: 'POST'
    }, authStore, router)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.msg)
    }

    useLogout(authStore, router)
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
    useLogout(authStore, router)
  }
}
</script>

<style scoped>
.sidebar {
  width: 260px;
  height: 100vh;
  background-color: var(--bg-sidebar);
  color: var(--text-primary);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--bg-active);
}

.sidebar-brand {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid var(--bg-active);
}

.brand-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-primary);
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
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.95rem;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.menu-item i {
  font-size: 1.1rem;
}

.menu-item:hover {
  background-color: var(--bg-active);
  color: var(--text-primary)
}

.menu-item.active {
  background-color: var(--bg-actives);
  color: var(--text-primary)
}

.menu-item.active i {
  color: var(--color-primary);
}

.sidebar-menu {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.sidebar-footer {
  margin-top: auto;
  padding: 15px;
  border-top: 1px solid var(--bg-active);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.logout-btn {
  width: 100%;
}

.menu-bottom {
  margin-top: auto;
}
</style>