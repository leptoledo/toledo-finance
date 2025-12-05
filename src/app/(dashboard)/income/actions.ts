'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

interface IncomeFilters {
    search?: string
    categoryId?: string
    startDate?: string
    endDate?: string
    minAmount?: number
    maxAmount?: number
}

export async function getIncomeTransactions(page = 1, pageSize = 10, filters: IncomeFilters = {}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { data: [], count: 0, totalAmount: 0 }

    const buildQuery = () => {
        let query = supabase
            .from('transactions')
            .select(`
                *,
                category:categories!category_id(name, icon, type)
            `, { count: 'exact' })
            .eq('user_id', user.id)
            .eq('type', 'income')
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

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, count, error } = await buildQuery().range(from, to)

    if (error) {
        console.error('Error fetching income transactions:', JSON.stringify(error, null, 2))
        return { data: [], count: 0, totalAmount: 0 }
    }

    // Get total amount for the filtered result (separate query)
    let sumQuery = supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('type', 'income')

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

export async function getIncomeSummary() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { total: 0 }

    const { data, error } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('type', 'income')

    if (error) {
        console.error('Error fetching income summary:', error)
        return { total: 0 }
    }

    const total = data.reduce((acc, curr) => acc + Number(curr.amount), 0)

    return { total }
}

// Helper to update account balance
async function updateAccountBalance(supabase: any, accountId: string, amountDelta: number) {
    // Get current balance
    const { data: account } = await supabase
        .from('accounts')
        .select('balance')
        .eq('id', accountId)
        .single()

    if (!account) return

    const newBalance = Number(account.balance) + amountDelta

    await supabase
        .from('accounts')
        .update({ balance: newBalance })
        .eq('id', accountId)
}

export async function deleteTransaction(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // Get transaction before deleting to update balance
    const { data: transaction } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (!transaction) return { error: 'Transaction not found' }

    const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    // Revert balance change
    if (transaction.account_id) {
        const amount = Number(transaction.amount)
        // If it was income, we remove it (-), if expense, we add it back (+)
        const delta = transaction.type === 'income' ? -amount : amount
        await updateAccountBalance(supabase, transaction.account_id, delta)
    }

    revalidatePath('/income')
    revalidatePath('/expenses')
    revalidatePath('/dashboard')
    revalidatePath('/accounts')
    return { success: true }
}

export async function getIncomeOptions() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { categories: [], accounts: [] }

    const { data: categories } = await supabase
        .from('categories')
        .select('id, name')
        .eq('user_id', user.id)
        .eq('type', 'income')

    const { data: accounts } = await supabase
        .from('accounts')
        .select('id, name')
        .eq('user_id', user.id)

    return {
        categories: categories || [],
        accounts: accounts || []
    }
}

export async function createTransaction(data: {
    title: string
    amount: number
    date: string
    category_id: string
    account_id: string
    type: 'income' | 'expense'
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('transactions')
        .insert({
            ...data,
            user_id: user.id
        })

    if (error) {
        return { error: error.message }
    }

    // Update account balance
    if (data.account_id) {
        const amount = Number(data.amount)
        const delta = data.type === 'income' ? amount : -amount
        await updateAccountBalance(supabase, data.account_id, delta)
    }

    revalidatePath('/income')
    revalidatePath('/expenses')
    revalidatePath('/dashboard')
    revalidatePath('/accounts')
    return { success: true }
}

export async function updateTransaction(id: string, data: {
    title: string
    amount: number
    date: string
    category_id: string
    account_id: string
    type: 'income' | 'expense'
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // Get old transaction to revert its effect
    const { data: oldTransaction } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (!oldTransaction) return { error: 'Transaction not found' }

    const { error } = await supabase
        .from('transactions')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    // Revert old transaction effect
    if (oldTransaction.account_id) {
        const oldAmount = Number(oldTransaction.amount)
        const oldDelta = oldTransaction.type === 'income' ? -oldAmount : oldAmount
        await updateAccountBalance(supabase, oldTransaction.account_id, oldDelta)
    }

    // Apply new transaction effect
    if (data.account_id) {
        const newAmount = Number(data.amount)
        const newDelta = data.type === 'income' ? newAmount : -newAmount
        await updateAccountBalance(supabase, data.account_id, newDelta)
    }

    revalidatePath('/income')
    revalidatePath('/expenses')
    revalidatePath('/dashboard')
    revalidatePath('/accounts')
    return { success: true }
}
