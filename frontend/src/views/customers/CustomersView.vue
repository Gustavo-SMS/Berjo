<template>
    <div class="wrapper">
        <div class="box">
            <div class="row">
                    <div class="col-2">
                        <label for="" class="form-label">Nome</label>
                    </div>
                    <div class="col-2">
                        <label for="" class="form-label">Email</label>
                    </div>
                    <div class="col-1">
                        <label for="" class="form-label">Telefone</label>
                    </div>
                    <div class="col-2">
                        <label for="" class="form-label">Rua</label>
                    </div>
                    <div class="col-1">
                        <label for="" class="form-label">Número</label>
                    </div>
                    <div class="col-2">
                        <label for="" class="form-label">Cidade</label>
                    </div>
                    <div class="col-1">
                        <label for="" class="form-label">Bairro</label>
                    </div>
                    <div class="col-1">
                        <label for="" class="form-label">CEP</label>
                    </div>
            </div>
            

        </div>
    </div>
</template>

<script setup>
import { createVNode, render } from 'vue';
import CustomerRow from '@/components/customer/CustomerRow.vue';

function addRow(customer) {
        const container = document.querySelector('div.box')
        const wrapper = document.createElement('div');
        container.appendChild(wrapper)

        const vNode = createVNode(CustomerRow, 
        {   
            id: customer.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            street: customer.address.street,
            house_number: customer.address.house_number,
            city: customer.address.city,
            district: customer.address.district,
            zip: customer.address.zip
        })

        render(vNode, wrapper)
    }

    fetch("http://127.0.0.1:3333/customers", {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                }
            }).then((res) => {
                res.json().then((customers) => {
                    customers.map((customer) => {
                        addRow(customer)
                    })
                })
            })
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
