'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getExpenseTransactions(page = 1, pageSize = 10, search = '') {
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
        .eq('type', 'expense')
        .order('date', { ascending: false })

    if (search) {
        query = query.ilike('title', `%${search}%`)
    }

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, count, error } = await query.range(from, to)

    if (error) {
        console.error('Error fetching expense transactions:', JSON.stringify(error, null, 2))
        return { data: [], count: 0 }
    }

    return { data, count }
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
