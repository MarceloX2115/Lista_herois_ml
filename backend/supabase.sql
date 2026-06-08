-- ================================================
-- SCRIPT SQL — Sistema de Heróis ML (Vue.js)
-- Execute no SQL Editor do Supabase
-- ================================================

-- Tabela 1: usuarios
CREATE TABLE usuarios (
  id        SERIAL PRIMARY KEY,
  nome      VARCHAR(100) NOT NULL UNIQUE,
  email     VARCHAR(150) NOT NULL UNIQUE,
  senha     VARCHAR(255) NOT NULL,
  cargo     VARCHAR(20)  NOT NULL CHECK (cargo IN ('moderador', 'visitante')),
  criado_em TIMESTAMP DEFAULT NOW()
);

ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;

-- Tabela 2: funcoes
CREATE TABLE funcoes (
  id        SERIAL PRIMARY KEY,
  nome      VARCHAR(50) NOT NULL UNIQUE,
  descricao TEXT
);

ALTER TABLE funcoes DISABLE ROW LEVEL SECURITY;

-- Tabela 3: herois
CREATE TABLE herois (
  id            SERIAL PRIMARY KEY,
  nome          VARCHAR(100) NOT NULL,
  funcao_id     INT NOT NULL REFERENCES funcoes(id) ON DELETE RESTRICT,
  especialidade VARCHAR(100),
  dificuldade   VARCHAR(20) CHECK (dificuldade IN ('Fácil', 'Médio', 'Difícil')),
  descricao     TEXT,
  imagem_url    TEXT,
  criado_em     TIMESTAMP DEFAULT NOW()
);

ALTER TABLE herois DISABLE ROW LEVEL SECURITY;

-- ============ DADOS INICIAIS ============

INSERT INTO funcoes (nome, descricao) VALUES
  ('Tank',      'Absorve dano e protege a equipe'),
  ('Fighter',   'Combate corpo a corpo equilibrado'),
  ('Assassin',  'Alto dano, elimina alvos rapidamente'),
  ('Mage',      'Dano mágico à distância'),
  ('Marksman',  'Dano físico contínuo à distância'),
  ('Support',   'Cura e suporte para aliados');

INSERT INTO herois (nome, funcao_id, especialidade, dificuldade, descricao) VALUES
  ('Tigreal',  1, 'Initiator/Crowd Control', 'Fácil',   'Tank iniciador clássico com alto CC.'),
  ('Layla',    5, 'Burst Damage/Reap',       'Fácil',   'Marksman ideal para iniciantes, alto alcance.'),
  ('Gusion',   3, 'Burst Damage/Reap',       'Difícil', 'Assassino com combos rápidos e teleporte.'),
  ('Kagura',   4, 'Burst Damage/Poke',       'Difícil', 'Mage com mecânica de guarda-chuva única.'),
  ('Estes',    6, 'Heal/Support',            'Médio',   'O melhor suporte de cura do jogo.'),
  ('Chou',     2, 'Crowd Control/Burst',     'Difícil', 'Fighter com kicks poderosos e alto outplay.');
