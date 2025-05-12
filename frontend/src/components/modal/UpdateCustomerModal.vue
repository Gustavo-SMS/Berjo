<template>
  <div class="modal fade" ref="customerModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">

            <div class="form-wrapper shadow-sm">
                <form id="modalForm" @submit.prevent="handleUpdateCustomer" class="row g-4">
                    <h3 class="form-title">Editar cliente</h3>

                    <div class="col-12 col-md-6">
                        <label for="name" class="form-label">Nome *</label>
                        <input v-model="editableName" type="text" name="name" id="name" class="form-control" required>
                    </div>

                    <div class="col-12 col-md-6">
                        <label for="email" class="form-label">Email *</label>
                        <input v-model="editableEmail" type="email" name="email" id="email" class="form-control" required>
                    </div>

                    <div class="col-12 col-md-6">
                        <label for="cpf" class="form-label">CPF</label>
                        <input type="radio" id="cpf" name="check" value="cpf" v-model="selectedRadio" @change="handleDocTypeChange">
                        <label for="cnpj" class="form-label">CNPJ</label>
                        <input type="radio" id="cnpj" name="check" value="cnpj" v-model="selectedRadio" @change="handleDocTypeChange">
                        
                        <input v-model="editableDocNumber" v-mask="currentMask" type="text" name="docNumber" id="docNumber" class="form-control" required>
                    </div>

                    <div class="col-12 col-md-3">
                        <label for="phone" class="form-label">Telefone *</label>
                        <input v-model="editablePhone" v-mask="['(##) #####-####', '(##) ####-####']" type="tel" name="phone" id="phone" maxlength="15" class="form-control" required>
                    </div>

                    <div class="col-12 col-md-3">
                        <label for="zip" class="form-label">CEP *</label>
                        <input v-model="editableZip" v-mask="'#####-###'" type="text" name="zip" id="zip" class="form-control" maxlength="9" @focusout="searchZip" required>
                    </div>

                    <div class="col-12 col-md-6">
                        <label for="street" class="form-label">Logradouro *</label>
                        <input v-model="editableStreet" type="text" name="street" id="street" class="form-control" required readonly>
                    </div>

                    <div class="col-6 col-md-2">
                        <label for="house_number" class="form-label">Número</label>
                        <input v-model="editableHouseNumber" type="text" name="house_number" id="house_number" class="form-control">
                    </div>

                    <div class="col-6 col-md-4">
                        <label for="complement" class="form-label">Complemento</label>
                        <input v-model="editableComplement" type="text" name="complement" id="complement" class="form-control">
                    </div>

                    <div class="col-12 col-md-6">
                        <label for="city" class="form-label">Cidade *</label>
                        <input v-model="editableCity" type="text" name="city" id="city" class="form-control" required readonly>
                    </div>

                    <div class="col-6 col-md-4">
                        <label for="district" class="form-label">Bairro *</label>
                        <input v-model="editableDistrict" type="text" name="district" id="district" class="form-control" required readonly>
                    </div>

                    <div class="col-6 col-md-2">
                        <label for="state" class="form-label">UF *</label>
                        <input v-model="editableState" type="text" name="state" id="state" class="form-control" required readonly>
                    </div>

                    <div v-if="authStore.userRole === 'ADMIN'" class="col-6 col-md-3">
                        <label for="debt" class="form-label">Dívida</label>
                        <input v-model="editableDebt" type="number" name="debt" id="debt" class="form-control" min="0" step="0.01" required>
                    </div>
            
                    <div class="col-12">
                        <button type="submit" class="btn btn-primary w-100">Salvar alterações</button>
                        <button type="button" class="btn btn-secondary w-100" data-bs-dismiss="modal">Cancelar</button>
                    </div>
                </form>
            </div>
        
      </div>
    </div>
  </div>
</template>
 
<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { fetchWithAuth } from '@/utils/api'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const notificationStore = useNotificationStore()

const props = defineProps(['customer'])

const editableName = ref('')
const editableEmail = ref('')
const editableDocNumber = ref('')
const editablePhone = ref('')
const editableStreet = ref('')
const editableHouseNumber = ref('')
const editableComplement = ref('')
const editableCity = ref('')
const editableDistrict = ref('')
const editableState = ref('')
const editableZip = ref('')
const editableDebt = ref('')

const selectedRadio = ref('')

const handleUpdateCustomer = async () => {
    const data = {
        id: props.customer.id,
        name: editableName.value,
        email: editableEmail.value,
        docNumber: unmask(editableDocNumber.value),
        phone: unmask(editablePhone.value),
        zip: unmask(editableZip.value),
        street: editableStreet.value,
        house_number: editableHouseNumber.value,
        complement: editableComplement.value,
        city: editableCity.value,
        district: editableDistrict.value,
        state: editableState.value,
        debt: editableDebt.value
    }

    try {
        const response = await fetchWithAuth("http://127.0.0.1:3333/customers", {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }, authStore, router)

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Erro ao atualizar cliente')
        }

        notificationStore.addNotification('Cliente atualizado com sucesso!', 'success')
        resetFields()
        hideModal()
        props.customer.getCustomers()
    } catch (error) {
        console.error('Erro ao enviar os dados:', error.message)
        notificationStore.addNotification(error.message, 'error')
    }
}

const searchZip = async (event) => {
    event.preventDefault()

    const validatedZip = validateZip(editableZip.value)

    try {
        const response = await fetch(`https://viacep.com.br/ws/${validatedZip}/json/`)
        
        const data = await response.json()

        if(data.erro === 'true') {
            alert('CEP não encontrado')
        }

        editableStreet.value = data.logradouro
        editableDistrict.value = data.bairro
        editableCity.value = data.localidade
        editableState.value = data.uf
    } catch (error) {
        console.log(error.message)
    }
}

const validateZip = (zip) => {
    const unmaskedZip = unmask(zip)
    
    if (unmaskedZip != "") {
        const zipRegex = /^[0-9]{8}$/

        if(zipRegex.test(unmaskedZip)) {
            editableStreet.value = "..."
            editableDistrict.value = "..."
            editableCity.value = "..."
            editableState.value = "..."

            return unmaskedZip
        } else {
            editableStreet.value = ""
            editableDistrict.value = ""
            editableCity.value = ""
            editableState.value = ""
            alert("Formato de CEP inválido.")
        }
    } else {
        editableStreet.value = ""
        editableDistrict.value = ""
        editableCity.value = ""
        editableState.value = ""
    }
}
  
const customerModal = ref(null)
let modalInstance = null
  
onMounted(() => {
  if (customerModal.value) {
    modalInstance = new bootstrap.Modal(customerModal.value)
  }
})

const showModal = () => {
  if (modalInstance) modalInstance.show()
}

const hideModal = () => {
  if (modalInstance) modalInstance.hide()
}

const resetFields = () => {
    editableName.value = ''
    editableEmail.value = ''
    editableDocNumber.value = ''
    editablePhone.value = ''
    editableStreet.value = ''
    editableHouseNumber.value = ''
    editableComplement.value = ''
    editableCity.value = ''
    editableDistrict.value = ''
    editableState.value = ''
    editableZip.value = ''
    editableDebt.value = ''
}

function unmask(value) {
    return value.replace(/\D/g, '')
}

const currentMask = computed(() => {
  return selectedRadio.value === 'cpf' ? '###.###.###-##' : '##.###.###/####-##'
})

const handleDocTypeChange = (event) => {
  selectedRadio.value = event.target.value
  editableDocNumber.value = ''
}

watch(() => props.customer, (newCustomer) => {
  if (!newCustomer || typeof newCustomer !== 'object') return
  
  editableName.value = newCustomer.name || ''
  editableEmail.value = newCustomer.email || ''
  editableDocNumber.value = newCustomer.docNumber || ''
  editablePhone.value = newCustomer.phone || ''
  editableStreet.value = newCustomer.street || ''
  editableHouseNumber.value = newCustomer.house_number || ''
  editableComplement.value = newCustomer.complement || ''
  editableCity.value = newCustomer.city || ''
  editableDistrict.value = newCustomer.district || ''
  editableState.value = newCustomer.state || ''
  editableZip.value = newCustomer.zip || ''
  editableDebt.value = newCustomer.debt || ''
  selectedRadio.value = (newCustomer.docNumber && newCustomer.docNumber.length === 11) ? 'cpf' : 'cnpj'
}, { immediate: true })

defineExpose({ showModal })
</script>

<style scoped>
.form-wrapper {
  padding: 1rem 1rem;
}

.form-title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--color-text);
}
</style>