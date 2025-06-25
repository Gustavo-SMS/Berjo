<template>
  <div>
    <section class="hero-section text-center text-white d-flex">
      <div class="container d-flex flex-column justify-content-end align-items-center mb-5">
        <h1 class="display-4 fw-bold">Elegância e funcionalidade para seu ambiente</h1>
        <p class="lead">Persianas sob medida direto da fábrica</p>
        <button @click="scrollToSection('modelos')" class="btn btn-primary btn-lg mt-3">Ver Modelos</button>
      </div>
    </section>

    <section id="modelos" class="full-section d-flex align-items-center bg-white modelos-section">
      <div class="container">
        <h2 class="text-center mb-4">Modelos de Persianas</h2>
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          <div class="col" v-for="(modelo, index) in modelos" :key="index">
            <div class="card h-100 shadow-sm">
              <img :src="modelo.imagem" class="card-img-top" :alt="modelo.nome" loading="lazy">
              <div class="card-body">
                <h5 class="card-title">{{ modelo.nome }}</h5>
                <p class="card-text">{{ modelo.descricao }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="full-section d-flex align-items-center bg-light">
      <div class="container text-center">
        <h2>Sobre Nós</h2>
        <p class="mt-3">Somos uma fábrica especializada em persianas sob medida, oferecendo soluções elegantes e funcionais para ambientes residenciais e comerciais. Atuamos com excelência, priorizando qualidade, agilidade e atendimento personalizado.</p>
      </div>
    </section>

    <footer class="bg-dark text-white text-center py-4">
      <div class="container">
        <p class="mb-0">&copy; {{ new Date().getFullYear() }} Fábrica de Persianas. Todos os direitos reservados.</p>
      </div>
    </footer>

    <button v-show="showScrollTop" class="btn btn-primary scroll-top" @click="scrollToTop">
      <i class="bi bi-arrow-up"></i>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const verticalImg = new URL('@/assets/img/persiana-vertical.jpg', import.meta.url).href
const horizontalImg = new URL('@/assets/img/persiana-horizontal.webp', import.meta.url).href
const roloImg = new URL('@/assets/img/persiana-rolo.jpg', import.meta.url).href
const romanaImg = new URL('@/assets/img/persiana-romana.webp', import.meta.url).href

const modelos = [
  {
    nome: 'Persiana Vertical',
    descricao: 'Ideal para grandes vãos, com visual elegante e moderno.',
    imagem: verticalImg
  },
  {
    nome: 'Persiana Horizontal',
    descricao: 'Controle eficiente de luz e ótima ventilação.',
    imagem: horizontalImg
  },
  {
    nome: 'Persiana Rolô',
    descricao: 'Prática, minimalista e muito versátil.',
    imagem: roloImg
  },
  {
    nome: 'Persiana Romana',
    descricao: 'Toque sofisticado e aconchegante ao ambiente.',
    imagem: romanaImg
  }
]

const showScrollTop = ref(false)

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const scrollToSection = (id) => {
  const el = document.getElementById(id)
  if (el) {
    const y = el.getBoundingClientRect().top + window.pageYOffset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}
</script>

<style scoped>
.hero-section {
  background-image: url('@/assets/img/banner-homepage.png');
  background-size: cover;
  background-position: center;
  min-height: calc(100vh - 63px);
  padding-top: 70px;
}

.full-section {
  height: 100vh;
  scroll-margin-top: 90px;
  padding-top: 70px;
}

.scroll-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  border-radius: 50%;
  padding: 0.5rem 0.7rem;
  transition: opacity 0.3s;
}

.card-img-top {
  max-width: 100%;
  height: auto;
  display: block;
}

section {
  overflow-x: hidden;
}

html, body {
  max-width: 100vw;
  overflow-x: hidden;
}
</style>
