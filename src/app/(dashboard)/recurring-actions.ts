'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly'

export interface RecurringTransaction {
    id: string
    user_id: string
    account_id: string
    category_id: string
    type: 'income' | 'expense'
    title: string
    amount: number
    frequency: RecurringFrequency
    start_date: string
    end_date?: string
    next_occurrence: string
    is_active: boolean
    description?: string
    created_at: string
    updated_at: string
}

export async function createRecurringTransaction(data: {
    title: string
    amount: number
    start_date: string
    category_id: string
    account_id: string
    type: 'income' | 'expense'
    frequency: RecurringFrequency
    end_date?: string
    description?: string
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('recurring_transactions')
        .insert({
            ...data,
            user_id: user.id,
            next_occurrence: data.start_date
        })

    if (error) {
        console.error('Error creating recurring transaction:', error)
        return { error: error.message }
    }

    revalidatePath('/income')
    return { success: true }
}

export async function getRecurringTransactions(type?: 'income' | 'expense') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { data: [], count: 0 }

    let query = supabase
        .from('recurring_transactions')
        .select(`
            *,
            category:categories!category_id(name, icon, type),
            account:accounts!account_id(name)
        `, { count: 'exact' })
        .eq('user_id', user.id)
        .order('next_occurrence', { ascending: true })

    if (type) {
        query = query.eq('type', type)
    }

    const { data, count, error } = await query

    if (error) {
        console.error('Error fetching recurring transactions:', error)
        return { data: [], count: 0 }
    }

    return { data, count }
}

export async function updateRecurringTransaction(id: string, data: {
    title?: string
    amount?: number
    category_id?: string
    account_id?: string
    frequency?: RecurringFrequency
    end_date?: string
    is_active?: boolean
    description?: string
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('recurring_transactions')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error updating recurring transaction:', error)
        return { error: error.message }
    }

    revalidatePath('/income')
    return { success: true }
}

export async function deleteRecurringTransaction(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('recurring_transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error deleting recurring transaction:', error)
        return { error: error.message }
    }

    revalidatePath('/income')
    return { success: true }
}

export async function toggleRecurringTransaction(id: string, is_active: boolean) {
    return updateRecurringTransaction(id, { is_active })
}

export async function processRecurringTransactions() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { data: count, error } = await supabase.rpc('process_recurring_transactions')

    if (error) {
        console.error('Error processing recurring transactions:', error)
        return { error: error.message }
    }

    revalidatePath('/income')
    revalidatePath('/expenses')
    return { success: true, count: count as number }
}
