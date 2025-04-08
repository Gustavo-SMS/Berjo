<template>
    <main class="form-signin w-100 m-auto">
      <form>
        <h1 class="h3 mb-3 fw-normal">Faça Login</h1>
        
        <div class="form-floating">
          <input id="login" name="login" type="email" class="form-control" placeholder="name@example.com">
          <label for="login">Email</label>
        </div>
        <div class="form-floating">
          <input id="password" name="password" type="password" class="form-control" placeholder="Password">
          <label for="password">Senha</label>
        </div>
        
        <button class="btn btn-primary w-100 py-2" type="submit" @click="submitForm">Entrar</button>
      </form>
    </main>
</template>

<script setup>
import { useNotificationStore } from '@/stores/notificationStore'

const notificationStore = useNotificationStore()

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
        
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Erro ao logar')
        }
        
        window.location.href = '/'    
    } catch (error) {
      console.log(error.message)
      notificationStore.addNotification(error.message, 'error')
    }
    
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