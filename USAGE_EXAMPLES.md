# 💡 Exemplos de Uso - Novas Funcionalidades

## 1. 🔄 Receitas Recorrentes

### Criar Receita Recorrente via Interface

```typescript
// O usuário preenche o formulário e ativa o toggle "Receita Recorrente"
// O sistema automaticamente cria uma receita recorrente mensal

// Exemplo de dados enviados:
{
  title: "Salário",
  amount: 5000.00,
  start_date: "2025-11-20",
  category_id: "uuid-da-categoria",
  account_id: "uuid-da-conta",
  type: "income",
  frequency: "monthly"
}
```

### Criar Receita Recorrente Programaticamente

```typescript
import { createRecurringTransaction } from '@/app/(dashboard)/recurring-actions'

// Salário mensal
await createRecurringTransaction({
  title: "Salário",
  amount: 5000.00,
  start_date: "2025-11-01",
  category_id: "salary-category-id",
  account_id: "main-account-id",
  type: "income",
  frequency: "monthly"
})

// Aluguel recebido (com data de término)
await createRecurringTransaction({
  title: "Aluguel Apartamento",
  amount: 2000.00,
  start_date: "2025-11-05",
  end_date: "2026-11-05", // Contrato de 1 ano
  category_id: "rent-category-id",
  account_id: "main-account-id",
  type: "income",
  frequency: "monthly",
  description: "Aluguel do apartamento na Rua X"
})

// Dividendos trimestrais
await createRecurringTransaction({
  title: "Dividendos PETR4",
  amount: 500.00,
  start_date: "2025-11-15",
  category_id: "investments-category-id",
  account_id: "investment-account-id",
  type: "income",
  frequency: "monthly", // Note: atualmente só suporta monthly, mas pode ser estendido
  description: "Dividendos de ações"
})
```

### Listar Receitas Recorrentes

```typescript
import { getRecurringTransactions } from '@/app/(dashboard)/recurring-actions'

// Listar todas as receitas recorrentes
const { data, count } = await getRecurringTransactions('income')

console.log(`Total de receitas recorrentes: ${count}`)
data.forEach(transaction => {
  console.log(`${transaction.title}: ${transaction.amount} - Próxima: ${transaction.next_occurrence}`)
})
```

### Pausar/Reativar Receita Recorrente

```typescript
import { toggleRecurringTransaction } from '@/app/(dashboard)/recurring-actions'

// Pausar receita recorrente
await toggleRecurringTransaction('transaction-id', false)

// Reativar receita recorrente
await toggleRecurringTransaction('transaction-id', true)
```

### Processar Receitas Recorrentes Manualmente

```typescript
import { processRecurringTransactions } from '@/app/(dashboard)/recurring-actions'

// Processar todas as receitas recorrentes pendentes
await processRecurringTransactions()
```

---

## 2. 🏷️ Categorias

### Criar Categoria via Interface

```typescript
// O usuário clica em "Nova Categoria" no formulário de receita
// Seleciona um ícone e digita o nome
// A categoria é criada e automaticamente selecionada

// Exemplo de dados enviados:
{
  name: "Freelance",
  type: "income",
  icon: "💼"
}
```

### Criar Categoria Programaticamente

```typescript
import { createCategory } from '@/app/(dashboard)/categories/actions'

// Categoria de receita
const result = await createCategory({
  name: "Investimentos",
  type: "income",
  icon: "📈"
})

if (result.success) {
  console.log('Categoria criada:', result.data.id)
}

// Categoria de despesa
await createCategory({
  name: "Alimentação",
  type: "expense",
  icon: "🍔"
})
```

### Listar Categorias

```typescript
import { getCategories } from '@/app/(dashboard)/categories/actions'

// Listar todas as categorias de receita
const { data: incomeCategories } = await getCategories('income')

// Listar todas as categorias de despesa
const { data: expenseCategories } = await getCategories('expense')

// Listar todas as categorias
const { data: allCategories } = await getCategories()
```

### Atualizar Categoria

```typescript
import { updateCategory } from '@/app/(dashboard)/categories/actions'

await updateCategory('category-id', {
  name: "Freelance Web",
  icon: "💻"
})
```

### Deletar Categoria

```typescript
import { deleteCategory } from '@/app/(dashboard)/categories/actions'

await deleteCategory('category-id')
```

---

## 3. 🔔 Toast Notifications

### Usar Toast em Componentes

```typescript
'use client'

import { useToast } from '@/components/ui/toast'

export function MyComponent() {
  const { showToast } = useToast()

  const handleSuccess = () => {
    showToast('Operação realizada com sucesso!', 'success')
  }

  const handleError = () => {
    showToast('Erro ao processar solicitação', 'error')
  }

  const handleWarning = () => {
    showToast('Atenção: Saldo baixo!', 'warning')
  }

  const handleInfo = () => {
    showToast('Nova funcionalidade disponível', 'info')
  }

  return (
    <div>
      <button onClick={handleSuccess}>Sucesso</button>
      <button onClick={handleError}>Erro</button>
      <button onClick={handleWarning}>Aviso</button>
      <button onClick={handleInfo}>Info</button>
    </div>
  )
}
```

### Tipos de Toast

```typescript
// Success (verde)
showToast('Receita criada com sucesso!', 'success')

// Error (vermelho)
showToast('Erro ao salvar dados', 'error')

// Warning (amarelo)
showToast('Atenção: Limite de orçamento atingido', 'warning')

// Info (azul)
showToast('Dica: Você pode criar categorias personalizadas', 'info')
```

---

## 4. 📊 Exemplos de Fluxos Completos

### Fluxo 1: Criar Receita Recorrente com Nova Categoria

```typescript
'use client'

import { useState } from 'react'
import { useToast } from '@/components/ui/toast'
import { createCategory } from '@/app/(dashboard)/categories/actions'
import { createRecurringTransaction } from '@/app/(dashboard)/recurring-actions'

export function CreateRecurringIncomeFlow() {
  const { showToast } = useToast()
  const [categoryId, setCategoryId] = useState('')

  const handleCreateCategoryAndIncome = async () => {
    // 1. Criar categoria
    const categoryResult = await createCategory({
      name: "Consultoria",
      type: "income",
      icon: "💼"
    })

    if (!categoryResult.success) {
      showToast('Erro ao criar categoria', 'error')
      return
    }

    showToast('Categoria criada!', 'success')
    setCategoryId(categoryResult.data.id)

    // 2. Criar receita recorrente
    const incomeResult = await createRecurringTransaction({
      title: "Consultoria Mensal",
      amount: 3000.00,
      start_date: new Date().toISOString().split('T')[0],
      category_id: categoryResult.data.id,
      account_id: "main-account-id",
      type: "income",
      frequency: "monthly"
    })

    if (incomeResult.success) {
      showToast('Receita recorrente criada!', 'success')
    } else {
      showToast('Erro ao criar receita', 'error')
    }
  }

  return (
    <button onClick={handleCreateCategoryAndIncome}>
      Criar Categoria e Receita Recorrente
    </button>
  )
}
```

### Fluxo 2: Dashboard de Receitas Recorrentes

```typescript
'use client'

import { useEffect, useState } from 'react'
import { getRecurringTransactions } from '@/app/(dashboard)/recurring-actions'

export function RecurringIncomeDashboard() {
  const [transactions, setTransactions] = useState([])
  const [totalMonthly, setTotalMonthly] = useState(0)

  useEffect(() => {
    loadRecurringTransactions()
  }, [])

  const loadRecurringTransactions = async () => {
    const { data } = await getRecurringTransactions('income')
    setTransactions(data)

    // Calcular total mensal
    const monthly = data
      .filter(t => t.frequency === 'monthly' && t.is_active)
      .reduce((sum, t) => sum + Number(t.amount), 0)
    
    setTotalMonthly(monthly)
  }

  return (
    <div>
      <h2>Receitas Recorrentes Mensais</h2>
      <p>Total Mensal: R$ {totalMonthly.toFixed(2)}</p>
      
      <ul>
        {transactions.map(t => (
          <li key={t.id}>
            {t.title}: R$ {t.amount} - Próxima: {t.next_occurrence}
            {!t.is_active && ' (Pausada)'}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

---

## 5. 🎯 Casos de Uso Reais

### Caso 1: Freelancer com Múltiplos Clientes

```typescript
// Cliente A - Projeto mensal
await createRecurringTransaction({
  title: "Cliente A - Manutenção Site",
  amount: 1500.00,
  start_date: "2025-11-01",
  category_id: "freelance-category",
  account_id: "business-account",
  type: "income",
  frequency: "monthly"
})

// Cliente B - Projeto trimestral (simular com monthly)
await createRecurringTransaction({
  title: "Cliente B - Consultoria",
  amount: 3000.00,
  start_date: "2025-11-15",
  category_id: "consultancy-category",
  account_id: "business-account",
  type: "income",
  frequency: "monthly"
})
```

### Caso 2: Investidor com Dividendos

```typescript
// Dividendos de ações
await createRecurringTransaction({
  title: "Dividendos VALE3",
  amount: 250.00,
  start_date: "2025-11-10",
  category_id: "dividends-category",
  account_id: "investment-account",
  type: "income",
  frequency: "monthly"
})

// Aluguel de imóvel
await createRecurringTransaction({
  title: "Aluguel Apartamento Centro",
  amount: 2500.00,
  start_date: "2025-11-05",
  category_id: "rent-category",
  account_id: "real-estate-account",
  type: "income",
  frequency: "monthly"
})
```

### Caso 3: Assalariado com Benefícios

```typescript
// Salário
await createRecurringTransaction({
  title: "Salário CLT",
  amount: 5000.00,
  start_date: "2025-11-05",
  category_id: "salary-category",
  account_id: "main-account",
  type: "income",
  frequency: "monthly"
})

// Vale alimentação
await createRecurringTransaction({
  title: "Vale Alimentação",
  amount: 600.00,
  start_date: "2025-11-05",
  category_id: "benefits-category",
  account_id: "main-account",
  type: "income",
  frequency: "monthly"
})
```

---

## 📝 Notas Importantes

1. **Frequência**: Atualmente, o sistema suporta `monthly` por padrão. Para outras frequências, ajuste o código conforme necessário.

2. **Processamento**: Configure um cron job para executar `processRecurringTransactions()` diariamente.

3. **Validação**: Sempre valide os dados antes de criar transações recorrentes.

4. **Toast**: Use toasts para feedback imediato ao usuário, melhorando a UX.

5. **Categorias**: Crie categorias específicas para organizar melhor suas receitas recorrentes.

---

**Dúvidas?** Consulte o arquivo `IMPLEMENTATION_SUMMARY.md` para mais detalhes!
