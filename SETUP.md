# 🚀 Setup do Blog Sagrada Magia

## ✅ Estrutura do Projeto

Este é um **projeto Next.js independente** para o blog Sagrada Magia:

```
/home/claude/sagrada-magia-blog/     ← SEU BLOG (novo)
```

**Separado de:**
- `/home/claude/sagrada-magia-painel/` ← Seu outro projeto (quando existir)

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Supabase (criar em supabase.com)

## 🔧 Configuração Passo a Passo

### Passo 1: Variáveis de Ambiente

Edite `.env.local` na raiz do projeto e adicione:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=seu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role

# Security
JWT_SECRET=sua_senha_secreta_super_segura_123

# Admin Login
NEXT_PUBLIC_ADMIN_USERNAME=joao
NEXT_PUBLIC_ADMIN_PASSWORD=sua_senha_forte_123
```

### Passo 2: Criar Banco de Dados no Supabase

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Crie um novo projeto (ou use um existente)
3. Vá em Settings → API
4. Copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Vá em Settings → Database
   - Copie `Service Role key` → `SUPABASE_SERVICE_ROLE_KEY`

### Passo 3: Criar Tabelas no Banco

Execute o SQL no Supabase SQL Editor:

```sql
-- Tabela de Categorias
CREATE TABLE blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Posts
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image VARCHAR(500),
  category VARCHAR(255),
  author_name VARCHAR(255),
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords TEXT,
  published BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  reading_time INTEGER DEFAULT 3,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);

-- Categorias Pré-inseridas
INSERT INTO blog_categories (name, slug, icon, description) VALUES
('Meditação & Mindfulness', 'meditacao', '🧘', 'Técnicas e práticas de meditação'),
('Cristais & Gemas', 'cristais', '💎', 'Propriedades curativas dos cristais'),
('Tarô & Oráculos', 'tarot', '🔮', 'Interpretações de tarô'),
('Rituais Sagrados', 'rituais', '🕯️', 'Rituais para transformação'),
('Astrologia', 'astrologia', '✨', 'Influências cósmicas'),
('Aromaterapia', 'aromaterapia', '🌸', 'Óleos essenciais'),
('Espiritualidade', 'espiritualidade', '☮️', 'Reflexões espirituais'),
('Numerologia', 'numerologia', '🔢', 'Significados numéricos');
```

### Passo 4: Instalar Dependências

```bash
npm install
```

### Passo 5: Executar Localmente

```bash
npm run dev
```

Acesse: `http://localhost:3000`

## 🌐 Acessar Admin

```
URL: http://localhost:3000/admin/posts
Usuário: joao (ou o que configurou)
Senha: sua_senha_forte_123 (ou a que configurou)
```

## 📝 Criar Primeiro Post

1. Acesse `http://localhost:3000/admin/posts`
2. Clique **"+ Novo Post"**
3. Preencha:
   - Título
   - Slug (gerado automaticamente)
   - Resumo
   - Conteúdo (pode ser HTML)
   - Autor
   - Categoria
4. Marque **"Publicar imediatamente"**
5. Clique **"Criar Post"**
6. Vá em `http://localhost:3000/blog` e veja seu post!

## 📚 URLs Principais

| Página | URL |
|--------|-----|
| Admin Dashboard | `/admin/posts` |
| Blog Público | `/blog` |
| Post Individual | `/blog/seu-slug-aqui` |
| Posts por Categoria | `/blog/categoria/meditacao` |
| API: Listar Posts | `/api/posts` |
| API: Buscar Posts | `/api/posts/search?q=cristais` |

## 🚀 Deploy no Vercel

### 1. Fazer Push para GitHub

```bash
git add .
git commit -m "Inicializar blog Sagrada Magia"
git push origin main
```

### 2. Conectar no Vercel

- Acesse [vercel.com](https://vercel.com)
- Clique "Import Project"
- Selecione seu repositório
- Clique "Continue"

### 3. Adicionar Variáveis de Ambiente

Na seção "Environment Variables", adicione:

```
NEXT_PUBLIC_SUPABASE_URL = seu_url
NEXT_PUBLIC_SUPABASE_ANON_KEY = sua_chave
SUPABASE_SERVICE_ROLE_KEY = sua_chave_service
JWT_SECRET = sua_senha_secreta
NEXT_PUBLIC_ADMIN_USERNAME = joao
NEXT_PUBLIC_ADMIN_PASSWORD = sua_senha
```

### 4. Deploy

Clique "Deploy" e aguarde!

## 🎨 Customizar

### Cores
Edite `tailwind.config.ts` e altere `sagrada.magenta`, `sagrada.mint`, etc.

### Fontes
Edite `tailwind.config.ts` e altere `fontFamily.quiche`, `.amiko`, `.niramit`

### Categorias
Insira novas categorias diretamente no Supabase SQL ou edite `lib/categories.ts`

## 🔍 Troubleshooting

**Login não funciona:**
- Verifique `.env.local` com o username e password
- Limpe localStorage do navegador

**Posts não aparecem:**
- Verifique se estão com `published = true` no Supabase
- Confira a conexão Supabase

**Erros de API:**
- Confira `SUPABASE_SERVICE_ROLE_KEY` no `.env.local`
- Verifique console do navegador (F12)

## 📞 Suporte

Consulte os arquivos `.md` neste diretório para mais ajuda!

---

**Tudo pronto?** Comece a criar conteúdo! ✨
