<template>
  <div class="home-page">
  <!-- HERO -->
    <section id="inicio" class="hero-section">
      <div class="hero-overlay"></div>
      <div class="container hero-content">

        <div class="hero-brand-wrapper">
          <span class="hero-brand">
            BERJO
          </span>

          <span class="hero-subtitle">
            Persianas Sob Medida
          </span>
        </div>

        <h1>
          Elegância e Funcionalidade
          para seu Ambiente
        </h1>

        <p>
          Soluções personalizadas para residências,
          escritórios e ambientes comerciais.
        </p>

        <div class="hero-actions">
          <button
            class="btn btn-primary btn-lg"
            @click="scrollToSection('modelos')"
          >
            Ver Modelos
          </button>
        </div>
      </div>
      <RouterLink v-if="!authStore.userRole" to="/login" class="btn btn-primary login-btn">Entrar</RouterLink>
    </section>

  <!-- DIFERENCIAIS -->
    <section id="diferenciais" class="section-dark">

      <div class="container">

        <h2 class="section-title">
          Por que escolher nossa empresa?
        </h2>

        <div class="row g-4 mt-4">

          <div class="col-md-6 col-lg-3">
            <div class="feature-card">
              <i class="bi bi-building"></i>
              <h4>Fabricação Própria</h4>
              <p>
                Produção sob medida com controle de qualidade.
              </p>
            </div>
          </div>

          <div class="col-md-6 col-lg-3">
            <div class="feature-card">
              <i class="bi bi-person-check"></i>
              <h4>Atendimento Especializado</h4>
              <p>
                Acompanhamento do início ao fim.
              </p>
            </div>
          </div>

          <div class="col-md-6 col-lg-3">
            <div class="feature-card">
              <i class="bi bi-truck"></i>
              <h4>Entrega Ágil</h4>
              <p>
                Prazos reduzidos e instalação profissional.
              </p>
            </div>
          </div>

          <div class="col-md-6 col-lg-3">
            <div class="feature-card">
              <i class="bi bi-shield-check"></i>
              <h4>Garantia</h4>
              <p>
                Produtos duráveis e suporte pós-venda.
              </p>
            </div>
          </div>

        </div>

      </div>

    </section>

  <!-- MODELOS -->
    <section id="modelos" class="section-light">
      <div class="container">
        <h2 class="section-title">
          Modelos de Persianas
        </h2>

        <p class="section-subtitle">
          Conheça algumas das opções disponíveis para transformar seu ambiente.
        </p>

        <div class="row g-5 mt-3">

          <div
            class="col-lg-6"
            v-for="(modelo, index) in modelos"
            :key="index"
          >
            <div class="modelo-card">
              <div class="modelo-image-wrapper">
                <img
                  :src="modelo.imagem"
                  :alt="modelo.nome"
                >
              </div>

              <div class="modelo-body">
                <h3>
                  {{ modelo.nome }}
                </h3>

                <p>
                  {{ modelo.descricao }}
                </p>

                <ul class="vantagens-list">

                  <li
                    v-for="vantagem in modelo.vantagens"
                    :key="vantagem"
                  >
                    <i class="bi bi-check-circle-fill"></i>
                    {{ vantagem }}
                  </li>

                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>


  <!-- SOBRE -->
    <section id="sobre" class="section-dark about-section">
      <div class="container text-center">
        <h2 class="section-title">
          Sobre Nós
        </h2>

        <p class="about-text">
          Somos especialistas em persianas sob medida,
          oferecendo soluções elegantes e funcionais
          para ambientes residenciais e comerciais.
          Nosso compromisso é entregar qualidade,
          agilidade e atendimento personalizado.
        </p>

      </div>
    </section>

  <!-- FOOTER -->
    <footer class="footer-home">
      <div class="container">
        <p>
          © {{ new Date().getFullYear() }}
          Berjo Persianas.
          Todos os direitos reservados.
        </p>
      </div>
    </footer>

    <button v-show="showScrollTop" class="btn btn-primary scroll-top" @click="scrollToTop">
      <i class="bi bi-arrow-up"></i>
    </button>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { ref, onMounted, onUnmounted } from 'vue'

const authStore = useAuthStore()

const verticalImg = new URL('@/assets/img/persiana-vertical.jpg', import.meta.url).href
const horizontalImg = new URL('@/assets/img/persiana-horizontal.webp', import.meta.url).href
const roloImg = new URL('@/assets/img/persiana-rolo.jpg', import.meta.url).href
const romanaImg = new URL('@/assets/img/persiana-romana.webp', import.meta.url).href

const modelos = [
{
nome: 'Persiana Vertical',
descricao: 'Ideal para grandes vãos, escritórios e ambientes comerciais.',
imagem: verticalImg,
vantagens: [
'Controle eficiente da luminosidade',
'Fácil manutenção',
'Fabricada sob medida'
]
},
{
nome: 'Persiana Horizontal',
descricao: 'Versátil e elegante para diversos ambientes.',
imagem: horizontalImg,
vantagens: [
'Excelente ventilação',
'Controle de luz preciso',
'Visual moderno'
]
},
{
nome: 'Persiana Rolô',
descricao: 'Design minimalista e grande versatilidade.',
imagem: roloImg,
vantagens: [
'Visual clean',
'Praticidade no dia a dia',
'Diversas opções de tecidos'
]
},
{
nome: 'Persiana Romana',
descricao: 'Sofisticação e aconchego para qualquer ambiente.',
imagem: romanaImg,
vantagens: [
'Acabamento elegante',
'Conforto visual',
'Excelente decoração'
]
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
.home-page{
    background: var(--bg-page);
    color: var(--text-primary);
}

.hero-section {
  position: relative;
  min-height: 100vh;
  background-image: url('@/assets/img/banner-homepage.png');
  background-size: cover;
  background-position: center;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: var(--overlay);
}

.hero-content {
  position: relative;
  z-index: 2;
  min-height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center;

  color:var(--bg-page);
}

.hero-brand-wrapper {
  margin-bottom: 1.5rem;
}

.hero-brand {
  display: block;

  font-size: 5rem;
  font-weight: 800;
  line-height: 1;

  color: var(--bg-page);
}

.hero-subtitle {
  display: inline-block;

  margin-top: .5rem;
  padding: .35rem .9rem;

  background: var(--bg-hover);
  border:1px solid var(--border-primary);

  border-radius: 999px;

  color: var(--color-primary);
}

.hero-content h1 {
  font-size: clamp(2.8rem, 5vw, 4.5rem);
  max-width: 700px;
  font-weight: 700;
}

.hero-content p {
  max-width: 600px;
  margin-top: 1rem;
  font-size: 1.2rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.section-dark {
  background:var(--bg-page);
  color: var(--text-primary);
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 6rem 0;
}

.section-light {
  background: var(--bg-surface);
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 6rem 0;
}

.section-light,
.section-dark {
  position: relative;
}

.section-light::before,
.section-dark::before {
  content: '';

  position: absolute;
  top: 0;
  left: 50%;

  transform: translateX(-50%);

  width: 120px;
  height: 2px;

  background: var(--text-primary);

  opacity: .4;
}

.section-title {
  color: var(--text-primary);
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
}

.section-title::after {
  content: '';
  display: block;

  width: 80px;
  height: 3px;

  background: var(--color-primary);

  margin: 1rem auto 0;
}

.feature-card,
.modelo-card,
.testimonial-card {
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  transition: .3s;
}

.feature-card{
  background:var(--bg-card);
  border:1px solid var(--border-color);
  border-radius:var(--radius);
  box-shadow:var(--shadow-card);
  padding:2rem;
  text-align:center;
  transition:var(--transition-base);
}

.feature-card i {
  font-size: 2rem;
  color: var(--gold);
}

.feature-card:hover,
.modelo-card:hover{
  transform:translateY(-6px);
  box-shadow:var(--shadow-hover);
}

.feature-card h4{
    color:var(--text-primary);
}

.feature-card p{
    color:var(--text-secondary);
}

.feature-card i{
    color:var(--color-primary);
}

.modelo-card img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.about-text {
  max-width: 900px;
  margin: auto;
  font-size: 1.1rem;
  color:var(--text-secondary);
}

.footer-home {
  background:var(--bg-sidebar);
  border-top:1px solid var(--border-color);
  color:var(--text-secondary);
  text-align: center;
  padding: 1.5rem;
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2.5rem;
  }

  .hero-actions {
    flex-direction: column;
  }

}

.section-subtitle {
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
  color: var(--text-secondary);
}

.modelo-card{
  background:var(--bg-card);
  border:1px solid var(--border-color);
  border-radius:var(--radius-lg);
  box-shadow:var(--shadow-card);
  overflow:hidden;
  transition:var(--transition-base);
}

.modelo-card:hover{
  transform:translateY(-6px);
  border-color:var(--border-primary);
  box-shadow:var(--shadow-hover);
}

.modelo-image-wrapper {
  position: relative;
  overflow: hidden;
}

.modelo-image-wrapper img {
  width: 100%;
  height: 380px;
  object-fit: cover;
  transition: transform .5s ease;
}

.modelo-card:hover img {
  transform: scale(1.08);
}

.modelo-overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;

  padding: 1rem;

  background: linear-gradient(
  transparent,
  rgba(0,0,0,.85)
  );

  color: white;
  font-weight: 600;
  font-size: 1.2rem;
}

.modelo-body {
  padding: 1.75rem;
}

.modelo-body h3 {
  margin-bottom: 1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.modelo-body p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.vantagens-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.vantagens-list li {
  display: flex;
  align-items: center;
  gap: .75rem;

  margin-bottom: .75rem;

  font-size: .95rem;
  color: var(--text-secondary);
}

.vantagens-list i {
  color: var(--color-success);
  font-size: 1rem;
}

@media (max-width: 992px) {
  .modelo-image-wrapper img {
    height: 300px;
  }
}

.about-section {
  min-height: auto;
  padding: 8rem 0;
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

.login-btn {
  position: fixed;
  top: 18px;
  right: 18px;
  z-index: 1100;
  padding: 0.45rem 0.75rem;
}
</style>