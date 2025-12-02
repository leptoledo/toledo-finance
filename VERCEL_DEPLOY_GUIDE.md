# 🚀 Guia Completo de Deploy na Vercel

## Pré-requisitos

- [ ] Conta no GitHub
- [ ] Conta na Vercel (pode criar com GitHub)
- [ ] Projeto Supabase configurado e rodando
- [ ] Código commitado no GitHub

## Passo 1: Preparar o Repositório GitHub

### 1.1 Inicializar Git (se ainda não foi feito)

```bash
git init
git add .
git commit -m "Initial commit - Finance App"
```

### 1.2 Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Nome do repositório: `finance-app` (ou o nome que preferir)
3. Deixe como **Private** (recomendado para apps pessoais)
4. **NÃO** inicialize com README, .gitignore ou license
5. Clique em **Create repository**

### 1.3 Conectar e Fazer Push

```bash
# Substitua 'seu-usuario' pelo seu username do GitHub
git remote add origin https://github.com/seu-usuario/finance-app.git
git branch -M main
git push -u origin main
```

## Passo 2: Deploy na Vercel

### 2.1 Acessar Vercel

1. Acesse: https://vercel.com
2. Clique em **Sign Up** ou **Login**
3. Escolha **Continue with GitHub**
4. Autorize a Vercel a acessar seus repositórios

### 2.2 Importar Projeto

1. No dashboard da Vercel, clique em **Add New** → **Project**
2. Encontre o repositório `finance-app` na lista
3. Clique em **Import**

### 2.3 Configurar Projeto

**Framework Preset:** Next.js (deve ser detectado automaticamente)

**Root Directory:** `./` (deixe como está)

**Build Command:** `npm run build` (padrão)

**Output Directory:** `.next` (padrão)

**Install Command:** `npm install` (padrão)

### 2.4 Configurar Variáveis de Ambiente ⚠️ IMPORTANTE

Antes de fazer o deploy, clique em **Environment Variables** e adicione:

```
NEXT_PUBLIC_SUPABASE_URL
```
Valor: Sua URL do Supabase (ex: `https://nswkqmamqoeovjspotvs.supabase.co`)

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Valor: Sua chave anon do Supabase

**Como obter essas variáveis:**
1. Acesse: https://app.supabase.com
2. Selecione seu projeto
3. Vá em **Settings** → **API**
4. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Importante:** Marque as 3 opções (Production, Preview, Development)

### 2.5 Deploy

1. Clique em **Deploy**
2. Aguarde o build (leva ~2-5 minutos)
3. ✅ Quando terminar, você verá "Congratulations!"

## Passo 3: Configurar Supabase para Aceitar a URL da Vercel

### 3.1 Adicionar URL Autorizada no Supabase

1. Acesse: https://app.supabase.com
2. Selecione seu projeto
3. Vá em **Authentication** → **URL Configuration**
4. Em **Site URL**, adicione a URL da Vercel (ex: `https://finance-app.vercel.app`)
5. Em **Redirect URLs**, adicione:
   ```
   https://finance-app.vercel.app/auth/callback
   https://finance-app.vercel.app/**
   ```
6. Clique em **Save**

## Passo 4: Testar o Deploy

1. Acesse a URL fornecida pela Vercel (ex: `https://finance-app.vercel.app`)
2. Teste o login/registro
3. Verifique se as funcionalidades estão funcionando

## Passo 5: Configurar Domínio Personalizado (Opcional)

### 5.1 Adicionar Domínio

1. No painel da Vercel, vá em **Settings** → **Domains**
2. Clique em **Add**
3. Digite seu domínio (ex: `meufinance.com`)
4. Siga as instruções para configurar DNS

### 5.2 Atualizar Supabase

Após configurar o domínio, atualize as URLs no Supabase (Passo 3.1) com seu novo domínio.

## Comandos Úteis

### Atualizar o Deploy

Sempre que você fizer mudanças no código:

```bash
git add .
git commit -m "Descrição das mudanças"
git push
```

A Vercel fará o deploy automaticamente! 🎉

### Forçar Redeploy

Se precisar fazer redeploy sem mudanças no código:

1. Vá em **Deployments** no painel da Vercel
2. Clique nos 3 pontinhos do último deployment
3. Clique em **Redeploy**

### Ver Logs de Erro

1. Vá em **Deployments**
2. Clique no deployment
3. Vá em **Build Logs** ou **Function Logs**

## Troubleshooting

### ❌ Internal Server Error

**Causa mais comum:** Variáveis de ambiente não configuradas

**Solução:**
1. Vá em **Settings** → **Environment Variables**
2. Verifique se `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão configuradas
3. Faça um redeploy

### ❌ Erro de Autenticação

**Causa:** URL não autorizada no Supabase

**Solução:**
1. Adicione a URL da Vercel nas **Redirect URLs** do Supabase (Passo 3.1)

### ❌ Build Failed

**Solução:**
1. Teste o build localmente: `npm run build`
2. Corrija os erros que aparecerem
3. Faça commit e push das correções

## Recursos Adicionais

- **Documentação Vercel:** https://vercel.com/docs
- **Documentação Next.js:** https://nextjs.org/docs
- **Documentação Supabase:** https://supabase.com/docs

## Checklist Final

- [ ] Código no GitHub
- [ ] Projeto importado na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado com sucesso
- [ ] URLs autorizadas no Supabase
- [ ] Login/registro funcionando
- [ ] Todas as funcionalidades testadas

---

**Última atualização:** 2025-12-02

✨ **Parabéns! Seu app está no ar!** ✨
