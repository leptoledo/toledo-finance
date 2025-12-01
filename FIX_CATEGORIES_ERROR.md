# 🛠️ Correção do Erro: Coluna 'is_default' não encontrada

O erro que você está vendo (`Could not find the 'is_default' column...`) acontece porque o banco de dados está desatualizado em relação ao código. A tabela `categories` precisa de uma coluna chamada `is_default` que foi adicionada recentemente ao esquema.

## ✅ Como Resolver

### Opção 1: Usando Supabase Dashboard (Mais Rápido)

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard).
2. Vá para o **SQL Editor**.
3. Clique em **New Query**.
4. Cole o seguinte código SQL:

```sql
-- Adicionar coluna is_default se não existir
ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT FALSE;

-- Atualizar política de segurança para permitir ver categorias padrão
DROP POLICY IF EXISTS "Users can view their own categories or defaults" ON categories;
CREATE POLICY "Users can view their own categories or defaults" ON categories
  FOR SELECT USING (auth.uid() = user_id OR is_default = TRUE);
```

5. Clique em **Run**.

### Opção 2: Usando a Migration Criada

Eu criei um arquivo de migration em `supabase/migrations/002_add_is_default_to_categories.sql`. Se você estiver usando a CLI do Supabase:

```bash
supabase db push
```

---

## 🔄 Após aplicar a correção

1. Reinicie o servidor de desenvolvimento (`npm run dev`).
2. Tente criar a categoria novamente.
3. O erro deve desaparecer! 🚀
