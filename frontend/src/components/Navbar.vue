<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary rounded" aria-label="Thirteenth navbar example">
      <div class="container-fluid">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample11" aria-controls="navbarsExample11" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse d-lg-flex" id="navbarsExample11">
          <RouterLink to="/" class="navbar-brand col-lg-3 me-0" href="#">Berjo</RouterLink>

          <ul class="navbar-nav col-lg-6 justify-content-lg-center">

            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Clientes</a>
              <ul class="dropdown-menu">
                <li><RouterLink class="dropdown-item" to="/customers">Ver clientes</RouterLink></li>
                <li><RouterLink class="dropdown-item" to="/createCustomer">Cadastrar cliente</RouterLink></li>
              </ul>
            </li>

            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Pedidos</a>

              <ul class="dropdown-menu">
                <li><RouterLink class="dropdown-item" to="/orders">Ver pedidos</RouterLink></li>
                <li><RouterLink class="dropdown-item" to="/createOrder">Cadastrar pedido</RouterLink></li>
              </ul>
            </li>

            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Tipos de persiana</a>
              
              <ul class="dropdown-menu">
                <li><RouterLink class="dropdown-item" to="/blindTypes">Ver tipos</RouterLink></li>
                <li><RouterLink class="dropdown-item" to="/createBlindTypes">Cadastrar tipo</RouterLink></li>
              </ul>
          </li>
          </ul>

          <div class="d-lg-flex col-lg-3 justify-content-lg-end">
            <RouterLink to="/login" class="btn btn-primary">Login</RouterLink>
            <RouterLink to="/register" class="btn btn-secondary">Registrar</RouterLink>
          </div>
        </div>
      </div>
    </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router';


</script>

<style scoped>
  
</style>