'use server'

import { createClient } from '@/utils/supabase/server'
import { RecurringTransaction } from '@/app/(dashboard)/recurring-actions'

export async function getDashboardData() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return null
    }

    const now = new Date()
    // Show last month, current month, and next month for better context
    // Ideally user could pick range, but let's broaden the default view
    const startViewDate = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
    const endViewDate = new Date(now.getFullYear(), now.getMonth() + 2, 0).toISOString()

    // For KPI cards (Current Month only)
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

    // 3. Calculate Total Balance (Sum of all accounts + all previous transactions if not using initial balance)
    // Assuming 'accounts' table has a 'balance' column which is the current real balance.
    // If not, we might need to sum 'transactions'. 
    // Checking schema from previous context: 'accounts' has 'initial_balance'.
    // So Total Balance = Sum(accounts.initial_balance) + Sum(all_transactions_income) - Sum(all_transactions_expense)

    // Fetch all accounts
    const { data: accounts } = await supabase
        .from('accounts')
        .select('initial_balance')
        .eq('user_id', user.id)

    const initialBalanceSum = accounts?.reduce((acc, curr) => acc + Number(curr.initial_balance), 0) || 0

    // Fetch ALL-TIME totals for balance calculation
    // This can be heavy for large datasets. Optimization: Use a postgres function or materialised view.
    // For now, let's trust the 'transactions' sum.
    const { data: allTransactionsAgg } = await supabase
        .from('transactions')
        .select('amount, type')
        .eq('user_id', user.id)
        .lte('date', new Date().toISOString()) // Only count past/current transactions for current balance

    let allTimeIncome = 0
    let allTimeExpense = 0
    allTransactionsAgg?.forEach(t => {
        if (t.type === 'income') allTimeIncome += Number(t.amount)
        if (t.type === 'expense') allTimeExpense += Number(t.amount)
    })

    const totalBalance = initialBalanceSum + allTimeIncome - allTimeExpense

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

    // 5. Fetch Monthly Cash Flow (Last 6 months + Next 6 months Projections)
    // We want to show a broad view.

    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString()
    const sixMonthsFuture = new Date(now.getFullYear(), now.getMonth() + 6, 0).toISOString()

    const { data: rangeTransactions } = await supabase
        .from('transactions')
        .select('amount, type, date')
        .eq('user_id', user.id)
        .gte('date', sixMonthsAgo)
        .lte('date', sixMonthsFuture)
        .order('date', { ascending: true })

    // Group by month
    const monthlyDataMap = new Map<string, { name: string, receita: number, despesa: number }>()

    // Initialize range (-5 to +5 months)
    for (let i = -5; i <= 5; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
        const monthName = d.toLocaleString('pt-BR', { month: 'short' })
        const year = d.getFullYear()

        // Key format: YYYY-MM
        const key = `${year}-${d.getMonth()}`
        // Display format: MMM/YY (e.g. Jan/24)
        const displayName = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)}`

        monthlyDataMap.set(key, { name: displayName, receita: 0, despesa: 0 })
    }

    rangeTransactions?.forEach(t => {
        const d = new Date(t.date) // This date might be in UTC
        // Use getUTCMonth if dates are stored as YYYY-MM-DD (UTC midnight) to avoid timezone shifts
        // Assuming standard behavior
        const key = `${d.getFullYear()}-${d.getMonth()}`

        if (monthlyDataMap.has(key)) {
            const entry = monthlyDataMap.get(key)!
            if (t.type === 'income') entry.receita += Number(t.amount)
            if (t.type === 'expense') entry.despesa += Number(t.amount)
        }
    })

    // FETCH RECURRING TRANSACTIONS FOR PROJECTION
    const { data: recurringOpsData } = await supabase
        .from('recurring_transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)

    const recurringOps = recurringOpsData as RecurringTransaction[] | null

    if (recurringOps && recurringOps.length > 0) {
        // Simple projection: just add them to future months
        // Start from tomorrow
        const projectionStart = new Date()
        const projectionEnd = new Date(now.getFullYear(), now.getMonth() + 6, 0)

        recurringOps.forEach(op => {
            let nextDate = new Date(op.next_occurrence)
            // Fix timezone issue by adding some hours if needed, but let's assume it's correct date string

            // While next occurrence is within our projection window
            while (nextDate <= projectionEnd) {
                const key = `${nextDate.getFullYear()}-${nextDate.getMonth()}`

                // Only add if we haven't already passed this month in "real" transactions 
                // (This is tricky. We should only add if it's in the future compared to Today)
                if (nextDate > now && monthlyDataMap.has(key)) {
                    const entry = monthlyDataMap.get(key)!
                    if (op.type === 'income') entry.receita += Number(op.amount)
                    if (op.type === 'expense') entry.despesa += Number(op.amount)
                }

                // Advance date
                if (op.frequency === 'daily') nextDate.setDate(nextDate.getDate() + 1)
                else if (op.frequency === 'weekly') nextDate.setDate(nextDate.getDate() + 7)
                else if (op.frequency === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1)
                else if (op.frequency === 'yearly') nextDate.setFullYear(nextDate.getFullYear() + 1)
            }
        })
    }

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
    // Re-using the monthlyData which now includes projections
    const monthlyComparisonData = monthlyData.slice(0, 6).map(month => ({
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
