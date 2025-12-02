# ✅ Checklist de Deploy - Finance App

## Status Atual
- ✅ Código no GitHub: `https://github.com/leptoledo/toledo-finance`
- ✅ Build local funcionando
- ✅ Guias de deploy criados

## Próximos Passos

### 1️⃣ Preparar Variáveis de Ambiente do Supabase

Antes de fazer o deploy, você precisa ter em mãos:

**NEXT_PUBLIC_SUPABASE_URL**
- Acesse: https://app.supabase.com
- Selecione seu projeto: `meta-finance` (ID: jgdgewhbhpeoqmbreggi)
- Vá em **Settings** → **API**
- Copie o **Project URL**

**NEXT_PUBLIC_SUPABASE_ANON_KEY**
- No mesmo local acima
- Copie a **anon/public key**

💡 **Dica:** Anote essas informações em um local seguro, você vai precisar delas na Vercel!

---

### 2️⃣ Fazer Deploy na Vercel

#### A. Acessar Vercel
1. Acesse: https://vercel.com
2. Faça login com GitHub
3. Clique em **Add New** → **Project**

#### B. Importar Projeto
1. Procure por `toledo-finance` na lista de repositórios
2. Clique em **Import**

#### C. Configurar Variáveis de Ambiente ⚠️ CRÍTICO
Antes de clicar em Deploy, adicione as variáveis:

```
Nome: NEXT_PUBLIC_SUPABASE_URL
Valor: [cole aqui a URL do Supabase]
Ambientes: ✅ Production ✅ Preview ✅ Development
```

```
Nome: NEXT_PUBLIC_SUPABASE_ANON_KEY
Valor: [cole aqui a chave anon do Supabase]
Ambientes: ✅ Production ✅ Preview ✅ Development
```

#### D. Deploy
1. Clique em **Deploy**
2. Aguarde 2-5 minutos
3. ✅ Pronto! Anote a URL gerada (ex: `https://toledo-finance.vercel.app`)

---

### 3️⃣ Configurar Supabase para Aceitar a URL da Vercel

1. Acesse: https://app.supabase.com
2. Selecione seu projeto: `meta-finance`
3. Vá em **Authentication** → **URL Configuration**
4. Em **Site URL**, cole a URL da Vercel
5. Em **Redirect URLs**, adicione:
   ```
   https://[sua-url].vercel.app/auth/callback
   https://[sua-url].vercel.app/**
   ```
6. Clique em **Save**

---

### 4️⃣ Testar o Aplicativo

1. Acesse a URL da Vercel
2. Teste o registro de um novo usuário
3. Teste o login
4. Navegue pelas páginas principais:
   - Dashboard
   - Receitas
   - Despesas
   - Orçamentos
   - Categorias
   - Feedback

---

## Troubleshooting Rápido

### ❌ Internal Server Error
→ Verifique se as variáveis de ambiente foram configuradas corretamente na Vercel
→ Faça um **Redeploy** (Deployments → 3 pontinhos → Redeploy)

### ❌ Erro de Autenticação
→ Verifique se adicionou a URL da Vercel nas **Redirect URLs** do Supabase

### ❌ Página em branco
→ Abra o Console do navegador (F12) e veja os erros
→ Verifique os **Function Logs** na Vercel

---

## Recursos

- 📖 **Guia Completo:** `VERCEL_DEPLOY_GUIDE.md`
- 🔧 **Troubleshooting:** `VERCEL_TROUBLESHOOTING.md`
- 🌐 **Repositório:** https://github.com/leptoledo/toledo-finance
- 🗄️ **Supabase:** https://app.supabase.com/project/jgdgewhbhpeoqmbreggi

---

## Comandos Úteis

### Atualizar o deploy após mudanças
```bash
git add .
git commit -m "Descrição das mudanças"
git push
```
A Vercel fará deploy automático! 🚀

### Testar build localmente
```bash
npm run build
```

---

**Última atualização:** 2025-12-02

🎉 **Boa sorte com o deploy!**
