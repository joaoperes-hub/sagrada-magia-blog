# 🌟 Blog Sagrada Magia - Projeto Independente

Um **blog completo, moderno e profissional** para a Sagrada Magia, totalmente separado de qualquer outro projeto.

## ✨ Características

✅ **Admin Dashboard Completo**
- Criar, editar e deletar posts
- Login seguro com JWT
- Interface amigável em português
- Posts como rascunho ou publicados

✅ **Blog Público Profissional**
- Homepage com últimos posts
- Posts individuais com SEO
- Filtro por categorias
- Busca full-text
- Tempo de leitura calculado
- Contador de visualizações

✅ **Segurança & Performance**
- Autenticação JWT
- Row Level Security (RLS) no Supabase
- API endpoints protegidos
- Server-side rendering (SSR)
- Otimizado para SEO

✅ **Design Sagrada Magia**
- Cores: Magenta (#D195CB), Mint, Pink
- Tipografia: Quiche, Amiko, Niramit
- Responsivo (mobile, tablet, desktop)
- Tailwind CSS

## 🗂️ Estrutura do Projeto

```
sagrada-magia-blog/
├── app/
│   ├── admin/posts/           # Dashboard do admin
│   │   ├── page.tsx           # Listagem de posts
│   │   ├── new/page.tsx       # Criar post
│   │   └── [id]/edit/page.tsx # Editar post
│   ├── api/posts/             # API endpoints
│   │   ├── route.ts           # GET/POST posts
│   │   ├── [id]/route.ts      # GET/PUT/DELETE um post
│   │   └── search/route.ts    # Busca de posts
│   ├── blog/                  # Blog público
│   │   ├── page.tsx           # Homepage do blog
│   │   ├── [slug]/page.tsx    # Post individual
│   │   └── categoria/[slug]/  # Posts por categoria
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── supabase.ts            # Cliente Supabase
│   ├── categories.ts          # Categorias
│   ├── types.ts               # Types TypeScript
│   └── hooks/
│       ├── usePosts.ts        # Hook para buscar posts
│       └── usePostSearch.ts   # Hook para busca
├── .env.local                 # Variáveis de ambiente
├── SETUP.md                   # Guia de setup
├── README_PROJETO.md          # Este arquivo
├── tailwind.config.ts         # Configuração Tailwind
└── package.json
```

## 🚀 Quick Start

### 1. Clonar/Baixar o Projeto

```bash
# Se estiver em um diretório com git
cd /home/claude/sagrada-magia-blog
```

### 2. Configurar `.env.local`

Edite o arquivo `.env.local` com seus dados do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
JWT_SECRET=sua_senha_super_segura_123
NEXT_PUBLIC_ADMIN_USERNAME=joao
NEXT_PUBLIC_ADMIN_PASSWORD=sua_senha_123
```

### 3. Instalar Dependências

```bash
npm install
```

### 4. Criar Tabelas no Supabase

Copie o SQL do arquivo `SETUP.md` e execute no Supabase SQL Editor.

### 5. Rodar Localmente

```bash
npm run dev
```

- **Blog**: http://localhost:3000/blog
- **Admin**: http://localhost:3000/admin/posts
- **API**: http://localhost:3000/api/posts

## 📊 Banco de Dados

### Tabelas

**blog_posts**
- `id` - UUID
- `title` - Título do post
- `slug` - URL amigável
- `excerpt` - Resumo
- `content` - Conteúdo (HTML)
- `featured_image` - Imagem destacada
- `category` - Categoria
- `author_name` - Autor
- `seo_title` - Título SEO
- `seo_description` - Descrição SEO
- `seo_keywords` - Palavras-chave
- `published` - Publicado?
- `views` - Visualizações
- `reading_time` - Tempo de leitura (min)
- `published_at` - Data de publicação
- `created_at` - Criado em
- `updated_at` - Atualizado em

**blog_categories**
- `id` - UUID
- `name` - Nome
- `slug` - URL amigável
- `description` - Descrição
- `icon` - Emoji
- `created_at` - Criado em

## 🔐 Autenticação

**Admin Login:**
- Username: configurável via `.env.local`
- Password: configurável via `.env.local`
- Armazenamento: localStorage
- Proteção: JWT token

**Padrão (se não configurar):**
- Username: `admin`
- Password: `admin123`

## 🌐 API Endpoints

```
GET    /api/posts                    # Listar posts publicados
POST   /api/posts                    # Criar post (requer auth)
GET    /api/posts?published=false    # Listar todos os posts (admin)
GET    /api/posts/[id]               # Buscar um post
PUT    /api/posts/[id]               # Atualizar post (requer auth)
DELETE /api/posts/[id]               # Deletar post (requer auth)
GET    /api/posts/search?q=cristais  # Buscar posts
```

## 🎨 Customização

### Cores
Edite `tailwind.config.ts`:

```typescript
'sagrada': {
  'magenta': '#D195CB',      // Altere aqui
  'mint': '#CEE5C1',
  'pink': '#FF9B84',
  // ... mais cores
}
```

### Fontes
Edite `tailwind.config.ts`:

```typescript
fontFamily: {
  'quiche': ['Quiche Flare', 'serif'],   // Títulos
  'amiko': ['Amiko', 'sans-serif'],      // Subtítulos
  'niramit': ['Niramit', 'sans-serif'],  // Textos
}
```

### Categorias
Edite `lib/categories.ts` e insira novas categorias.

## 📱 Deploy

### Vercel (Recomendado)

1. Faça push para GitHub
2. Conecte em [vercel.com](https://vercel.com)
3. Adicione variáveis de ambiente
4. Deploy automático!

```bash
git push origin main
```

### Outras Plataformas

- **Netlify**: Suporta Next.js (configure env vars)
- **Railway**: Hospedagem simples
- **Render**: Suporte a Next.js
- **Seu servidor**: `npm run build && npm run start`

## 🐛 Troubleshooting

| Problema | Solução |
|----------|---------|
| Login não funciona | Verifique `.env.local`, limpe localStorage |
| Posts não aparecem | Confira `published = true` no Supabase |
| Imagens não carregam | Use URLs HTTPS completas |
| Erros de API | Verifique `SUPABASE_SERVICE_ROLE_KEY` |
| Estilos errados | Rode `npm install` novamente |

## 📞 Próximas Funcionalidades

- [ ] Sistema de comentários
- [ ] Newsletter subscription
- [ ] Social share buttons
- [ ] Dark mode toggle
- [ ] Feed RSS
- [ ] Sitemap XML
- [ ] Analytics
- [ ] Multi-idioma

## 📚 Recursos

- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [React Hooks](https://react.dev)

## 📝 Arquivos Importantes

- `SETUP.md` - Guia completo de setup
- `README_PROJETO.md` - Este arquivo
- `.env.local` - Variáveis de ambiente
- `tailwind.config.ts` - Configuração de estilos

## ✅ Checklist de Lançamento

- [ ] Supabase criado e tabelas inseridas
- [ ] `.env.local` configurado
- [ ] Primeiro post criado
- [ ] Admin acessível
- [ ] Blog público funcionando
- [ ] Testar em mobile
- [ ] Deploy no Vercel/outra plataforma
- [ ] Adicionar a Google Search Console
- [ ] Configurar Google Analytics

## 🎉 Status

```
████████████████████████████████ 100%
```

**Blog pronto para usar!** Comece a criar conteúdo agora! ✨

---

**Dúvidas?** Leia `SETUP.md` para instruções detalhadas.

Feito com ❤️ para Sagrada Magia ✨
