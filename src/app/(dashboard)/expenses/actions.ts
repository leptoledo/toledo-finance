'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

interface ExpenseFilters {
    search?: string
    categoryId?: string
    startDate?: string
    endDate?: string
    minAmount?: number
    maxAmount?: number
}

export async function getExpenseTransactions(page = 1, pageSize = 10, filters: ExpenseFilters = {}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { data: [], count: 0, totalAmount: 0 }

    // Base query builder
    const buildQuery = () => {
        let query = supabase
            .from('transactions')
            .select(`
                *,
                category:categories!category_id(name, icon, type)
            `, { count: 'exact' })
            .eq('user_id', user.id)
            .eq('type', 'expense')
            .order('date', { ascending: false })

        if (filters.search) {
            query = query.ilike('title', `%${filters.search}%`)
        }

        if (filters.categoryId && filters.categoryId !== 'all') {
            query = query.eq('category_id', filters.categoryId)
        }

        if (filters.startDate) {
            query = query.gte('date', filters.startDate)
        }

        if (filters.endDate) {
            query = query.lte('date', filters.endDate)
        }

        if (filters.minAmount !== undefined) {
            query = query.gte('amount', filters.minAmount)
        }

        if (filters.maxAmount !== undefined) {
            query = query.lte('amount', filters.maxAmount)
        }

        return query
    }

    // Get paginated data
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    const { data, count, error } = await buildQuery().range(from, to)

    if (error) {
        console.error('Error fetching expense transactions:', JSON.stringify(error, null, 2))
        return { data: [], count: 0, totalAmount: 0 }
    }

    // Get total amount for the filtered result (separate query without pagination)
    // We only need the amount column to sum it up
    let sumQuery = supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('type', 'expense')

    if (filters.search) sumQuery = sumQuery.ilike('title', `%${filters.search}%`)
    if (filters.categoryId && filters.categoryId !== 'all') sumQuery = sumQuery.eq('category_id', filters.categoryId)
    if (filters.startDate) sumQuery = sumQuery.gte('date', filters.startDate)
    if (filters.endDate) sumQuery = sumQuery.lte('date', filters.endDate)
    if (filters.minAmount !== undefined) sumQuery = sumQuery.gte('amount', filters.minAmount)
    if (filters.maxAmount !== undefined) sumQuery = sumQuery.lte('amount', filters.maxAmount)

    const { data: allAmounts } = await sumQuery

    const totalAmount = allAmounts?.reduce((sum, item) => sum + Number(item.amount), 0) || 0

    return { data, count, totalAmount }
}

export async function getExpenseSummary() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { total: 0 }

    const { data, error } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('type', 'expense')

    if (error) {
        console.error('Error fetching expense summary:', error)
        return { total: 0 }
    }

    const total = data.reduce((acc, curr) => acc + Number(curr.amount), 0)

    return { total }
}

export async function getExpenseOptions() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { categories: [], accounts: [] }

    const { data: categories } = await supabase
        .from('categories')
        .select('id, name')
        .eq('user_id', user.id)
        .eq('type', 'expense')

    const { data: accounts } = await supabase
        .from('accounts')
        .select('id, name')
        .eq('user_id', user.id)

    return {
        categories: categories || [],
        accounts: accounts || []
    }
}
