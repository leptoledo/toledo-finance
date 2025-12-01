# 📊 Guia de Seed Data - FinanceX

## 🎯 Objetivo
Este guia explica como popular o banco de dados com dados de exemplo para testar todas as funcionalidades do FinanceX.

---

## 📋 Pré-requisitos

1. Ter uma conta criada no FinanceX
2. Acesso ao painel do Supabase
3. Conhecer seu email de login

---

## 🚀 Passo a Passo

### 1️⃣ Obter seu User ID

1. Acesse o **Supabase Dashboard**: https://supabase.com/dashboard
2. Selecione seu projeto **FinanceX**
3. Vá em **SQL Editor** (ícone de banco de dados na sidebar)
4. Execute a seguinte query:

```sql
SELECT id FROM auth.users WHERE email = 'seu-email@example.com';
```

**⚠️ IMPORTANTE:** Substitua `seu-email@example.com` pelo email que você usou para criar sua conta.

5. **Copie o UUID** retornado (algo como: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

---

### 2️⃣ Editar o Script de Seed

1. Abra o arquivo `seed-data.sql` na raiz do projeto
2. Na **linha 11**, substitua `'YOUR_USER_ID_HERE'` pelo UUID que você copiou:

```sql
-- ANTES:
v_user_id uuid := 'YOUR_USER_ID_HERE';

-- DEPOIS (exemplo):
v_user_id uuid := 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
```

---

### 3️⃣ Executar o Script

1. Volte ao **SQL Editor** do Supabase
2. **Cole todo o conteúdo** do arquivo `seed-data.sql`
3. Clique em **Run** (ou pressione `Ctrl/Cmd + Enter`)
4. Aguarde a execução (pode levar alguns segundos)

---

### 4️⃣ Verificar os Dados

Se tudo deu certo, você verá mensagens como:

```
NOTICE: Seed data inserido com sucesso!
NOTICE: Total de categorias: 10
NOTICE: Total de contas: 3
NOTICE: Total de transações: ~60
NOTICE: Total de orçamentos: 5
NOTICE: Total de metas: 5
NOTICE: Total de investimentos: 7
```

---

## 📊 Dados Criados

### ✅ Categorias (10)

**Receitas:**
- 💰 Salário
- 💼 Freelance
- 📈 Investimentos

**Despesas:**
- 🍔 Alimentação
- 🚗 Transporte
- 🏠 Moradia
- 🎮 Lazer
- 💊 Saúde
- 📚 Educação
- 🛒 Compras

---

### ✅ Contas (3)

1. **Conta Corrente** - R$ 5.420,50
2. **Poupança** - R$ 15.000,00
3. **Investimentos** - R$ 32.500,00

**Total:** R$ 52.920,50

---

### ✅ Transações (~60)

- **Período:** Últimos 6 meses + mês atual
- **Receitas mensais:** ~R$ 6.500 - R$ 8.700
- **Despesas mensais:** ~R$ 3.500 - R$ 5.500
- **Padrão realista** com variação mensal

**Exemplos:**
- Salário mensal: R$ 6.500
- Freelances: R$ 800 - R$ 2.200
- Aluguel: R$ 1.500
- Supermercado: R$ 450 - R$ 550
- Gasolina: R$ 280 - R$ 320

---

### ✅ Orçamentos (5)

| Categoria | Limite | Gasto | Status |
|-----------|--------|-------|--------|
| Alimentação | R$ 1.000 | R$ 280 | 28% |
| Transporte | R$ 500 | R$ 150 | 30% |
| Moradia | R$ 1.500 | R$ 1.500 | 100% ⚠️ |
| Lazer | R$ 400 | R$ 0 | 0% |
| Saúde | R$ 300 | R$ 0 | 0% |

---

### ✅ Metas (5)

1. **Fundo de Emergência** 💰
   - Tipo: Poupança
   - Meta: R$ 30.000
   - Atual: R$ 15.000 (50%)
   - Prazo: 8 meses

2. **Viagem para Europa** ✈️
   - Tipo: Poupança
   - Meta: R$ 15.000
   - Atual: R$ 4.500 (30%)
   - Prazo: 6 meses

3. **Carro Novo** 🚗
   - Tipo: Poupança
   - Meta: R$ 25.000
   - Atual: R$ 8.000 (32%)
   - Prazo: 12 meses

4. **Carteira de Investimentos** 📈
   - Tipo: Investimento
   - Meta: R$ 50.000
   - Atual: R$ 32.500 (65%)
   - Prazo: 18 meses

5. **Quitação Cartão** 💳
   - Tipo: Dívida
   - Meta: R$ 5.000
   - Atual: R$ 3.200 (64%)
   - Prazo: 4 meses

---

### ✅ Investimentos (7)

| Ativo | Tipo | Investido | Atual | Retorno |
|-------|------|-----------|-------|---------|
| Tesouro Selic 2027 | Títulos | R$ 10.000 | R$ 10.850 | +8,5% |
| Ações PETR4 | Ações | R$ 5.000 | R$ 6.200 | +24% |
| Ações VALE3 | Ações | R$ 4.000 | R$ 4.800 | +20% |
| Bitcoin | Crypto | R$ 3.000 | R$ 3.850 | +28,3% |
| Ethereum | Crypto | R$ 2.000 | R$ 2.400 | +20% |
| FII HGLG11 | Imóveis | R$ 8.000 | R$ 8.600 | +7,5% |
| CDB Banco XYZ | Títulos | R$ 5.000 | R$ 5.350 | +7% |

**Total Investido:** R$ 37.000  
**Valor Atual:** R$ 42.050  
**Retorno Total:** R$ 5.050 (+13,6%)

---

## 🎨 O que você verá no App

Após executar o seed:

### 📊 Dashboard
- KPIs com valores reais
- Gráfico de fluxo de caixa dos últimos 6 meses
- Insights sobre gastos e receitas

### 💰 Receitas/Despesas
- Histórico completo de transações
- Filtros funcionando
- Resumos por categoria

### 📁 Categorias
- 10 categorias prontas para uso
- Ícones personalizados

### 💵 Orçamentos
- 5 orçamentos configurados
- Barras de progresso
- Alertas de limite

### 🎯 Metas
- 5 metas com diferentes tipos
- Progresso visual
- Prazos definidos

### 📈 Análise
- Gráficos com dados reais
- Tendências mensais
- Distribuição por categoria

### 💼 Investimentos
- 7 investimentos diversos
- Cálculo de rentabilidade
- Resumo da carteira

---

## 🔄 Limpar Dados (Opcional)

Se quiser recomeçar do zero, execute:

```sql
-- CUIDADO! Isso apaga TODOS os seus dados
DELETE FROM investments WHERE user_id = 'SEU_USER_ID';
DELETE FROM goals WHERE user_id = 'SEU_USER_ID';
DELETE FROM budgets WHERE user_id = 'SEU_USER_ID';
DELETE FROM transactions WHERE user_id = 'SEU_USER_ID';
DELETE FROM accounts WHERE user_id = 'SEU_USER_ID';
DELETE FROM categories WHERE user_id = 'SEU_USER_ID';
```

---

## ❓ Problemas Comuns

### Erro: "duplicate key value"
**Solução:** Você já tem dados. Execute o script de limpeza primeiro.

### Erro: "violates foreign key constraint"
**Solução:** Verifique se o `user_id` está correto.

### Nenhum dado aparece no app
**Solução:** 
1. Verifique se o `user_id` está correto
2. Faça logout e login novamente
3. Limpe o cache do navegador (Ctrl+Shift+R)

---

## 🎉 Pronto!

Agora você tem um banco de dados completo para testar todas as funcionalidades do FinanceX!

**Próximos passos:**
1. Explore o Dashboard
2. Adicione novas transações
3. Ajuste orçamentos
4. Atualize o progresso das metas
5. Teste a importação CSV

---

**Desenvolvido com ❤️ para FinanceX**
