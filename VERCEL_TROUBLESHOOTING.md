# 🚨 Guia de Solução: Internal Server Error na Vercel

## Problema
Erro "Internal Server Error" ao fazer deploy na Vercel do projeto FinanceX.

## Causas Mais Comuns

### 1. ⚠️ Variáveis de Ambiente Não Configuradas (MAIS COMUM)

**Solução:**
1. Acesse o painel da Vercel: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Adicione as seguintes variáveis (para TODOS os ambientes: Production, Preview, Development):

```
NEXT_PUBLIC_SUPABASE_URL = https://nswkqmamqoeovjspotvs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = [sua chave anon do Supabase]
```

5. Após adicionar, faça um **Redeploy**:
   - Vá em **Deployments**
   - Clique nos 3 pontinhos do último deployment
   - Clique em **Redeploy**

### 2. 🔍 Como Ver os Logs de Erro

Para identificar o erro exato:

1. Vá no painel da Vercel
2. Clique no deployment que falhou
3. Vá em **Build Logs** ou **Function Logs**
4. Procure por mensagens de erro em vermelho

**Erros comuns nos logs:**
- `Error: Missing environment variable` → Faltam variáveis de ambiente
- `Module not found` → Problema com dependências
- `Build failed` → Erro no processo de build

### 3. 🎨 Problema com Tailwind CSS v4

O projeto usa Tailwind CSS v4 (beta), que pode causar problemas. Se os logs mostrarem erro relacionado ao Tailwind:

**Opção A: Adicionar configuração no package.json**
```json
{
  "scripts": {
    "build": "next build",
    "postinstall": "npm run build:css"
  }
}
```

**Opção B: Verificar se o PostCSS está configurado corretamente**
Arquivo `postcss.config.mjs` deve existir com:
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

### 4. 🔧 Verificar Dependências

Execute localmente para garantir que o build funciona:

```bash
npm run build
```

Se der erro local, corrija antes de fazer deploy.

### 5. 📦 Problemas com Node.js Version

A Vercel pode estar usando uma versão diferente do Node.js. Adicione no `package.json`:

```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## Checklist de Verificação

- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Build funciona localmente (`npm run build`)
- [ ] Arquivo `.env.local` existe localmente com as variáveis corretas
- [ ] Logs da Vercel verificados para erro específico
- [ ] Redeploy feito após adicionar variáveis de ambiente

## Como Obter as Variáveis do Supabase

1. Acesse: https://app.supabase.com
2. Selecione seu projeto
3. Vá em **Settings** → **API**
4. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Próximos Passos

1. Configure as variáveis de ambiente na Vercel
2. Faça um redeploy
3. Se o erro persistir, envie os logs de erro para análise detalhada

## Comandos Úteis

```bash
# Testar build localmente
npm run build

# Limpar cache e reinstalar dependências
rm -rf .next node_modules
npm install
npm run build

# Verificar se as variáveis estão carregando
npm run dev
# Abra o console do navegador e digite: console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
```

## Suporte Adicional

Se o problema persistir, compartilhe:
1. Os logs de erro da Vercel (Build Logs e Function Logs)
2. Screenshot do erro
3. Mensagem de erro específica

---

**Última atualização:** 2025-12-01
