'use server'

import { createClient } from '@/utils/supabase/server'

export async function getDashboardData() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return null
    }

    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()

    // 1. Fetch Profile (for currency)
    const { data: profile } = await supabase
        .from('profiles')
        .select('currency')
        .eq('id', user.id)
        .single()

    const currency = profile?.currency || 'BRL'

    // 2. Fetch Income & Expenses for current month
    const { data: transactions } = await supabase
        .from('transactions')
        .select('amount, type, date')
        .eq('user_id', user.id)
        .gte('date', firstDayOfMonth)
        .lte('date', lastDayOfMonth)

    let totalIncome = 0
    let totalExpense = 0

    transactions?.forEach(t => {
        if (t.type === 'income') totalIncome += Number(t.amount)
        if (t.type === 'expense') totalExpense += Number(t.amount)
    })

    // 3. Fetch Consolidated Balance (Sum of all accounts)
    const { data: accounts } = await supabase
        .from('accounts')
        .select('balance')
        .eq('user_id', user.id)

    const totalBalance = accounts?.reduce((acc, curr) => acc + Number(curr.balance), 0) || 0

    // 4. Fetch Active Goals
    const { data: goals } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .lt('progress_percent', 100)
        .order('deadline', { ascending: true })
        .limit(3)

    const { count: totalGoalsCount } = await supabase
        .from('goals')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .lt('progress_percent', 100)

    // 5. Fetch Monthly Cash Flow (Last 6 months) - Mocked for now or complex query
    // For simplicity, we'll return empty data for the chart if no real data exists, 
    // but let's try to fetch last 6 months transactions to group them.

    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString()

    const { data: historyTransactions } = await supabase
        .from('transactions')
        .select('amount, type, date')
        .eq('user_id', user.id)
        .gte('date', sixMonthsAgo)
        .order('date', { ascending: true })

    // Group by month
    const monthlyDataMap = new Map<string, { name: string, receita: number, despesa: number }>()

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthName = d.toLocaleString('default', { month: 'short' })
        const key = `${d.getFullYear()}-${d.getMonth()}`
        monthlyDataMap.set(key, { name: monthName, receita: 0, despesa: 0 })
    }

    historyTransactions?.forEach(t => {
        const d = new Date(t.date)
        const key = `${d.getFullYear()}-${d.getMonth()}`
        if (monthlyDataMap.has(key)) {
            const entry = monthlyDataMap.get(key)!
            if (t.type === 'income') entry.receita += Number(t.amount)
            if (t.type === 'expense') entry.despesa += Number(t.amount)
        }
    })

    const monthlyData = Array.from(monthlyDataMap.values())

    // 6. Fetch Expenses by Category (current month)
    const { data: expensesByCategory } = await supabase
        .from('transactions')
        .select(`
            amount,
            category:categories(name, icon)
        `)
        .eq('user_id', user.id)
        .eq('type', 'expense')
        .gte('date', firstDayOfMonth)
        .lte('date', lastDayOfMonth)

    const categoryMap = new Map<string, { name: string, value: number, icon?: string }>()

    expensesByCategory?.forEach((t: any) => {
        const category = Array.isArray(t.category) ? t.category[0] : t.category
        const categoryName = category?.name || 'Sem categoria'
        const categoryIcon = category?.icon || ''

        if (categoryMap.has(categoryName)) {
            categoryMap.get(categoryName)!.value += Number(t.amount)
        } else {
            categoryMap.set(categoryName, {
                name: categoryName,
                value: Number(t.amount),
                icon: categoryIcon
            })
        }
    })

    const expensesByCategoryData = Array.from(categoryMap.values())
        .sort((a, b) => b.value - a.value)

    // 7. Monthly Comparison Data (last 6 months with balance)
    const monthlyComparisonData = monthlyData.map(month => ({
        month: month.name,
        receita: month.receita,
        despesa: month.despesa,
        saldo: month.receita - month.despesa
    }))

    // 8. Balance Evolution (daily for last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

    const { data: recentTransactions } = await supabase
        .from('transactions')
        .select('amount, type, date')
        .eq('user_id', user.id)
        .gte('date', thirtyDaysAgo)
        .order('date', { ascending: true })

    // Calculate running balance
    let runningBalance = totalBalance
    const balanceByDate = new Map<string, number>()

    // Start with current balance and work backwards
    recentTransactions?.reverse().forEach(t => {
        const dateStr = new Date(t.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
        const amount = Number(t.amount)

        if (t.type === 'income') {
            runningBalance -= amount
        } else {
            runningBalance += amount
        }

        balanceByDate.set(dateStr, runningBalance)
    })

    // Add current balance
    const todayStr = now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    balanceByDate.set(todayStr, totalBalance)

    const balanceEvolutionData = Array.from(balanceByDate.entries())
        .reverse()
        .map(([date, saldo]) => ({ date, saldo }))

    return {
        currency,
        financials: {
            totalIncome,
            totalExpense,
            totalBalance,
        },
        goals: {
            active: goals || [],
            totalCount: totalGoalsCount || 0
        },
        chartData: monthlyData,
        expensesByCategoryData,
        monthlyComparisonData,
        balanceEvolutionData
    }
}
