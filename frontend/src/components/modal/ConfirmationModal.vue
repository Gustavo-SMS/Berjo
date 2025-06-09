<template>
    <div class="modal-overlay" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <p class="fs-5 fw-bold text-dark mb-3">{{ message }}</p>
        <div class="modal-actions d-flex justify-content-end gap-2 mt-4">
          <button @click="confirmAction" class="btn btn-primary">Confirmar</button>
          <button @click="closeModal" class="btn btn-danger">Cancelar</button>
        </div>
      </div>
    </div>
</template>

  <script setup>
  
  const props = defineProps({
    show: Boolean,
    message: String
  })
  
  const emit = defineEmits(['close', 'confirm'])
  
  const confirmAction = () => {
    emit('confirm')
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
  width: 90%;
  max-width: 400px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.3);
  text-align: center;
}
</style>