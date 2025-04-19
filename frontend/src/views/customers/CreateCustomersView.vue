<template>
    <div class="wrapper">
        <div class="box">
            <form action="" class="form">
                <div class="person">
                    <label for="name">Nome</label>
                    <input type="text" name="name" id="name" required>
                    
                    <label for="email">Email</label>
                    <input type="text" name="email" id="email" required>
            
                    <label for="phone">Telefone</label>
                    <input type="number" name="phone" id="phone" maxlength="11" required>
                </div>
        
                <div class="adress">
                    <label for="street">Rua</label>
                    <input type="text" name="street" id="street" required>
            
                    <label for="house_number">Número</label>
                    <input type="number" name="house_number" id="house_number" required>
            
                    <label for="city">Cidade</label>
                    <input type="text" name="city" id="city" required>
            
                    <label for="district">Bairro</label>
                    <input type="text" name="district" id="district" required>
            
                    <label for="zip">CEP</label>
                    <input type="number" name="zip" id="zip" required>
                </div>
        
                <button @click="submitForm" type="submit" class="btn btn-primary">Cadastrar</button>
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
div.wrapper {
    width: 100vw;
    height: 100vh;

    display: flex;
    align-items: center;
    justify-content: center;

}

div.box {
    width: 70vw;
    height: 60vh;

    border-radius: 8px;
    box-shadow: 1px 1px 5px #333;
    background-color: #f8f9fa;

    padding: 40px;

    overflow: scroll;
}

form {
    display: flex;

    align-items: start;
    justify-content: space-between;
    
    flex-wrap: wrap;
}

label, button {
    display: block;

    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 18px;
}

label {
    width: fit-content;
    height: fit-content;

    margin-bottom: 10px;
}

input {
    width: 400px;
    height: 30px;
    
    font-family: "Roboto", sans-serif;
    font-weight: 400;
    font-size: 14px;

    margin-bottom:20px;

    border-radius: 8px;
}

</style>