<template>
    <form action="" class="row mb-2">
        <div class="col-2">
            <input v-if="isEditing" type="text" class="form-control" v-model="editableName" id="name" name="name">
            <p v-else>{{ name }}</p>
        </div>
        <div class="col-2">
            <input v-if="isEditing" type="email" class="form-control" v-model="editableEmail" id="email" name="email">
            <p v-else>{{ email }}</p>
        </div>
        <div class="col-1">
            <input v-if="isEditing" type="tel" class="form-control" v-model="editablePhone" id="phone" name="phone">
            <p v-else>{{ phone }}</p>
        </div>
        <div class="col-2">
            <input v-if="isEditing" type="text" class="form-control" v-model="editableStreet" id="street" name="street">
            <p v-else>{{ street }}</p>
        </div>
        <div class="col-1">
            <input v-if="isEditing" type="number" class="form-control" v-model="editableHouseNumber" id="house_number" name="house_number">
            <p v-else>{{ house_number }}</p>
        </div>
        <div class="col-2">
            <input v-if="isEditing" type="text" class="form-control" v-model="editableCity" id="city" name="city">
            <p v-else>{{ city }}</p>
        </div>
        <div class="col-1">
            <input v-if="isEditing" type="text" class="form-control" v-model="editableDistrict" id="district" name="district">
            <p v-else>{{ district }}</p>
        </div>
        <div class="col-1">
            <input v-if="isEditing" type="number" class="form-control" v-model="editableZip" id="zip" name="zip">
            <p v-else>{{ zip }}</p>
        </div>

        <button @click="changeToInput" type="button" class="btn btn-danger col-1 row justify-content-center">Editar</button>

        <button @click="submitUpdate" type="submit" class="btn col-1 row justify-content-center" :disabled="disabled">Enviar</button>

        <button @click="openDeleteModal" type="button" class="btn col-1 row justify-content-center">Excluir</button>
      </form>
      <Teleport to="body">
        <ConfirmationModal
          v-if="showModal"
          :show="showModal"
          message="Tem certeza que deseja excluir este cliente?"
          :onConfirm="deleteCustomer"
          @close="showModal = false"
        />
      </Teleport>
</template>
                        
<script setup>
import { ref } from 'vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'

const props = defineProps(['id', 'name', 'email', 'phone', 'street', 'house_number', 'city', 'district', 'zip', 'getCustomers'])

const showModal = ref(false)

const openDeleteModal = () => {
  showModal.value = true
}

const isEditing = ref(false)
let disabled = ref(true)

const changeToInput = () => {
    isEditing.value = !isEditing.value
    disabled.value = !disabled.value
}

const editableName = ref(props.name);
const editableEmail = ref(props.email);
const editablePhone = ref(props.phone);
const editableStreet = ref(props.street);
const editableHouseNumber = ref(props.house_number);
const editableCity = ref(props.city);
const editableDistrict = ref(props.district);
const editableZip = ref(props.zip);

const submitUpdate = async (event) => {
      event.preventDefault();

      const payload = {
        id: props.id,
        name: editableName.value,
        email: editableEmail.value,
        phone: editablePhone.value,
        street: editableStreet.value,
        house_number: editableHouseNumber.value,
        city: editableCity.value,
        district: editableDistrict.value,
        zip: editableZip.value,
      }

      try {
        const response = await fetch("http://127.0.0.1:3333/customers", {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          throw new Error('Falha ao enviar os dados')
        }

        const result = await response.json()
        console.log('Dados atualizados com sucesso!')
        props.getCustomers()
      } catch (err) {
        console.error('Erro ao enviar os dados:', err.message)
      }
    }

const deleteCustomer = async () => {
  try {
        const response = await fetch(`http://127.0.0.1:3333/customers/${props.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        })

        if (!response.ok) {
          throw new Error('Falha ao excluir cliente')
        }

        const result = await response.json()
        console.log('Cliente excluido com sucesso!')
        props.getCustomers()
      } catch (err) {
        console.error('Erro ao excluir cliente:', err.message)
      }
}

</script>

<style>
p {
    overflow: scroll;
}
</style>