require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const bcrypt  = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');

const app  = express();
const PORT = process.env.PORT || 3000;
const SALT = 10;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.use(cors());
app.use(express.json());

// =============================================
//  PROXY — API externa ML (evita CORS)
// =============================================
app.get('/api/ml-heroes-images', async (req, res) => {
  try {
    const response = await fetch('https://mlbb.rone.dev/api/heroes?size=300&order=asc');
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================================
//  AUTENTICAÇÃO
// =============================================

// Cadastro
app.post('/api/cadastro', async (req, res) => {
  try {
    const { nome, email, senha, cargo } = req.body;

    if (!nome || !email || !senha || !cargo)
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });

    // Verifica nome duplicado
    const { data: nomeExiste } = await supabase
      .from('usuarios')
      .select('id')
      .eq('nome', nome)
      .single();
    if (nomeExiste)
      return res.status(400).json({ error: 'Nome de usuário já está em uso.' });

    // Verifica email duplicado
    const { data: emailExiste } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .single();
    if (emailExiste)
      return res.status(400).json({ error: 'Email já cadastrado.' });

    // Criptografa senha
    const senhaHash = await bcrypt.hash(senha, SALT);

    const { data, error } = await supabase
      .from('usuarios')
      .insert([{ nome, email, senha: senhaHash, cargo }])
      .select('id, nome, email, cargo, criado_em')
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha)
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });

    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !usuario)
      return res.status(401).json({ error: 'Email ou senha inválidos.' });

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta)
      return res.status(401).json({ error: 'Email ou senha inválidos.' });

    // Retorna sem a senha
    const { senha: _, ...usuarioSemSenha } = usuario;
    res.json(usuarioSemSenha);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================================
//  FUNÇÕES
// =============================================
app.get('/api/funcoes', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('funcoes').select('*').order('nome', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/funcoes', async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    if (!nome) return res.status(400).json({ error: 'Nome é obrigatório.' });
    const { data, error } = await supabase
      .from('funcoes').insert([{ nome, descricao }]).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/funcoes/:id', async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    const { data, error } = await supabase
      .from('funcoes').update({ nome, descricao })
      .eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/funcoes/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('funcoes').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Função excluída.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================================
//  HERÓIS
// =============================================
app.get('/api/herois', async (req, res) => {
  try {
    const { busca, funcao_id } = req.query;
    let query = supabase
      .from('herois').select('*, funcoes(id, nome)')
      .order('nome', { ascending: true });
    if (busca)     query = query.ilike('nome', `%${busca}%`);
    if (funcao_id) query = query.eq('funcao_id', funcao_id);
    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/herois/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('herois').select('*, funcoes(id, nome)')
      .eq('id', req.params.id).single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/herois', async (req, res) => {
  try {
    const { nome, funcao_id, especialidade, dificuldade, descricao, imagem_url } = req.body;
    if (!nome || !funcao_id)
      return res.status(400).json({ error: 'Nome e função são obrigatórios.' });
    const { data, error } = await supabase
      .from('herois').insert([{ nome, funcao_id, especialidade, dificuldade, descricao, imagem_url }])
      .select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/herois/:id', async (req, res) => {
  try {
    const { nome, funcao_id, especialidade, dificuldade, descricao, imagem_url } = req.body;
    const { data, error } = await supabase
      .from('herois').update({ nome, funcao_id, especialidade, dificuldade, descricao, imagem_url })
      .eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/herois/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('herois').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Herói excluído.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`🗡️  Backend rodando em http://localhost:${PORT}`));
