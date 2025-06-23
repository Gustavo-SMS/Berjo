<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary shadow-sm rounded">
      <div class="container-fluid">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse d-lg-flex" id="mainNavbar">
          <RouterLink to="/" class="navbar-brand col-lg-3 me-0 fw-bold text-primary" href="#">Berjo</RouterLink>

          <ul class="navbar-nav col-lg-6 justify-content-lg-center gap-2">
            <li v-if="authStore.userRole && authStore.userRole === 'ADMIN'" class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Clientes</a>
              
              <ul class="dropdown-menu">
                <li><RouterLink class="dropdown-item" to="/customers">Lista clientes</RouterLink></li>
                <li><RouterLink class="dropdown-item" to="/createCustomer">Cadastro cliente</RouterLink></li>
                <li><RouterLink class="dropdown-item" to="/register">Cadastro usuário</RouterLink></li>
              </ul>
            </li>

            <li v-if="authStore.userRole" class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Pedidos</a>

              <ul v-if="authStore.userRole" class="dropdown-menu">
                <li><RouterLink class="dropdown-item" to="/orders">Lista pedidos</RouterLink></li>
                <li><RouterLink class="dropdown-item" to="/createOrder">Cadastro pedido</RouterLink></li>
              </ul>
            </li>

            <li v-if="authStore.userRole" class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Tipos de persiana</a>
              
              <ul class="dropdown-menu">
                <li><RouterLink class="dropdown-item" to="/blindTypes">Lista tipos</RouterLink></li>
                <li v-if="authStore.userRole === 'ADMIN'"><RouterLink class="dropdown-item" to="/createBlindTypes">Cadastro tipo</RouterLink></li>
              </ul>
          </li>
          </ul>

          <div v-if="authStore.userRole" class="dropdown ms-auto">
            <button
              class="btn d-flex align-items-center"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-person-circle me-1" style="font-size: 1.5rem;"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><RouterLink class="dropdown-item" to="/customerProfile">Perfil</RouterLink></li>
              <li><RouterLink class="dropdown-item" to="/reports">Relatórios</RouterLink></li>
              <li><hr class="dropdown-divider"></li>
              <li><button class="dropdown-item text-danger" @click="doLogout">Sair</button></li>
            </ul>
          </div>
          
        </div>
      </div>
    </nav>
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
.navbar {
  padding: 0.5rem 0.8rem;
}
.nav-link {
  font-weight: 500;
}
</style>