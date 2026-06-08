<template>
  <div>
    <section class="page-banner">
      <h1>Funções</h1>
      <p>Gerencie as classes dos heróis do Mobile Legends</p>
    </section>

    <div class="container">
      <div class="filters-bar">
        <h2 style="margin:0;flex:1;font-size:1rem;">Funções Cadastradas</h2>
        <button class="btn btn-primary" @click="abrirNovo">+ Nova Função</button>
      </div>

      <div v-if="carregando" class="loading">Carregando funções...</div>
      <div v-else-if="!funcoes.length" class="empty">Nenhuma função cadastrada.</div>
      <div v-else class="funcoes-list">
        <div v-for="f in funcoes" :key="f.id" class="funcao-item card">
          <div class="funcao-icon">{{ icones[f.nome] || '🎮' }}</div>
          <div class="funcao-info">
            <div class="funcao-nome">{{ f.nome }}</div>
            <div class="funcao-desc">{{ f.descricao || 'Sem descrição.' }}</div>
          </div>
          <div class="funcao-actions">
            <button class="btn btn-ghost btn-sm" @click="abrirEdicao(f)">✏️ Editar</button>
            <button class="btn btn-danger btn-sm" @click="excluir(f)">🗑️</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <BaseModal v-model="showModal" :title="editando ? 'Editar Função' : 'Nova Função'" size="sm">
      <form class="modal-form" @submit.prevent="salvar">
        <div class="form-row">
          <label>Nome *</label>
          <input v-model="form.nome" type="text" class="input-field" required placeholder="Ex: Tank" />
        </div>
        <div class="form-row">
          <label>Descrição</label>
          <textarea v-model="form.descricao" class="input-field textarea" rows="3" placeholder="Descreva a função..."></textarea>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-ghost" @click="showModal = false">Cancelar</button>
          <button type="submit" class="btn btn-primary" :disabled="salvando">
            {{ salvando ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </form>
    </BaseModal>

    <ToastMsg ref="toast" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getFuncoes, createFuncao, updateFuncao, deleteFuncao } from '../services/api'
import BaseModal from '../components/BaseModal.vue'
import ToastMsg  from '../components/ToastMsg.vue'

const toast     = ref(null)
const funcoes   = ref([])
const carregando= ref(false)
const showModal = ref(false)
const editando  = ref(false)
const salvando  = ref(false)
const form      = ref({ id: null, nome: '', descricao: '' })

const icones = { Tank: '🛡️', Fighter: '⚔️', Assassin: '🗡️', Mage: '🔮', Marksman: '🏹', Support: '💊' }

async function carregar() {
  carregando.value = true
  try { funcoes.value = await getFuncoes() }
  catch { toast.value.show('Erro ao carregar funções.', 'error') }
  finally { carregando.value = false }
}

function abrirNovo() {
  form.value  = { id: null, nome: '', descricao: '' }
  editando.value  = false
  showModal.value = true
}

function abrirEdicao(f) {
  form.value  = { id: f.id, nome: f.nome, descricao: f.descricao || '' }
  editando.value  = true
  showModal.value = true
}

async function salvar() {
  salvando.value = true
  try {
    if (editando.value) {
      await updateFuncao(form.value.id, { nome: form.value.nome, descricao: form.value.descricao })
      toast.value.show('Função atualizada!', 'success')
    } else {
      await createFuncao({ nome: form.value.nome, descricao: form.value.descricao })
      toast.value.show('Função cadastrada!', 'success')
    }
    showModal.value = false
    carregar()
  } catch (e) {
    toast.value.show(e.message, 'error')
  } finally {
    salvando.value = false
  }
}

async function excluir(f) {
  if (!confirm(`Excluir "${f.nome}"? Só é possível se não houver heróis vinculados.`)) return
  try {
    await deleteFuncao(f.id)
    toast.value.show('Função excluída.', 'success')
    carregar()
  } catch (e) {
    toast.value.show(e.message, 'error')
  }
}

onMounted(carregar)
</script>

<style scoped>
.funcoes-list { display: flex; flex-direction: column; gap: .75rem; }
.funcao-item  { padding: 1rem 1.25rem; display: flex; align-items: center; gap: 1rem; }
.funcao-icon  { font-size: 1.8rem; }
.funcao-info  { flex: 1; }
.funcao-nome  { font-weight: 700; }
.funcao-desc  { font-size: .83rem; color: var(--muted); margin-top: .2rem; }
.funcao-actions { display: flex; gap: .5rem; }
.modal-form { padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: .85rem; }
.modal-actions { display: flex; justify-content: flex-end; gap: .6rem; padding-top: .5rem; }
</style>
