<template>
    
    <Banner />

</template>

<script setup>
import Banner from '../components/Banner.vue'
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  document.body.classList.add('no-scroll')
})
onUnmounted(() => {
  document.body.classList.remove('no-scroll')
})
</script>

<style>

</style>