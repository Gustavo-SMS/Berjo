<template>
    <div class="container">
        <div class="form-wrapper shadow-sm">
            <form @submit.prevent="submitForm" class="row g-4">
                <div class="col-12 col-md-6">
                    <label for="name" class="form-label">Nome *</label>
                    <input v-model="name" type="text" name="name" id="name" class="form-control" required>
                </div>

                <div class="col-12 col-md-6">
                    <label for="email" class="form-label">Email *</label>
                    <input v-model="email" type="email" name="email" id="email" class="form-control" required>
                </div>

                <div class="col-12 col-md-6">
                    <label for="cpf" class="form-label">CPF</label>
                    <input type="radio" id="cpf" name="check" value="cpf" v-model="selectedRadio">
                    <label for="cnpj" class="form-label">CNPJ</label>
                    <input type="radio" id="cnpj" name="check" value="cnpj" v-model="selectedRadio">
                    
                    <input v-model="docNumber" v-mask="currentMask" type="text" name="docNumber" id="docNumber" class="form-control" required>
                </div>

                <div class="col-12 col-md-3">
                    <label for="phone" class="form-label">Telefone *</label>
                    <input v-model="phone" v-mask="['(##) #####-####', '(##) ####-####']" type="tel" name="phone" id="phone" maxlength="15" class="form-control" required>
                </div>

                <div class="col-12 col-md-3">
                    <label for="zip" class="form-label">CEP *</label>
                    <input v-model="zip" v-mask="'#####-###'" type="text" name="zip" id="zip" class="form-control" maxlength="9" @focusout="searchZip" required>
                </div>

                <div class="col-12 col-md-6">
                    <label for="street" class="form-label">Logradouro *</label>
                    <input v-model="street" type="text" name="street" id="street" class="form-control" required readonly>
                </div>

                <div class="col-6 col-md-2">
                    <label for="house_number" class="form-label">Número</label>
                    <input v-model="houseNumber" type="text" name="house_number" id="house_number" class="form-control">
                </div>

                <div class="col-6 col-md-4">
                    <label for="complement" class="form-label">Complemento</label>
                    <input v-model="complement" type="text" name="complement" id="complement" class="form-control">
                </div>

                <div class="col-12 col-md-6">
                    <label for="city" class="form-label">Cidade *</label>
                    <input v-model="city" type="text" name="city" id="city" class="form-control" required readonly>
                </div>

                <div class="col-6 col-md-4">
                    <label for="district" class="form-label">Bairro *</label>
                    <input v-model="district" type="text" name="district" id="district" class="form-control" required readonly>
                </div>

                <div class="col-6 col-md-2">
                    <label for="state" class="form-label">UF *</label>
                    <input v-model="state" type="text" name="state" id="state" class="form-control" required readonly>
                </div>
        
                <div class="col-12">
                    <button type="submit" class="btn btn-primary w-100">Cadastrar</button>
                </div>
            </form>
        </div>
    </div>


    <ConfirmationModal
          v-if="showModal"
          :show="showModal"
          message="Deseja cadastrar um usuário para este cliente?"
          :onConfirm="registerUser"
          :onCancel="changeView"
        />
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { fetchWithAuth } from '@/utils/api'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import ConfirmationModal from '@/components/modal/ConfirmationModal.vue'

const authStore = useAuthStore()
const router = useRouter()
const notificationStore = useNotificationStore()

const name = ref('')
const email = ref('')
const docNumber = ref('')
const phone = ref('')
const zip = ref('')
const street = ref('')
const houseNumber = ref('')
const complement = ref('')
const district = ref('')
const city = ref('')
const state = ref('')

const selectedRadio = ref('cpf')

const showModal = ref(false)

const openRegisterModal = () => {
  showModal.value = true
}

const changeView = () => {
    showModal.value = false
    router.push('/customers')
}

const registerUser = () => {
    router.push('/register')
}

const submitForm = async () => {
    const data = {
        name: name.value,
        email: email.value,
        docNumber: unmask(docNumber.value),
        phone: unmask(phone.value),
        zip: unmask(zip.value),
        street: street.value,
        house_number: houseNumber.value,
        complement: complement.value,
        city: city.value,
        district: district.value,
        state: state.value,
    }

    try {
        const response = await fetchWithAuth('http://127.0.0.1:3333/customers', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
        }, authStore, router)

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Erro ao cadastrar cliente')
        }

        notificationStore.addNotification('Cliente cadastrado com sucesso!', 'success')
        openRegisterModal()
    } catch (error) {
        console.log(error.message)
        notificationStore.addNotification(error.message, 'error')
    }
}

const searchZip = async (event) => {
    event.preventDefault()

    const validatedZip = validateZip(zip.value)

    try {
        const response = await fetch(`https://viacep.com.br/ws/${validatedZip}/json/`)
        
        const data = await response.json()

        if(data.erro === 'true') {
            alert('CEP não encontrado')
        }

        street.value = data.logradouro
        district.value = data.bairro
        city.value = data.localidade
        state.value = data.uf

    } catch (error) {
        console.log(error.message)
    }
}

const validateZip = (zip) => {
    const unmaskedZip = unmask(zip)
    
    if (unmaskedZip != "") {
        const zipRegex = /^[0-9]{8}$/

        if(zipRegex.test(unmaskedZip)) {
            street.value = "..."
            district.value = "..."
            city.value = "..."
            state.value = "..."

            return unmaskedZip
        } else {
            street.value = ""
            district.value = ""
            city.value = ""
            state.value = ""
            alert("Formato de CEP inválido.")
        }
    } else {
        street.value = ""
        district.value = ""
        city.value = ""
        state.value = ""
    }
}

function unmask(value) {
    return value.replace(/\D/g, '')
}

const currentMask = computed(() => {
  return selectedRadio.value === 'cpf' ? '###.###.###-##' : '##.###.###/####-##'
})

watch(selectedRadio, () => {
    docNumber.value = ''
})
</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;
}

.form-wrapper {
  background-color: var(--color-surface);
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 800px;
}

.btn-primary {
  background-color: var(--color-primary);
  color: #fff;
  padding: 0.75rem;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
}

#cpf {
    margin-right: 5px;
}
</style>