<template>
    <div class="wrapper">
        <div class="box">
            <form>
                <label for="" class="form-label">Cliente</label>
                <SelectCustomers @selectedOption="selectedCustomerID" />

                <div class="row">
                    <div class="col-1">
                        <label for="" class="form-label">Quantidade</label>
                    </div>
                    <div class="col-2">
                        <label for="" class="form-label">Tipo</label>
                    </div>
                    <div class="col-4">
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
                </div>
                
                    <OrderRow />
                
                <button @click="submitForm" type="submit" class="btn btn-primary w-100 py-1">Enviar</button>
            </form>
        </div>
    </div>
</template>

<script setup>
import SelectCustomers from '../components/formCreateOrder/SelectCustomers.vue';
import OrderRow from '../components/formCreateOrder/OrderRow.vue'
import { ref } from 'vue';

    let customerId = ref('')

    function selectedCustomerID(event, arrayNomes) {
        customerId = arrayNomes[event.target.selectedIndex].id
    }

    function submitForm(event) {
        event.preventDefault()

        const form = document.querySelector('form')
        const formData = new FormData(form)
        const data = Object.fromEntries(formData)
        data.customer = customerId

        fetch('http://127.0.0.1:3333/orders', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(data => console.log(data))
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