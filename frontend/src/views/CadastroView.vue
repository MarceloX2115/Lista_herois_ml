<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-logo">
        <span>⚔️</span>
        <h1>ML <strong>Heroes</strong></h1>
        <p>Crie sua conta</p>
      </div>

      <form class="login-form" @submit.prevent="cadastrar">
        <div class="form-row">
          <label>Nome de usuário</label>
          <input v-model="nome" type="text" class="input-field" placeholder="Ex: DemonX" required />
        </div>

        <div class="form-row">
          <label>Email</label>
          <input v-model="email" type="email" class="input-field" placeholder="seu@email.com" required />
        </div>

        <div class="form-row">
          <label>Senha</label>
          <input v-model="senha" type="password" class="input-field" placeholder="Mínimo 6 caracteres" required minlength="6" />
        </div>

        <div class="form-row">
          <label>Entrar como</label>
          <div class="cargo-options">
            <button type="button" class="cargo-btn" :class="{ active: cargo === 'moderador' }" @click="cargo = 'moderador'">
              🛡️ Moderador
              <span>Acesso total ao sistema</span>
            </button>
            <button type="button" class="cargo-btn" :class="{ active: cargo === 'visitante' }" @click="cargo = 'visitante'">
              👁️ Visitante
              <span>Somente visualização</span>
            </button>
          </div>
        </div>

        <p v-if="erro" class="erro-msg">{{ erro }}</p>
        <p v-if="sucesso" class="sucesso-msg">{{ sucesso }}</p>

        <button type="submit" class="btn btn-primary btn-full" :disabled="carregando">
          {{ carregando ? 'Cadastrando...' : 'Criar conta' }}
        </button>

        <p class="cadastro-link">
          Já tem conta?
          <router-link to="/login">Entrar</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { cadastro } from '../services/api'

const router = useRouter()

const nome       = ref('')
const email      = ref('')
const senha      = ref('')
const cargo      = ref('visitante')
const erro       = ref('')
const sucesso    = ref('')
const carregando = ref(false)

async function cadastrar() {
  erro.value    = ''
  sucesso.value = ''
  carregando.value = true
  try {
    await cadastro({ nome: nome.value.trim(), email: email.value.trim(), senha: senha.value, cargo: cargo.value })
    sucesso.value = 'Conta criada com sucesso! Redirecionando...'
    setTimeout(() => router.push('/login'), 1500)
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

.cargo-options { display: flex; gap: .75rem; }
.cargo-btn {
  flex: 1; background: var(--bg); border: 2px solid var(--border);
  border-radius: 10px; color: var(--text); padding: .85rem .75rem;
  cursor: pointer; text-align: center; transition: all .15s;
  display: flex; flex-direction: column; gap: .25rem; font-size: .95rem; font-weight: 600;
}
.cargo-btn span { font-size: .72rem; color: var(--muted); font-weight: 400; }
.cargo-btn:hover  { border-color: var(--accent); }
.cargo-btn.active { border-color: var(--primary); background: rgba(232,164,0,.1); color: var(--primary); }

.btn-full { width: 100%; justify-content: center; padding: .75rem; font-size: 1rem; }
.erro-msg    { color: var(--danger);  font-size: .85rem; text-align: center; }
.sucesso-msg { color: var(--success); font-size: .85rem; text-align: center; }
.cadastro-link { text-align: center; font-size: .85rem; color: var(--muted); }
.cadastro-link a { color: var(--primary); text-decoration: none; font-weight: 600; }
.cadastro-link a:hover { text-decoration: underline; }
</style>
