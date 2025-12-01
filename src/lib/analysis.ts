import { createClient } from '@/utils/supabase/server'

export interface MonthlyData {
    month: string
    income: number
    expenses: number
    balance: number
}

export interface CategoryExpense {
    category: string
    amount: number
    percentage: number
    icon: string | null
}

export interface AnalysisSummary {
    totalIncome: number
    totalExpenses: number
    netBalance: number
    averageMonthlyIncome: number
    averageMonthlyExpenses: number
    savingsRate: number
    topExpenseCategory: CategoryExpense | null
    monthlyTrend: MonthlyData[]
    expensesByCategory: CategoryExpense[]
}

export async function getAnalysisData(months: number = 6): Promise<AnalysisSummary> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return {
            totalIncome: 0,
            totalExpenses: 0,
            netBalance: 0,
            averageMonthlyIncome: 0,
            averageMonthlyExpenses: 0,
            savingsRate: 0,
            topExpenseCategory: null,
            monthlyTrend: [],
            expensesByCategory: []
        }
    }

    // Get date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - months)

    // Fetch transactions
    const { data: transactions } = await supabase
        .from('transactions')
        .select(`
            *,
            category:categories(name, icon)
        `)
        .eq('user_id', user.id)
        .gte('date', startDate.toISOString())
        .lte('date', endDate.toISOString())
        .order('date', { ascending: true })

    if (!transactions || transactions.length === 0) {
        return {
            totalIncome: 0,
            totalExpenses: 0,
            netBalance: 0,
            averageMonthlyIncome: 0,
            averageMonthlyExpenses: 0,
            savingsRate: 0,
            topExpenseCategory: null,
            monthlyTrend: [],
            expensesByCategory: []
        }
    }

    // Calculate totals
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0)

    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0)

    const netBalance = totalIncome - totalExpenses

    // Calculate monthly trend
    const monthlyMap = new Map<string, { income: number; expenses: number }>()

    transactions.forEach(t => {
        const date = new Date(t.date)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

        if (!monthlyMap.has(monthKey)) {
            monthlyMap.set(monthKey, { income: 0, expenses: 0 })
        }

        const monthData = monthlyMap.get(monthKey)!
        if (t.type === 'income') {
            monthData.income += Number(t.amount)
        } else {
            monthData.expenses += Number(t.amount)
        }
    })

    const monthlyTrend: MonthlyData[] = Array.from(monthlyMap.entries())
        .map(([month, data]) => ({
            month,
            income: data.income,
            expenses: data.expenses,
            balance: data.income - data.expenses
        }))
        .sort((a, b) => a.month.localeCompare(b.month))

    // Calculate expenses by category
    const categoryMap = new Map<string, { amount: number; icon: string | null }>()

    transactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
            const categoryName = t.category?.name || 'Sem Categoria'
            const categoryIcon = t.category?.icon || null

            if (!categoryMap.has(categoryName)) {
                categoryMap.set(categoryName, { amount: 0, icon: categoryIcon })
            }

            categoryMap.get(categoryName)!.amount += Number(t.amount)
        })

    const expensesByCategory: CategoryExpense[] = Array.from(categoryMap.entries())
        .map(([category, data]) => ({
            category,
            amount: data.amount,
            percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0,
            icon: data.icon
        }))
        .sort((a, b) => b.amount - a.amount)

    const topExpenseCategory = expensesByCategory[0] || null

    // Calculate averages
    const monthCount = monthlyTrend.length || 1
    const averageMonthlyIncome = totalIncome / monthCount
    const averageMonthlyExpenses = totalExpenses / monthCount
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

    return {
        totalIncome,
        totalExpenses,
        netBalance,
        averageMonthlyIncome,
        averageMonthlyExpenses,
        savingsRate,
        topExpenseCategory,
        monthlyTrend,
        expensesByCategory
    }
}
