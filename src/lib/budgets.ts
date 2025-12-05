import { createClient } from '@/utils/supabase/server'

export interface Budget {
    id: string
    user_id: string
    type: 'income' | 'expense'
    period: 'daily' | 'weekly' | 'monthly' | 'yearly'
    category_id: string
    name: string
    description: string | null
    limit_amount: number
    spent_amount?: number
    due_date: string | null
    created_at: string
    category?: {
        id: string
        name: string
        type: string
        icon: string | null
    }
}

export async function getBudgets() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return []
    }

    const { data, error } = await supabase
        .from('budgets')
        .select(`
            *,
            category:categories(id, name, type, icon)
        `)
        .eq('user_id', user.id)
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

export async function getBudgetSummary() {
    const budgets = await getBudgets()

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
