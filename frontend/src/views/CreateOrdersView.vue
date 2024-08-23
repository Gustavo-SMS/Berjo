<template>
    <div class="wrapper">
        <div class="box">
            <form action="">
                <label for="" class="form-label">Cliente</label>
                <SelectCustomers />
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
                
                <button type="reset" class="btn btn-primary w-100 py-1">Enviar</button>
            </form>
        </div>
    </div>
</template>

<script setup>
import SelectCustomers from '../components/formCreateOrder/SelectCustomers.vue';
import OrderRow from '../components/formCreateOrder/OrderRow.vue'

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