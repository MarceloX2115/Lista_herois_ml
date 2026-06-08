<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-logo">
        <span>⚔️</span>
        <h1>ML <strong>Heroes</strong></h1>
        <p>Sistema de Heróis do Mobile Legends</p>
      </div>

      <form class="login-form" @submit.prevent="entrar">
        <div class="form-row">
          <label>Email</label>
          <input v-model="email" type="email" class="input-field" placeholder="seu@email.com" required />
        </div>

        <div class="form-row">
          <label>Senha</label>
          <input v-model="senha" type="password" class="input-field" placeholder="••••••••" required />
        </div>

        <p v-if="erro" class="erro-msg">{{ erro }}</p>

        <button type="submit" class="btn btn-primary btn-full" :disabled="carregando">
          {{ carregando ? 'Entrando...' : 'Entrar' }}
        </button>

        <p class="cadastro-link">
          Não tem conta?
          <router-link to="/cadastro">Cadastre-se</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { login } from '../services/api'

const router    = useRouter()
const authStore = useAuthStore()

const email      = ref('')
const senha      = ref('')
const erro       = ref('')
const carregando = ref(false)

async function entrar() {
  erro.value = ''
  carregando.value = true
  try {
    const usuario = await login(email.value.trim(), senha.value)
    authStore.login(usuario)
    router.push('/dashboard')
  } catch (e) {
    erro.value = e.message
  } finally {
    carregando.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #0d0f1a 0%, #1a1030 50%, #0d1a3a 100%);
  padding: 1rem;
}
.login-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 2.5rem;
  width: 100%; max-width: 420px;
  box-shadow: var(--shadow);
}
.login-logo { text-align: center; margin-bottom: 2rem; }
.login-logo span { font-size: 3rem; display: block; margin-bottom: .5rem; }
.login-logo h1 { font-size: 1.8rem; color: var(--muted); }
.login-logo h1 strong { color: var(--primary); }
.login-logo p { color: var(--muted); font-size: .85rem; margin-top: .3rem; }

.login-form { display: flex; flex-direction: column; gap: 1.25rem; }
.btn-full { width: 100%; justify-content: center; padding: .75rem; font-size: 1rem; }
.erro-msg { color: var(--danger); font-size: .85rem; text-align: center; }
.cadastro-link { text-align: center; font-size: .85rem; color: var(--muted); }
.cadastro-link a { color: var(--primary); text-decoration: none; font-weight: 600; }
.cadastro-link a:hover { text-decoration: underline; }
</style>
