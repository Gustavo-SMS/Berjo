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
        </div>
    </div>
</template>

<script setup>
import { createVNode, onMounted, render } from 'vue'
import BlindTypeRow from '@/components/blindType/BlindTypeRow.vue'
import { useNotificationStore } from '@/stores/notificationStore'

const notificationStore = useNotificationStore()

    const addRow = (blindType) => {
        const container = document.querySelector('div.box')
        const wrapper = document.createElement('div');
        container.appendChild(wrapper)

        const vNode = createVNode(BlindTypeRow, 
        {   
            id: blindType.id,
            type: blindType.type,
            collection: blindType.collection,
            color: blindType.color,
            max_width: blindType.max_width,
            price: blindType.price,
            getBlindTypes
        })

        render(vNode, wrapper)
    }

    const clearScreen = () => {
        const container = document.querySelector('div.box');

        const totalChildren = container.children.length;

        for (let i = totalChildren - 1; i >= 3; i--) {
            container.removeChild(container.children[i]);
        }
    }

    const getBlindTypes = async () => {
        try {
            const response = await fetch("http://127.0.0.1:3333/blind_types", {
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
            clearScreen()
            data.map(blindType => {
                addRow(blindType)
            })
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
            const response = await fetch(`http://127.0.0.1:3333/blind_types/type/${input.value}`, {
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
            clearScreen()
            data.map(blindType => {
                addRow(blindType)
            })
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
