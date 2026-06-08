<template>
  <div>
    <section class="page-banner">
      <h1>⚔️ Bem-vindo, {{ authStore.nomeUsuario }}!</h1>
      <p>{{ authStore.isModerador ? 'Você tem acesso total ao sistema.' : 'Você está no modo visitante — somente visualização.' }}</p>
    </section>

    <div class="container">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🗡️</div>
          <div class="stat-info">
            <div class="stat-num">{{ totalHerois }}</div>
            <div class="stat-label">Heróis cadastrados</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🎮</div>
          <div class="stat-info">
            <div class="stat-num">{{ totalFuncoes }}</div>
            <div class="stat-label">Funções disponíveis</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" :class="authStore.isModerador ? 'icon-mod' : 'icon-vis'">
            {{ authStore.isModerador ? '🛡️' : '👁️' }}
          </div>
          <div class="stat-info">
            <div class="stat-num">{{ authStore.isModerador ? 'Moderador' : 'Visitante' }}</div>
            <div class="stat-label">Seu cargo</div>
          </div>
        </div>
      </div>

      <div class="quick-links">
        <h2>Acesso Rápido</h2>
        <div class="links-grid">
          <router-link to="/herois" class="quick-card">
            <span>🗡️</span>
            <strong>Ver Heróis</strong>
            <p>{{ authStore.isModerador ? 'Gerenciar heróis' : 'Visualizar heróis' }}</p>
          </router-link>
          <router-link v-if="authStore.isModerador" to="/funcoes" class="quick-card">
            <span>🎮</span>
            <strong>Ver Funções</strong>
            <p>Gerenciar funções</p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { getHerois, getFuncoes } from '../services/api'

const authStore    = useAuthStore()
const totalHerois  = ref(0)
const totalFuncoes = ref(0)

onMounted(async () => {
  try {
    const [h, f] = await Promise.all([getHerois(), getFuncoes()])
    totalHerois.value  = h.length
    totalFuncoes.value = f.length
  } catch {}
})
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}
.stat-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
  display: flex; align-items: center; gap: 1rem;
}
.stat-icon { font-size: 2rem; }
.stat-num  { font-size: 1.5rem; font-weight: 700; color: var(--primary); }
.stat-label{ font-size: .82rem; color: var(--muted); margin-top: .2rem; }

.quick-links h2 { font-size: 1.1rem; margin-bottom: 1rem; color: var(--muted); }
.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}
.quick-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
  text-decoration: none;
  color: var(--text);
  display: flex; flex-direction: column; gap: .4rem;
  transition: border-color .15s, transform .15s;
}
.quick-card:hover { border-color: var(--primary); transform: translateY(-3px); }
.quick-card span  { font-size: 2rem; }
.quick-card strong{ font-size: 1rem; }
.quick-card p     { font-size: .82rem; color: var(--muted); }
</style>
