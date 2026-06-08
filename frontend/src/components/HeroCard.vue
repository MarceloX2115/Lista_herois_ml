<template>
  <div class="hero-card">
    <div class="hero-img-wrap">
      <img
        v-if="imgUrl"
        :src="imgUrl"
        :alt="heroi.nome"
        class="hero-img"
        @error="imgUrl = null"
      />
      <div v-else class="hero-img-placeholder">🗡️</div>
    </div>

    <div class="hero-body">
      <div class="hero-name">{{ heroi.nome }}</div>
      <div class="hero-tags">
        <span v-if="heroi.funcoes" class="tag tag-funcao">{{ heroi.funcoes.nome }}</span>
        <span v-if="heroi.dificuldade" class="tag" :class="tagDif">{{ heroi.dificuldade }}</span>
      </div>
      <div v-if="heroi.especialidade" class="hero-esp">🎯 {{ heroi.especialidade }}</div>
      <div class="hero-desc">{{ heroi.descricao || 'Sem descrição cadastrada.' }}</div>
    </div>

    <div v-if="isModerador" class="hero-actions">
      <button class="btn btn-ghost btn-sm" @click="$emit('editar', heroi)">✏️ Editar</button>
      <button class="btn btn-danger btn-sm" @click="$emit('excluir', heroi)">🗑️ Excluir</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const props = defineProps({
  heroi: { type: Object, required: true },
  mlApiCache: { type: Object, default: () => ({}) }
})

defineEmits(['editar', 'excluir'])

const authStore = useAuthStore()
const isModerador = computed(() => authStore.isModerador)

const imgUrl = ref(props.heroi.imagem_url || null)

onMounted(() => {
  if (!imgUrl.value && props.mlApiCache[props.heroi.nome]) {
    imgUrl.value = props.mlApiCache[props.heroi.nome]
  }
})

const tagDif = computed(() => {
  const map = { 'Fácil': 'tag-facil', 'Médio': 'tag-medio', 'Difícil': 'tag-dificil' }
  return map[props.heroi.dificuldade] || ''
})
</script>

<style scoped>
.hero-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform .2s, box-shadow .2s;
}
.hero-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0,0,0,.5);
  border-color: var(--primary);
}
.hero-img-wrap { width: 100%; height: 160px; }
.hero-img { width: 100%; height: 100%; object-fit: cover; }
.hero-img-placeholder {
  width: 100%; height: 100%;
  background: linear-gradient(135deg, #1e2235, #2a2f4a);
  display: flex; align-items: center; justify-content: center;
  font-size: 3.5rem;
}
.hero-body { padding: 1rem; flex: 1; display: flex; flex-direction: column; gap: .5rem; }
.hero-name { font-size: 1.1rem; font-weight: 700; }
.hero-tags { display: flex; flex-wrap: wrap; gap: .35rem; }
.hero-esp  { font-size: .8rem; color: var(--muted); }
.hero-desc { font-size: .82rem; color: var(--muted); flex: 1; line-height: 1.5; }
.hero-actions {
  display: flex; gap: .5rem;
  padding: .75rem 1rem;
  border-top: 1px solid var(--border);
}
</style>
