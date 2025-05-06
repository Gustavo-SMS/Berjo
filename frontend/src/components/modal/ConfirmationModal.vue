 <template>
    <div class="modal-overlay" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <p>{{ message }}</p>
        <button @click="confirmAction">Confirmar</button>
        <button @click="closeModal">Cancelar</button>
      </div>
    </div>
  </template>

  <script setup>
  
  const props = defineProps({
    show: Boolean,
    message: String,
    onConfirm: Function
  })
  
  const emit = defineEmits(['close'])
  
  const confirmAction = () => {
    props.onConfirm()
    emit('close')
  }
  
  const closeModal = () => {
    emit('close')
  }
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1050;
  }

  .modal-content {
    width: 30%;
    height: auto;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.3);
    text-align: center;
  }
  
  .modal-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
  }
  
  button {
    padding: 8px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:first-child {
    background: #d9534f;
    color: white;
  }
  
  button:last-child {
    background: #5bc0de;
    color: white;
  }
  </style>