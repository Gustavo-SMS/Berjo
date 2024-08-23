<template>
    <div class="wrapper">
        <div class="box">
            <select v-model="selected" name="selectStatus" id="selectStatus">
                <option value="">--</option>
                <option value="Em espera">Em espera</option>
                <option value="Em produção">Em produção</option>
                <option value="Concluido">Concluido</option>
            </select>
            <button @click="changeFilter">Filtrar</button>
            
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

            <div class="rows">
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

    fetch("http://127.0.0.1:3333/orders", {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        }).then((res) => {
            res.json().then((orders) => {
                orders.map((order) => {
                    document.querySelector('.rows').innerHTML += `<div class='row'> 
                        <p class="col-2">${order.customer.name}</p>
                        <p class="col-1">${order.quantity}</p>
                        <p class="col-1">${order.type}</p>
                        <p class="col-2">${order.color}</p>
                        <p class="col-1">${order.width}</p>
                        <p class="col-1">${order.height}</p>
                        <p class="col-1">${order.command_height}</p>
                        <p class="col-1">${order.model}</p>
                        <p class="col-2">${order.status}</p>
                        </div>`
                })
            })
        })

    const selected = ref()

    async function changeFilter() {
        await fetch(`http://127.0.0.1:3333/orders/status/${selected.value}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        }).then((res) => {
            res.json().then((orders) => {
                document.querySelector('.rows').innerHTML = ''
                orders.map((order) => {
                    document.querySelector('.rows').innerHTML += `<div class='row' id='row'> 
                        <p class="col-2">${order.customer.name}</p>
                        <p class="col-1">${order.quantity}</p>
                        <p class="col-1">${order.type}</p>
                        <p class="col-2">${order.color}</p>
                        <p class="col-1">${order.width}</p>
                        <p class="col-1">${order.height}</p>
                        <p class="col-1">${order.command_height}</p>
                        <p class="col-1">${order.model}</p>
                        <p class="col-2">${order.status}</p>
                        </div>`
                })
            })
        })
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