# 🚀 Guia Rápido: Aplicar Migration de Receitas Recorrentes

## Opção 1: Usando Supabase Dashboard (Recomendado)

### Passo a Passo:

1. **Acesse o Supabase Dashboard**
   - Vá para: https://supabase.com/dashboard
   - Selecione seu projeto

2. **Navegue até SQL Editor**
   - No menu lateral, clique em "SQL Editor"
   - Clique em "New query"

3. **Cole o SQL da Migration**
   - Abra o arquivo: `supabase/migrations/001_add_recurring_transactions.sql`
   - Copie todo o conteúdo
   - Cole no SQL Editor

4. **Execute a Migration**
   - Clique em "Run" (ou pressione Ctrl/Cmd + Enter)
   - Aguarde a confirmação de sucesso

5. **Verifique a Criação**
   - Vá para "Table Editor"
   - Procure pela tabela `recurring_transactions`
   - Verifique se as colunas foram criadas corretamente

---

## Opção 2: Usando Supabase CLI

### Pré-requisitos:
```bash
# Instalar Supabase CLI (se ainda não tiver)
npm install -g supabase

# Login no Supabase
supabase login
```

### Comandos:
```bash
# 1. Inicializar Supabase no projeto (se ainda não fez)
cd /Users/leandrotoledo/Sistemas/leptoledo~finance/finance-app
supabase init

# 2. Link com seu projeto remoto
supabase link --project-ref YOUR_PROJECT_REF

# 3. Aplicar a migration
supabase db push

# Ou aplicar migration específica
supabase migration up
```

---

## ✅ Verificação

Após aplicar a migration, execute este SQL para verificar:

```sql
-- Verificar se a tabela foi criada
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'recurring_transactions';

-- Verificar colunas
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'recurring_transactions';

-- Verificar funções
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name IN ('calculate_next_occurrence', 'process_recurring_transactions');
```

---

## 🧪 Teste Rápido

Após aplicar a migration, teste criando uma receita recorrente:

```sql
-- Inserir uma receita recorrente de teste
INSERT INTO recurring_transactions (
    user_id,
    account_id,
    category_id,
    type,
    title,
    amount,
    frequency,
    start_date,
    next_occurrence,
    is_active
) VALUES (
    'YOUR_USER_ID',
    'YOUR_ACCOUNT_ID',
    'YOUR_CATEGORY_ID',
    'income',
    'Salário Mensal',
    5000.00,
    'monthly',
    CURRENT_DATE,
    CURRENT_DATE,
    true
);

-- Verificar se foi criado
SELECT * FROM recurring_transactions;
```

---

## ⚠️ Troubleshooting

### Erro: "permission denied"
- Certifique-se de estar logado como admin no Supabase
- Verifique se tem permissões para criar tabelas

### Erro: "function already exists"
- A migration já foi aplicada anteriormente
- Pode ignorar ou fazer rollback primeiro

### Erro: "relation already exists"
- A tabela já existe
- Verifique se não aplicou a migration duas vezes

---

## 📝 Rollback (se necessário)

Se precisar reverter a migration:

```sql
-- Remover trigger
DROP TRIGGER IF EXISTS update_recurring_transactions_updated_at ON recurring_transactions;

-- Remover funções
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS process_recurring_transactions();
DROP FUNCTION IF EXISTS calculate_next_occurrence(DATE, TEXT);

-- Remover tabela
DROP TABLE IF EXISTS recurring_transactions;
```

---

## 🎯 Próximo Passo

Após aplicar a migration com sucesso:

1. ✅ Reinicie o servidor de desenvolvimento
2. ✅ Teste criar uma receita recorrente pela interface
3. ✅ Verifique os toasts de sucesso
4. ✅ Configure um cron job para processar receitas recorrentes automaticamente

---

**Dúvidas?** Consulte a documentação do Supabase: https://supabase.com/docs
