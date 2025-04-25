<template>
    <main class="register-container">
        <form class="register-form" @submit.prevent="submitForm">
            <h1 class="register-title">Cadastre o usuário</h1>

            <SelectUnlinkedCustomers @selectedOption="selectedUnlinkedCustomer" :refresh-key="refreshKey"/>

            <div class="form-group">
                <label for="login">Login</label>
                <input id="login" name="login" type="text" class="form-input" placeholder="Digite o login" required>
            </div>

            <div class="form-group">
                <label for="password">Senha</label>
                <input id="password" name="password" type="password" class="form-input" placeholder="Digite a senha" required>
            </div>

            <div class="form-group">
                <label for="confirmPassword">Confirmar Senha</label>
                <input id="confirmPassword" name="confirmPassword" type="password" class="form-input" placeholder="Confirme a senha" required>
            </div>

            <button class="btn-primary full-width" type="submit" @click="submitForm">Entrar</button>
        </form>
    </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { fetchWithAuth } from '@/utils/api'
import SelectUnlinkedCustomers from '@/components/customer/SelectUnlinkedCustomers.vue'

const notificationStore = useNotificationStore()
const router = useRouter()
const authStore = useAuthStore()

const unlinkedCustomerId = ref('')
const refreshKey = ref(0)

const selectedUnlinkedCustomer = (selectedCustomerId) => {
    unlinkedCustomerId.value = selectedCustomerId
}

const submitForm = async (event) => {
    event.preventDefault()

    const form = document.querySelector('form')
    const formData = new FormData(form)
    const data = Object.fromEntries(formData)
    data.customerId = unlinkedCustomerId.value
    try {
        const response = await fetchWithAuth('http://127.0.0.1:3333/register', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
        }, authStore, router)

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Erro ao cadastrar usuário')
        }
        
        notificationStore.addNotification('Cliente cadastrado com sucesso!', 'success')
        refreshKey.value++
        form.reset()
    } catch (error) {
        console.log(error.message)
        notificationStore.addNotification(error.message, 'error')
    }
}

</script>

<style scoped>
.register-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background-color: var(--color-background);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.register-title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--color-text);
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-text);
}

.form-input {
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-surface);
  color: var(--color-text);
  font-size: 1rem;
}

.form-input:focus {
  outline: 2px solid var(--color-primary);
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
}

.full-width {
  width: 100%;
}
</style>