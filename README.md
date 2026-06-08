# ⚔️ ML Heroes — Sistema de Heróis do Mobile Legends

Sistema web Full Stack para gerenciar heróis do Mobile Legends, com autenticação por cargo, desenvolvido com Vue.js, Node.js, Express e Supabase.

---

## 🎯 Objetivo do Sistema
Permite gerenciar heróis e funções do Mobile Legends com controle de acesso por cargo. Moderadores têm acesso total ao CRUD, enquanto visitantes apenas visualizam os heróis cadastrados.

---

## 🛠️ Tecnologias Utilizadas

| Camada    | Tecnologia |
|-----------|------------|
| Front-end | Vue.js 3, Vue Router, Pinia |
| Back-end  | Node.js, Express |
| Banco     | Supabase (PostgreSQL) |
| Build     | Vite |
| Deploy    | Railway |

---

## 📁 Estrutura do Projeto

```
ml-heroes-vue/
├── backend/
│   ├── index.js          ← API REST (Express + Supabase)
│   ├── package.json
│   ├── supabase.sql      ← Script SQL para criar as tabelas
│   └── .env.example
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.js
        ├── App.vue
        ├── assets/
        │   └── style.css
        ├── components/
        │   ├── Navbar.vue
        │   ├── HeroCard.vue
        │   ├── BaseModal.vue
        │   └── ToastMsg.vue
        ├── views/
        │   ├── LoginView.vue
        │   ├── CadastroView.vue
        │   ├── DashboardView.vue
        │   ├── HeroisView.vue
        │   └── FuncoesView.vue
        ├── stores/
        │   └── auth.js       ← Pinia store
        ├── router/
        │   └── index.js
        └── services/
            └── api.js
```

---

## 🗃️ Banco de Dados (3 tabelas)

### `usuarios`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | SERIAL | PK |
| nome | VARCHAR | Nome único do usuário |
| email | VARCHAR | Email único |
| senha | VARCHAR | Senha criptografada (bcrypt) |
| cargo | VARCHAR | moderador ou visitante |
| criado_em | TIMESTAMP | Data de criação |

### `funcoes`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | SERIAL | PK |
| nome | VARCHAR | Nome da função (Tank, Mage…) |
| descricao | TEXT | Descrição |

### `herois`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | SERIAL | PK |
| nome | VARCHAR | Nome do herói |
| funcao_id | INT | FK → funcoes.id |
| especialidade | VARCHAR | Especialidade do herói |
| dificuldade | VARCHAR | Fácil / Médio / Difícil |
| descricao | TEXT | Descrição |
| imagem_url | TEXT | URL da imagem (via API) |
| criado_em | TIMESTAMP | Data de criação |

---

## ▶️ Como Executar o Projeto

### Back-end
```bash
cd backend
npm install
cp .env.example .env   # preencha com suas credenciais do Supabase
npm start
```

### Front-end
```bash
cd frontend
npm install
npm run dev
```

Acesse: **http://localhost:5173**

---

## ✅ Funcionalidades Implementadas

- [x] Cadastro com email, senha e nome únicos
- [x] Login com email e senha
- [x] Senha criptografada com bcrypt
- [x] Gerenciamento de estado com Pinia
- [x] Proteção de rotas por cargo
- [x] Dashboard com estatísticas
- [x] Listagem de heróis com filtro por nome e função
- [x] CRUD completo de heróis (Moderador)
- [x] CRUD completo de funções (Moderador)
- [x] Nomes de heróis validados via API do ML
- [x] Imagens automáticas via API
- [x] Componentização (Navbar, HeroCard, BaseModal, ToastMsg)
- [x] 3 tabelas no banco de dados

---
## 📸 Prints do Sistema

### Cadastro
![Tela de Cadastro]("https://github.com/user-attachments/assets/4d78cb1f-9567-46c6-b383-8a3f534c7784">)


---

## 🔌 Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/cadastro` | Cadastro de usuário |
| POST | `/api/login` | Login do usuário |
| GET | `/api/herois` | Lista heróis |
| POST | `/api/herois` | Cadastra herói |
| PUT | `/api/herois/:id` | Atualiza herói |
| DELETE | `/api/herois/:id` | Exclui herói |
| GET | `/api/funcoes` | Lista funções |
| POST | `/api/funcoes` | Cadastra função |
| PUT | `/api/funcoes/:id` | Atualiza função |
| DELETE | `/api/funcoes/:id` | Exclui função |
| GET | `/api/ml-heroes-images` | Proxy API externa |
