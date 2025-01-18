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
    fetch("http://127.0.0.1:3333/customers", {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                }
            }).then((res) => {
                res.json().then((customers) => {
                    customers.map((customer) => {
                        document.querySelector('.box').innerHTML += `<div class='row'> 
                            <p class="col-2">${customer.name}</p>
                            <p class="col-2">${customer.email}</p>
                            <p class="col-1">${customer.phone}</p>
                            <p class="col-2">${customer.address.street}</p>
                            <p class="col-1">${customer.address.house_number}</p>
                            <p class="col-2">${customer.address.city}</p>
                            <p class="col-1">${customer.address.district}</p>
                            <p class="col-1">${customer.address.zip}</p>
                            </div>`
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
</style>
