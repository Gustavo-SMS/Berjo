<template>
    <main class="form-signin w-100 m-auto">
      <form>
        <h1 class="h3 mb-3 fw-normal">Faça Login</h1>
        
        <div class="form-floating">
          <input id="login" name="login" type="text" class="form-control" placeholder="Login">
          <label for="login">Login</label>
        </div>
        <div class="form-floating">
          <input id="password" name="password" type="password" class="form-control" placeholder="Password">
          <label for="password">Senha</label>
        </div>

        <div>
          <button class="btn btn-outline-warning" type="button" @click="openRecoverPasswordModal">Esqueci minha senha</button>
          <RecoverPasswordModal ref="recoverPasswordModal" />
        </div>
        
        <button class="btn btn-primary w-100 py-2" type="submit" @click="submitForm">Entrar</button>
      </form>
    </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notificationStore'
import { useAuthStore } from '@/stores/authStore'
import RecoverPasswordModal from '@/components/modal/RecoverPasswordModal.vue'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const router = useRouter()

const submitForm = async (event) => {
    event.preventDefault()

    const form = document.querySelector('form')
    const formData = new FormData(form)
    const data = Object.fromEntries(formData)
    try {
      const response = await fetch('http://127.0.0.1:3333/login', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
        })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || result.msg || 'Erro ao logar')
      }

      const meRes = await fetch('http://127.0.0.1:3333/me', {
        credentials: 'include'
      })

      const meData = await meRes.json()

      if (!meRes.ok) {
        throw new Error(meData.error || 'Erro ao obter dados do usuário')
      }
        
      authStore.setUser(meData.role, meData.customerId)
      router.push('/')   
    } catch (error) {
      console.log(error.message)
      notificationStore.addNotification(error.message, 'error')
    } 
}

const recoverPasswordModal = ref(null)
const openRecoverPasswordModal = () => {
  recoverPasswordModal.value?.showModal()
}

</script>

<style scoped>
.form-signin {
  max-width: 330px;
  padding: 1rem;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}

.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

</style>