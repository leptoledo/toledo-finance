import { createClient } from '@/utils/supabase/server'

export interface Budget {
    id: string
    user_id: string
    category_id: string
    limit_amount: number
    spent_amount: number
    month: number
    year: number
    created_at: string
    category?: {
        id: string
        name: string
        type: string
        icon: string | null
    }
}

export async function getBudgets(month?: number, year?: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return []
    }

    const currentDate = new Date()
    const targetMonth = month || currentDate.getMonth() + 1
    const targetYear = year || currentDate.getFullYear()

    const { data, error } = await supabase
        .from('budgets')
        .select(`
            *,
            category:categories(id, name, type, icon)
        `)
        .eq('user_id', user.id)
        .eq('month', targetMonth)
        .eq('year', targetYear)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching budgets:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
            fullError: error
        })
        return []
    }

    return data as Budget[]
}

export async function getBudgetSummary(month?: number, year?: number) {
    const budgets = await getBudgets(month, year)

    const totalLimit = budgets.reduce((sum, b) => sum + Number(b.limit_amount), 0)
    const totalSpent = budgets.reduce((sum, b) => sum + Number(b.spent_amount), 0)
    const remaining = totalLimit - totalSpent
    const percentageUsed = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0

    return {
        totalLimit,
        totalSpent,
        remaining,
        percentageUsed,
        budgetCount: budgets.length,
        overBudgetCount: budgets.filter(b => Number(b.spent_amount) > Number(b.limit_amount)).length
    }
}
