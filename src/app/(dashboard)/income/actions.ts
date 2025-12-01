'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getIncomeTransactions(page = 1, pageSize = 10, search = '') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { data: [], count: 0 }

    let query = supabase
        .from('transactions')
        .select(`
            *,
            category:categories!category_id(name, icon, type)
        `, { count: 'exact' })
        .eq('user_id', user.id)
        .eq('type', 'income')
        .order('date', { ascending: false })

    if (search) {
        query = query.ilike('title', `%${search}%`)
    }

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, count, error } = await query.range(from, to)

    if (error) {
        console.error('Error fetching income transactions:', JSON.stringify(error, null, 2))
        return { data: [], count: 0 }
    }

    return { data, count }
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

export async function deleteTransaction(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/income')
    revalidatePath('/expenses')
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

    revalidatePath('/income')
    revalidatePath('/expenses')
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

    const { error } = await supabase
        .from('transactions')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/income')
    revalidatePath('/expenses')
    return { success: true }
}
