const BASE = '/api'

async function request(url, options = {}) {
  const res = await fetch(BASE + url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erro na requisição')
  return data
}

// Auth
export const cadastro = (body) =>
  request('/cadastro', { method: 'POST', body: JSON.stringify(body) })

export const login = (email, senha) =>
  request('/login', { method: 'POST', body: JSON.stringify({ email, senha }) })

// Funções
export const getFuncoes    = ()          => request('/funcoes')
export const createFuncao  = (body)      => request('/funcoes', { method: 'POST', body: JSON.stringify(body) })
export const updateFuncao  = (id, body)  => request(`/funcoes/${id}`, { method: 'PUT', body: JSON.stringify(body) })
export const deleteFuncao  = (id)        => request(`/funcoes/${id}`, { method: 'DELETE' })

// Heróis
export const getHerois = (params = {}) => {
  const q = new URLSearchParams(params).toString()
  return request(`/herois${q ? '?' + q : ''}`)
}
export const getHeroi    = (id)         => request(`/herois/${id}`)
export const createHeroi = (body)       => request('/herois', { method: 'POST', body: JSON.stringify(body) })
export const updateHeroi = (id, body)   => request(`/herois/${id}`, { method: 'PUT', body: JSON.stringify(body) })
export const deleteHeroi = (id)         => request(`/herois/${id}`, { method: 'DELETE' })

// API externa ML (proxy)
export const getMLHeroesAPI = () => request('/ml-heroes-images')
