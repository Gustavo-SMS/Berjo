<template>
    <main class="form-signin w-100 m-auto">
      <form @submit.prevent="submitNewPassword">
        <h1 class="h3 mb-3 fw-normal">Redefinir Senha</h1>
  
        <div class="form-floating mb-3">
          <input type="password" v-model="newPassword" class="form-control" placeholder="Nova Senha" required />
          <label>Nova Senha</label>
        </div>
  
        <div class="form-floating mb-3">
          <input type="password" v-model="confirmPassword" class="form-control" placeholder="Confirmar Senha" required />
          <label>Confirmar Senha</label>
        </div>
  
        <button class="btn btn-primary w-100 py-2" type="submit">Redefinir</button>
      </form>
    </main>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useNotificationStore } from '@/stores/notificationStore'
  
  const route = useRoute()
  const router = useRouter()
  const notificationStore = useNotificationStore()
  
  const newPassword = ref('')
  const confirmPassword = ref('')
  const token = ref('')
  
  onMounted(() => {
    token.value = route.query.token || ''
    if (!token.value) {
      notificationStore.addNotification('Token inválido.', 'error')
      router.push('/')
    }
  })
  
  const submitNewPassword = async () => {
    if (newPassword.value !== confirmPassword.value) {
      notificationStore.addNotification('As senhas não coincidem.', 'error')
      return
    }
    try {
      const res = await fetch('http://127.0.0.1:3333/users/resetPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token.value,
          newPassword: newPassword.value
        })
      })
  
      const result = await res.json()
  
      if (!res.ok) {
        throw new Error(result.error || 'Erro ao redefinir senha')
      }
  
      notificationStore.addNotification('Senha redefinida com sucesso!', 'success')
      router.push('/login')
    } catch (err) {
      notificationStore.addNotification(err.message, 'error')
    }
  }
  </script>
  
  <style scoped>
  .form-signin {
    max-width: 330px;
    padding: 1rem;
  }
  </style>
  