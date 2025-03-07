<template>
    <div class="wrapper">
        <div class="box">
            <select v-model="selected" name="selectStatus" id="selectStatus">
                <option value=""></option>
                <option value="Em espera">Em espera</option>
                <option value="Em produção">Em produção</option>
                <option value="Concluido">Concluido</option>
            </select>
            <button @click="getByStatus">Filtrar</button>
            
            <div class="row">
                    <div class="col-2">
                        <label for="" class="form-label">Cliente</label>
                    </div>
                    <div class="col-1">
                        <label for="" class="form-label">Quantidade</label>
                    </div>
                    <div class="col-1">
                        <label for="" class="form-label">Tipo</label>
                    </div>
                    <div class="col-2">
                        <label for="" class="form-label">Cor</label>
                    </div>
                    <div class="col-1">
                        <label for="" class="form-label">Largura</label>
                    </div>
                    <div class="col-1">
                        <label for="" class="form-label">Altura</label>
                    </div>
                    <div class="col-1">
                        <label for="" class="form-label">Alt.Comando</label>
                    </div>
                    <div class="col-1">
                        <label for="" class="form-label">Modelo</label>
                    </div>
                    <div class="col-2">
                        <label for="" class="form-label">Status</label>
                    </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import OrderRow from '@/components/order/OrderRow.vue';
import { ref, onMounted, createVNode, render } from 'vue';

    const selected = ref()

    const addRow = (blind, status, name) => {
        const container = document.querySelector('div.box')
        const wrapper = document.createElement('div');
        container.appendChild(wrapper)
        
        const vNode = createVNode(OrderRow, 
        {   
            id: blind.id,
            name: name,
            quantity: blind.quantity,
            type: blind.type.type,
            collection: blind.type.collection,
            color: blind.type.color,
            width: blind.width,
            height: blind.height,
            command_height: blind.command_height,
            model: blind.model,
            status: status,
            getByStatus
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

    const getPendingOrders = () => {
        try {
            fetch(`http://127.0.0.1:3333/orders/status/Em espera`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                },
                credentials: 'include'
            }).then((res) => {
                res.json().then((orders) => {
                    clearScreen()
                    orders.map((order) => {
                        const name = order.customer.name
                        const status = order.status
                        order.blind.map((blind) => {
                            addRow(blind, status, name)
                        })
                    })
                })
            })
        } catch (error) {
            console.log(error.message)
        }
    }

    onMounted(getPendingOrders)

    const getByStatus = async (event) => {
        event.preventDefault()

        if(selected.value) {
            try {
                await fetch(`http://127.0.0.1:3333/orders/status/${selected.value}`, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json'
                    }
                }).then((res) => {
                    res.json().then((orders) => {
                    clearScreen()
                    orders.map((order) => {
                        const name = order.customer.name
                        const status = order.status
                        order.blind.map((blind) => {
                            addRow(blind, status, name)
                        })
                    })
                })
                })
            } catch (error) {
                console.log(error.message)
            }  
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

    padding: 30px;

    overflow: scroll;
}
</style>