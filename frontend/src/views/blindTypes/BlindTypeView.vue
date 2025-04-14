<template>
    <div class="wrapper">
        <div class="box">
                <input type="text" id="searchByType">
                <button @click="getByType">Buscar tipo</button>
            <div class="row">
                    <div class="col-2">
                        <label for="" class="form-label">Tipo</label>
                    </div>
                    <div class="col-2">
                        <label for="" class="form-label">Coleção</label>
                    </div>
                    <div class="col-1">
                        <label for="" class="form-label">Cor</label>
                    </div>
                    <div class="col-2">
                        <label for="" class="form-label">Largura máx.</label>
                    </div>
                    <div class="col-1">
                        <label for="" class="form-label">Preço</label>
                    </div>
            </div>

            <BlindTypeRow
                v-for="blindType in blindTypes" 
                :key="blindType.id"
                :id="blindType.id"
                :type="blindType.type"
                :collection="blindType.collection"
                :color="blindType.color"
                :max_width="blindType.max_width"
                :price="blindType.price"
                :getBlindTypes="getBlindTypes"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { fetchWithAuth } from '@/utils/api'
import BlindTypeRow from '@/components/blindType/BlindTypeRow.vue'

const notificationStore = useNotificationStore()

const blindTypes = ref([])

    const getBlindTypes = async () => {
        try {
            const response = await fetchWithAuth("http://127.0.0.1:3333/blind_types", {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                },
                credentials: 'include'
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Erro ao buscar clientes')
            }   

            const data = await response.json()
            blindTypes.value = data
        } catch (error) {
            console.log(error.message)
            notificationStore.addNotification(error.message, 'error')
        }
    }

    onMounted(getBlindTypes)

    const getByType = async (event) => {
        event.preventDefault()

        const input = document.querySelector('#searchByType')

        if(!input.value) {
            return getBlindTypes()
        }

        try {
            const response = await fetchWithAuth(`http://127.0.0.1:3333/blind_types/type/${input.value}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                }
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Erro ao buscar tipo')
            }   

            const data = await response.json()
            blindTypes.value = data
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
    width: 80vw;
    height: 60vh;

    border-radius: 8px;
    box-shadow: 1px 1px 5px #333;
    background-color: #f8f9fa;

    padding: 40px;

    overflow: scroll;
}

label {
    font-family: "Roboto", sans-serif;
    font-weight: 700;
}
</style>
