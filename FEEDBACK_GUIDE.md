# Sistema de Feedback - Guia Completo

## 📍 Onde os Feedbacks São Armazenados

Quando um usuário envia um feedback, ele é salvo em **3 lugares**:

### 1. **Banco de Dados Supabase** 
- **Tabela**: `feedback`
- **Localização**: Dashboard do Supabase → Database → Tables → feedback
- **Campos armazenados**:
  - `id` - ID único do feedback
  - `user_id` - ID do usuário que enviou
  - `title` - Título do problema
  - `description` - Descrição detalhada
  - `image_url` - URL da imagem (se anexada)
  - `status` - Status atual (pending, in_progress, resolved, closed)
  - `priority` - Prioridade (low, medium, high, critical)
  - `created_at` - Data de criação
  - `updated_at` - Data da última atualização

### 2. **Storage do Supabase** (Imagens)
- **Bucket**: `feedback-images`
- **Localização**: Dashboard do Supabase → Storage → feedback-images
- **Estrutura**: `{user_id}/{timestamp}.{extensão}`

### 3. **Logs do Console**
- Cada feedback criado gera um log no console com informações básicas
- Visível nos logs do Supabase ou no terminal do servidor

---

## 🔐 Como Acessar os Feedbacks

### Opção 1: Página Admin (Recomendado)
1. Acesse: `https://seu-dominio.com/admin/feedback`
2. **Requisito**: Seu email deve estar na lista de admins
3. **Configuração**: Edite o arquivo `/src/app/(dashboard)/admin/feedback/actions.ts`
   ```typescript
   const adminEmails = ['seu-email@example.com'] // Adicione seu email aqui
   ```

**Funcionalidades da página admin:**
- ✅ Ver todos os feedbacks de todos os usuários
- ✅ Filtrar por status e prioridade
- ✅ Alterar status dos feedbacks
- ✅ Ver capturas de tela em tela cheia
- ✅ Ver informações do usuário que enviou

### Opção 2: Dashboard do Supabase
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Database** → **Tables** → **feedback**
4. Visualize todos os registros diretamente

### Opção 3: SQL Query
Execute queries SQL diretamente no Supabase:
```sql
-- Ver todos os feedbacks
SELECT 
  f.*,
  p.first_name,
  p.last_name,
  p.email
FROM feedback f
LEFT JOIN profiles p ON f.user_id = p.id
ORDER BY f.created_at DESC;

-- Ver apenas feedbacks pendentes
SELECT * FROM feedback 
WHERE status = 'pending' 
ORDER BY priority DESC, created_at DESC;

-- Ver feedbacks críticos
SELECT * FROM feedback 
WHERE priority = 'critical' 
ORDER BY created_at DESC;
```

---

## 📧 Como Receber Notificações por Email

### Método 1: Webhooks do Supabase (Recomendado)
1. Acesse: Dashboard Supabase → Database → Webhooks
2. Crie um novo webhook:
   - **Table**: `feedback`
   - **Events**: `INSERT`
   - **Type**: `HTTP Request`
   - **URL**: Use um serviço como Zapier, Make.com ou n8n

### Método 2: Integração com Resend
1. Instale o Resend:
   ```bash
   npm install resend
   ```

2. Adicione sua API key no `.env.local`:
   ```env
   RESEND_API_KEY=re_seu_api_key_aqui
   ```

3. Descomente o código em `/src/app/(dashboard)/feedback/actions.ts` (linhas 72-97)

4. Substitua `'seu-email@example.com'` pelo seu email real

### Método 3: Edge Function do Supabase
Crie uma Edge Function que envia email quando um novo feedback é inserido:

```typescript
// supabase/functions/notify-feedback/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { record } = await req.json()
  
  // Enviar email usando Resend, SendGrid, etc.
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'FinanceX <noreply@seudominio.com>',
      to: 'seu-email@example.com',
      subject: `Novo Feedback: ${record.title}`,
      html: `
        <h2>Novo feedback recebido</h2>
        <p><strong>Título:</strong> ${record.title}</p>
        <p><strong>Prioridade:</strong> ${record.priority}</p>
        <p><strong>Descrição:</strong> ${record.description}</p>
      `
    })
  })

  return new Response('OK')
})
```

---

## 🔔 Notificações em Tempo Real

### Opção 1: Supabase Realtime
Adicione um listener em tempo real na página admin:

```typescript
const channel = supabase
  .channel('feedback-changes')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'feedback' },
    (payload) => {
      console.log('Novo feedback:', payload.new)
      // Mostrar notificação no navegador
      new Notification('Novo Feedback', {
        body: payload.new.title
      })
    }
  )
  .subscribe()
```

### Opção 2: Telegram Bot
Configure um bot do Telegram para receber notificações instantâneas.

---

## 📊 Estatísticas Úteis

### Ver total de feedbacks por status:
```sql
SELECT status, COUNT(*) as total
FROM feedback
GROUP BY status;
```

### Ver feedbacks dos últimos 7 dias:
```sql
SELECT *
FROM feedback
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

### Ver usuários que mais enviam feedback:
```sql
SELECT 
  p.first_name,
  p.last_name,
  COUNT(f.id) as total_feedbacks
FROM feedback f
JOIN profiles p ON f.user_id = p.id
GROUP BY p.id, p.first_name, p.last_name
ORDER BY total_feedbacks DESC;
```

---

## 🎯 Próximos Passos

1. **Configure seu email** nos arquivos de admin
2. **Escolha um método de notificação** (webhook, Resend, etc.)
3. **Teste o sistema** enviando um feedback de teste
4. **Acesse a página admin** para gerenciar feedbacks

---

## 📝 Notas Importantes

- ⚠️ **Segurança**: Apenas emails na lista `adminEmails` podem acessar `/admin/feedback`
- 🔒 **RLS**: Row Level Security está ativado - usuários só veem seus próprios feedbacks
- 📸 **Imagens**: São públicas no bucket `feedback-images`
- 🗄️ **Backup**: Todos os dados estão no Supabase com backup automático

---

## 🆘 Suporte

Se tiver dúvidas, consulte:
- [Documentação do Supabase](https://supabase.com/docs)
- [Resend Docs](https://resend.com/docs)
- [Webhooks do Supabase](https://supabase.com/docs/guides/database/webhooks)
