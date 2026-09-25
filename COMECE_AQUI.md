# 🚀 COMECE AQUI!

Bem-vindo ao **Blog Sagrada Magia**! Este é um projeto **completamente independente** pronto para funcionar.

## ⚡ Setup Rápido (5 minutos)

### Passo 1: Adicione suas credenciais do Supabase

Edite `.env.local` (já existe com placeholders):

```env
# Obtenha esses valores em supabase.com → seu projeto → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Escolha uma senha secreta
JWT_SECRET=sua_senha_super_secreta_123

# Configure seu login
NEXT_PUBLIC_ADMIN_USERNAME=joao
NEXT_PUBLIC_ADMIN_PASSWORD=suasenha123
```

### Passo 2: Crie as tabelas no Supabase

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Abra seu projeto
3. Vá em **SQL Editor**
4. Copie TODO o SQL de `SETUP.md` (seção "Criar Tabelas no Banco")
5. Cole no SQL Editor e execute

### Passo 3: Rode o projeto localmente

```bash
# Se ainda não fez
npm install

# Rodar servidor de desenvolvimento
npm run dev
```

Você verá:
```
> ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Passo 4: Acesse o admin

```
http://localhost:3000/admin/posts
Usuário: joao (ou o que configurou)
Senha: suasenha123 (ou a que configurou)
```

### Passo 5: Crie seu primeiro post!

1. Clique **"+ Novo Post"**
2. Preencha:
   - Título: "Meu Primeiro Post"
   - Autor: "Seu Nome"
   - Resumo: Descrição breve
   - Conteúdo: Escreva algo
3. Marque **"Publicar imediatamente"**
4. Clique **"Criar Post"**

### Passo 6: Veja no blog público

```
http://localhost:3000/blog
```

**Pronto!** Seu blog está funcionando! 🎉

---

## 📚 Próximas Leituras

1. **[SETUP.md](./SETUP.md)** - Guia completo com screenshots
2. **[README_PROJETO.md](./README_PROJETO.md)** - Documentação técnica
3. **[Deploy no Vercel](#deploy-no-vercel)** - Colocar online

---

## 🚀 Deploy no Vercel

### Quick Deploy (se tiver GitHub)

```bash
# 1. Fazer commit
git add .
git commit -m "Setup do blog Sagrada Magia"
git push origin main

# 2. Em vercel.com:
#   - "Add New" → "Project"
#   - Selecione o repositório
#   - "Continue"
#   - Adicione as env vars (mesmas do .env.local)
#   - "Deploy"
```

**Pronto! Seu blog está online!** 🌐

---

## 🆘 Se algo não funcionar

### ❌ Erro: "Cannot connect to Supabase"
→ Verifique `NEXT_PUBLIC_SUPABASE_URL` e chaves no `.env.local`

### ❌ Erro: "Login não funciona"
→ Limpe o localStorage (F12 → Application → Local Storage → Delete all)
→ Tente username/password padrão: `admin` / `admin123`

### ❌ Posts não aparecem
→ Verifique se têm `published = true` no Supabase
→ Vá em Supabase → SQL Editor → `SELECT * FROM blog_posts;`

### ❌ Outro erro?
→ Leia a seção "Troubleshooting" em `README_PROJETO.md`

---

## 📞 URLs Importantes

| O quê | URL |
|-------|-----|
| Blog Público | http://localhost:3000/blog |
| Admin | http://localhost:3000/admin/posts |
| API (posts) | http://localhost:3000/api/posts |
| API (busca) | http://localhost:3000/api/posts/search?q=cristais |

---

## 🎯 Seu Checklist

- [ ] Copiar credenciais Supabase para `.env.local`
- [ ] Criar tabelas SQL no Supabase
- [ ] Rodar `npm install` (se não fez)
- [ ] Rodar `npm run dev`
- [ ] Fazer login em `/admin/posts`
- [ ] Criar primeiro post
- [ ] Ver em `/blog`
- [ ] (Opcional) Deploy no Vercel

---

## 📖 Estrutura do Projeto

```
sagrada-magia-blog/
├── app/admin/          ← Seu admin privado
├── app/blog/           ← Blog público
├── app/api/            ← Rotas de API
├── lib/                ← Código compartilhado
├── .env.local          ← ⭐ CONFIGURE AQUI
├── COMECE_AQUI.md      ← Este arquivo
├── SETUP.md            ← Guia detalhado
└── README_PROJETO.md   ← Documentação técnica
```

---

## 🎨 Personalizar (depois)

- **Cores**: Edite `tailwind.config.ts`
- **Fontes**: Edite `tailwind.config.ts`
- **Categorias**: Edite `lib/categories.ts` ou Supabase
- **Login**: Edite `.env.local`

---

## 💡 Dicas

✅ Use nomes de categoria em português  
✅ Coloque imagens com URL HTTPS  
✅ Escreva resumos atrativos  
✅ Use slugs sem caracteres especiais  
✅ Publique regularmente  

---

## ✨ Pronto!

Você tem um **blog profissional, seguro e pronto para o mundo**.

**Vamos lá!** Publique seu primeiro post agora! 📝✨

---

**Dúvidas?** Leia:
- `SETUP.md` para setup detalhado
- `README_PROJETO.md` para documentação completa

Qualquer coisa, revise os guias `.md` neste diretório!

**Boa sorte!** 🌟
