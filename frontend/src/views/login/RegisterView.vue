<template>
    <main class="form-signin w-100 m-auto">
        <form class="form">
            <h1 class="h3 mb-3 fw-normal">Cadastre o usuário</h1>

            <div class="form-floating">
            <input id="login" name="login" type="text" class="form-control" placeholder="Login">
            <label for="login">Login</label>
            </div>
            <div class="form-floating">
            <input id="password" name="password" type="password" class="form-control" placeholder="Senha">
            <label for="password">Senha</label>
            </div>
            <div class="form-floating">
            <input id="confirmPassword" name="confirmPassword" type="password" class="form-control" placeholder="Confirmar senha">
            <label for="confirmPassword">Confirmar Senha</label>
            </div>

            <button class="btn btn-primary w-100 py-2" type="submit" @click="submitForm">Entrar</button>
        </form>
    </main>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { fetchWithAuth } from '@/utils/api'

const notificationStore = useNotificationStore()
const router = useRouter()
const authStore = useAuthStore()

const submitForm = async (event) => {
    event.preventDefault()

    const form = document.querySelector('form')
    const formData = new FormData(form)
    const data = Object.fromEntries(formData)
    try {
        const response = await fetchWithAuth('http://127.0.0.1:3333/register', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
        }, authStore, router)

        if (response.ok) {
            router.push(`/createCustomer`)
        } else {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Erro ao cadastrar usuário')
        }
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

    #floatingConfirmPassword {
    border-top-left-radius: 0.375rem;
    border-top-right-radius: 0.375rem;
    }
</style>