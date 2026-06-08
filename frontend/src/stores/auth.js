import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref(JSON.parse(localStorage.getItem('ml_usuario') || 'null'))

  const isLoggedIn  = computed(() => !!usuario.value)
  const isModerador = computed(() => usuario.value?.cargo === 'moderador')
  const isVisitante = computed(() => usuario.value?.cargo === 'visitante')
  const nomeUsuario = computed(() => usuario.value?.nome || '')

  function login(dados) {
    usuario.value = dados
    localStorage.setItem('ml_usuario', JSON.stringify(dados))
  }

  function logout() {
    usuario.value = null
    localStorage.removeItem('ml_usuario')
  }

  return { usuario, isLoggedIn, isModerador, isVisitante, nomeUsuario, login, logout }
})
