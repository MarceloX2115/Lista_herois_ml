<template>
  <div>
    <section class="page-banner">
      <h1>Heróis</h1>
      <p>{{ authStore.isModerador ? 'Gerencie os heróis do Mobile Legends' : 'Visualize os heróis cadastrados' }}</p>
    </section>

    <div class="container">
      <!-- Filtros -->
      <div class="filters-bar">
        <input v-model="busca" type="text" class="input-field" style="flex:1;min-width:180px"
          placeholder="🔍 Buscar herói..." @keydown.enter="filtrar" />
        <select v-model="funcaoFiltro" class="select-input" style="width:auto">
          <option value="">Todas as funções</option>
          <option v-for="f in funcoes" :key="f.id" :value="f.id">{{ f.nome }}</option>
        </select>
        <button class="btn btn-secondary" @click="filtrar">Filtrar</button>
        <button v-if="authStore.isModerador" class="btn btn-primary" @click="abrirNovo">+ Novo Herói</button>
      </div>

      <!-- Lista -->
      <div v-if="carregando" class="loading">Carregando heróis...</div>
      <div v-else-if="!herois.length" class="empty">Nenhum herói encontrado.</div>
      <div v-else class="heroes-grid">
        <HeroCard
          v-for="h in herois"
          :key="h.id"
          :heroi="h"
          :mlApiCache="mlCache"
          @editar="abrirEdicao"
          @excluir="confirmarExclusao"
        />
      </div>
    </div>

    <!-- Modal Herói -->
    <BaseModal v-model="showModal" :title="editando ? 'Editar Herói' : 'Novo Herói'">
      <form class="modal-form" @submit.prevent="salvar">
        <div class="form-row">
          <label>Nome do Herói *</label>
          <select v-model="form.nome" class="select-input" required :disabled="carregandoAPI">
            <option value="">
              {{ carregandoAPI ? 'Carregando heróis da API...' : erroAPI ? 'Erro ao carregar API' : 'Selecione um herói...' }}
            </option>
            <option v-for="n in nomesAPI" :key="n" :value="n">{{ n }}</option>
          </select>
          <span v-if="erroAPI" style="color:var(--danger);font-size:.8rem;">
            ⚠️ API indisponível — criação de heróis bloqueada.
          </span>
        </div>

        <div class="form-row">
          <label>Função *</label>
          <select v-model="form.funcao_id" class="select-input" required>
            <option value="">Selecione...</option>
            <option v-for="f in funcoes" :key="f.id" :value="f.id">{{ f.nome }}</option>
          </select>
        </div>

        <div class="form-row">
          <label>Especialidade</label>
          <input v-model="form.especialidade" type="text" class="input-field" placeholder="Ex: Burst Damage/Reap" />
        </div>

        <div class="form-row">
          <label>Dificuldade</label>
          <select v-model="form.dificuldade" class="select-input">
            <option value="">Selecione...</option>
            <option>Fácil</option>
            <option>Médio</option>
            <option>Difícil</option>
          </select>
        </div>

        <div class="form-row">
          <label>Descrição</label>
          <textarea v-model="form.descricao" class="input-field textarea" rows="3" placeholder="Descreva o herói..."></textarea>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-ghost" @click="showModal = false">Cancelar</button>
          <button type="submit" class="btn btn-primary" :disabled="salvando || erroAPI">
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
import { useAuthStore } from '../stores/auth'
import { getHerois, getFuncoes, createHeroi, updateHeroi, deleteHeroi, getMLHeroesAPI } from '../services/api'
import HeroCard   from '../components/HeroCard.vue'
import BaseModal  from '../components/BaseModal.vue'
import ToastMsg   from '../components/ToastMsg.vue'

const authStore = useAuthStore()
const toast     = ref(null)

const herois      = ref([])
const funcoes     = ref([])
const busca       = ref('')
const funcaoFiltro= ref('')
const carregando  = ref(false)
const showModal   = ref(false)
const editando    = ref(false)
const salvando    = ref(false)

// API externa
const nomesAPI    = ref([])
const mlCache     = ref({})
const carregandoAPI = ref(false)
const erroAPI     = ref(false)

const form = ref({ id: null, nome: '', funcao_id: '', especialidade: '', dificuldade: '', descricao: '' })

async function carregarFuncoes() {
  funcoes.value = await getFuncoes()
}

async function filtrar() {
  carregando.value = true
  try {
    const params = {}
    if (busca.value)       params.busca     = busca.value
    if (funcaoFiltro.value) params.funcao_id = funcaoFiltro.value
    herois.value = await getHerois(params)
  } catch {
    toast.value.show('Erro ao carregar heróis.', 'error')
  } finally {
    carregando.value = false
  }
}

async function carregarAPI() {
  carregandoAPI.value = true
  erroAPI.value = false
  try {
    const data    = await getMLHeroesAPI()
    const records = data?.data?.records || []
    records.forEach(r => {
      const nome = r?.data?.hero?.data?.name
      const head = r?.data?.hero?.data?.head
      if (nome) {
        nomesAPI.value.push(nome)
        if (head) mlCache.value[nome] = head
      }
    })
    nomesAPI.value.sort()
    if (!nomesAPI.value.length) erroAPI.value = true
  } catch {
    erroAPI.value = true
  } finally {
    carregandoAPI.value = false
  }
}

function resetForm() {
  form.value = { id: null, nome: '', funcao_id: '', especialidade: '', dificuldade: '', descricao: '' }
}

function abrirNovo() {
  resetForm()
  editando.value = false
  showModal.value = true
}

function abrirEdicao(h) {
  form.value = {
    id:           h.id,
    nome:         h.nome,
    funcao_id:    h.funcao_id,
    especialidade: h.especialidade || '',
    dificuldade:  h.dificuldade   || '',
    descricao:    h.descricao     || '',
  }
  editando.value  = true
  showModal.value = true
}

async function salvar() {
  if (erroAPI.value && !editando.value) {
    toast.value.show('API indisponível. Criação bloqueada.', 'error')
    return
  }
  salvando.value = true
  try {
    const imgUrl = mlCache.value[form.value.nome] || null
    const payload = { ...form.value, imagem_url: imgUrl }
    if (editando.value) {
      await updateHeroi(form.value.id, payload)
      toast.value.show('Herói atualizado!', 'success')
    } else {
      await createHeroi(payload)
      toast.value.show('Herói cadastrado!', 'success')
    }
    showModal.value = false
    filtrar()
  } catch (e) {
    toast.value.show(e.message, 'error')
  } finally {
    salvando.value = false
  }
}

async function confirmarExclusao(h) {
  if (!confirm(`Excluir "${h.nome}"?`)) return
  try {
    await deleteHeroi(h.id)
    toast.value.show('Herói excluído.', 'success')
    filtrar()
  } catch {
    toast.value.show('Erro ao excluir.', 'error')
  }
}

onMounted(async () => {
  await Promise.all([carregarFuncoes(), carregarAPI()])
  await filtrar()
})
</script>

<style scoped>
.modal-form { padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: .85rem; }
.modal-actions { display: flex; justify-content: flex-end; gap: .6rem; padding-top: .5rem; }
</style>
