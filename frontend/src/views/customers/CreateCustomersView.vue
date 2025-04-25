<template>
    <div class="container">
        <div class="form-wrapper shadow-sm">
            <form @submit.prevent="submitForm" class="row g-4">
                <div class="col-12 col-md-6">
                    <label for="name" class="form-label">Nome</label>
                    <input type="text" name="name" id="name" class="form-control" required>
                </div>

                <div class="col-12 col-md-6">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" name="email" id="email" class="form-control" required>
                </div>

                <div class="col-12 col-md-6">
                    <label for="phone" class="form-label">Telefone</label>
                    <input type="tel" name="phone" id="phone" maxlength="11" class="form-control" required>
                </div>

                <div class="col-12 col-md-6">
                    <label for="zip" class="form-label">CEP</label>
                    <input type="text" name="zip" id="zip" class="form-control" required>
                </div>

                <div class="col-12 col-md-6">
                    <label for="street" class="form-label">Rua</label>
                    <input type="text" name="street" id="street" class="form-control" required>
                </div>

                <div class="col-6 col-md-3">
                    <label for="house_number" class="form-label">Número</label>
                    <input type="text" name="house_number" id="house_number" class="form-control" required>
                </div>

                <div class="col-6 col-md-3">
                    <label for="district" class="form-label">Bairro</label>
                    <input type="text" name="district" id="district" class="form-control" required>
                </div>

                <div class="col-12 col-md-6">
                    <label for="city" class="form-label">Cidade</label>
                    <input type="text" name="city" id="city" class="form-control" required>
                </div>
        
                <div class="col-12">
                    <button type="submit" class="btn btn-primary w-100">Cadastrar</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { useNotificationStore } from '@/stores/notificationStore'
import { fetchWithAuth } from '@/utils/api'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const notificationStore = useNotificationStore()

const submitForm = async (event) => {
    event.preventDefault()

    const form = document.querySelector('form')
    const formData = new FormData(form)
    const data = Object.fromEntries(formData)
    try {
        const response = await fetchWithAuth('http://127.0.0.1:3333/customers', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
        }, authStore, router)

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Erro ao cadastrar cliente')
        }

        notificationStore.addNotification('Cliente cadastrado com sucesso!', 'success')
        router.push('/register')
    } catch (error) {
        console.log(error.message)
        notificationStore.addNotification(error.message, 'error')
    }
}

</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;
}

.form-wrapper {
  background-color: var(--color-surface);
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 800px;
}
</style>