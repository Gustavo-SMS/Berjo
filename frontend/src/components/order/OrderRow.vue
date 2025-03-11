<template>
    <form action="" class="row mb-2">
        <div class="col-1">
            <input v-if="isEditing" type="text" class="form-control" v-model="editableQuantity" id="quantity" name="quantity">
            <p v-else>{{ quantity }}</p>
        </div>
        <div class="col-2">
            <input v-if="isEditing" type="text" class="form-control" v-model="editableType" id="type" name="type">
            <p v-else>{{ type }}</p>
        </div>
        <div class="col-2">
            <input v-if="isEditing" type="text" class="form-control" v-model="editableCollection" id="collection" name="collection">
            <p v-else>{{ collection + ' ' + color }}</p>
        </div>
        <div class="col-1">
            <input v-if="isEditing" type="number" class="form-control" v-model="editableWidth" id="width" name="width">
            <p v-else>{{ width }}</p>
        </div>
        <div class="col-1">
            <input v-if="isEditing" type="number" class="form-control" v-model="editableHeight" id="height" name="height">
            <p v-else>{{ height }}</p>
        </div>
        <div class="col-1">
            <input v-if="isEditing" type="number" class="form-control" v-model="editableCommand_height" id="command_height" name="command_height">
            <p v-else>{{ command_height }}</p>
        </div>
        <div class="col-1">
            <input v-if="isEditing" type="text" class="form-control" v-model="editableModel" id="model" name="model">
            <p v-else>{{ model }}</p>
        </div>

        <!-- <button @click="changeToInput" type="button" class="btn btn-danger col-1 row justify-content-center">Editar</button>

        <button @click="submitUpdate" type="submit" class="btn col-1 row justify-content-center" :disabled="disabled">Enviar</button>

        <button @click="openDeleteModal" type="button" class="btn col-1 row justify-content-center">Excluir</button> -->
      </form>
      <Teleport to="body">
        <ConfirmationModal
          v-if="showModal"
          :show="showModal"
          message="Tem certeza que deseja excluir?"
          :onConfirm="deleteOrder"
          @close="showModal = false"
        />
      </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'

const props = defineProps(['id', 'name', 'quantity', 'type', 'collection', 'color', 'width', 'height', 'command_height', 'model', 'status', 'getByStatus'])

const showModal = ref(false)

const openDeleteModal = () => {
  showModal.value = true
}

const isEditing = ref(false)
const disabled = ref(true)

const changeToInput = () => {
    isEditing.value = !isEditing.value
    disabled.value = !disabled.value
}

const editableName = ref(props.name)
const editableQuantity = ref(props.quantity)
const editableType = ref(props.type)
const editableCollection = ref(props.collection)
const editableWidth = ref(props.width)
const editableHeight = ref(props.height)
const editableCommand_height = ref(props.command_height)
const editableModel = ref(props.model)
const editableStatus = ref(props.status)

const submitUpdate = async (event) => {
      event.preventDefault()

      const payload = {
        id: props.id,
        name: editableName.value,
        type: editableType.value,
        collection: editableCollection.value,
        width: editableWidth.value,
        height: editableHeight.value,
        command_height: editableCommand_height.value,
        model: editableModel.value,
        status: editableStatus.value,
      }

      try {
        const response = await fetch("http://127.0.0.1:3333/blinds", {
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
        console.log('Dados atualizados:', result)
        props.getByStatus()
      } catch (err) {
        console.error('Erro ao enviar os dados:', err.message)
      }
    }

const deleteOrder = async () => {
  try {
        const response = await fetch(`http://127.0.0.1:3333/orders/${props.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        })

        if (!response.ok) {
          throw new Error('Falha ao excluir persiana')
        }

        const result = await response.json()
        console.log('Cliente excluido:', result)
        props.getByStatus()
      } catch (err) {
        console.error('Erro ao excluir persiana:', err.message)
      }
}

</script>

<style>
p {
    overflow: scroll;
}
</style>