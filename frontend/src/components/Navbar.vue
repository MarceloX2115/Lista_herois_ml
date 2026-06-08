<template>
  <header class="navbar">
    <div class="navbar-inner">
      <div class="logo">
        <span class="logo-icon">⚔️</span>
        <span class="logo-text">ML <strong>Heroes</strong></span>
      </div>

      <nav class="nav">
        <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
        <router-link to="/herois"    class="nav-link">Heróis</router-link>
        <router-link v-if="authStore.isModerador" to="/funcoes" class="nav-link">Funções</router-link>
      </nav>

      <div class="navbar-user">
        <span class="user-badge" :class="authStore.isModerador ? 'badge-mod' : 'badge-vis'">
          {{ authStore.isModerador ? '🛡️ Moderador' : '👁️ Visitante' }}
        </span>
        <span class="user-name">{{ authStore.nomeUsuario }}</span>
        <button class="btn btn-ghost btn-sm" @click="sair">Sair</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router    = useRouter()

function sair() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
}
.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.logo { display: flex; align-items: center; gap: .5rem; font-size: 1.2rem; }
.logo-icon { font-size: 1.4rem; }
.logo-text { color: var(--muted); }
.logo-text strong { color: var(--primary); }

.nav { display: flex; gap: .25rem; flex: 1; }
.nav-link {
  color: var(--muted);
  text-decoration: none;
  padding: .4rem .9rem;
  border-radius: 8px;
  font-size: .9rem;
  transition: background .15s, color .15s;
}
.nav-link:hover          { background: var(--border); color: var(--text); }
.nav-link.router-link-active { background: var(--primary); color: #000; font-weight: 600; }

.navbar-user { display: flex; align-items: center; gap: .75rem; }
.user-name   { font-size: .85rem; color: var(--muted); }

.user-badge {
  font-size: .75rem;
  font-weight: 700;
  padding: .25rem .65rem;
  border-radius: 20px;
}
.badge-mod { background: rgba(232,164,0,.2); color: var(--primary); border: 1px solid rgba(232,164,0,.3); }
.badge-vis { background: rgba(92,124,250,.2); color: var(--accent);  border: 1px solid rgba(92,124,250,.3); }
</style>
