<template>
    <form @submit.prevent="submitUpdate" class="row mb-2">
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
        <div class="col-1">
            <input v-if="isEditing && authStore.userRole === 'ADMIN'" type="number" class="form-control" v-model="editableDebt" id="debt" name="debt">
            <p v-else>{{ debt }}</p>
        </div>

        <button @click="changeToInput" type="button" class="btn btn-danger col-1">Editar</button>

        <button type="submit" class="btn btn-primary col-1" :disabled="disabled">Enviar</button>

        <button v-if="authStore.userRole === 'ADMIN'" @click="openDeleteModal" type="button" class="btn btn-warning col-1">Excluir</button>
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
import ConfirmationModal from '@/components/modal/ConfirmationModal.vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { useAuthStore } from '@/stores/authStore'
import { fetchWithAuth } from '@/utils/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const props = defineProps(['id', 'name', 'email', 'phone', 'street', 'house_number', 'city', 'district', 'zip', 'debt', 'getCustomers'])

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
const editableDebt = ref(props.debt);

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
        debt: editableDebt.value,
      }

      try {
        const response = await fetchWithAuth("http://127.0.0.1:3333/customers", {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }, authStore, router)

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Erro ao atualizar cliente')
        }

        notificationStore.addNotification('Cliente atualizado com sucesso!', 'success')

        props.getCustomers()
        changeToInput()
      } catch (error) {
        console.error('Erro ao enviar os dados:', error.message)
        notificationStore.addNotification(error.message, 'error')
      }
    }

const deleteCustomer = async () => {
  try {
        const response = await fetchWithAuth(`http://127.0.0.1:3333/customers/${props.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        },authStore, router)

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Erro ao excluir cliente')
        }

        notificationStore.addNotification('Cliente excluído com sucesso', 'success')
        
        props.getCustomers()
      } catch (error) {
        console.error('Erro ao excluir cliente:', error.message)
        notificationStore.addNotification(error.message, 'error')
      }
}

</script>

<style scoped>
p {
  overflow: auto;
  margin: 0;
}
</style>