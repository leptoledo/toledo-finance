'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCategory(data: {
    name: string
    type: 'income' | 'expense'
    icon?: string
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { data: category, error } = await supabase
        .from('categories')
        .insert({
            ...data,
            user_id: user.id
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating category:', error)
        return { error: error.message }
    }

    revalidatePath('/income')
    revalidatePath('/expenses')
    revalidatePath('/categories')
    return { success: true, data: category }
}

export async function getCategories(type?: 'income' | 'expense') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { data: [] }

    let query = supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name')

    if (type) {
        query = query.eq('type', type)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching categories:', error)
        return { data: [] }
    }

    return { data }
}

export async function updateCategory(id: string, data: {
    name?: string
    icon?: string
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('categories')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error updating category:', error)
        return { error: error.message }
    }

    revalidatePath('/income')
    revalidatePath('/expenses')
    revalidatePath('/categories')
    return { success: true }
}

export async function deleteCategory(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error deleting category (supabase):', error)
        return { error: error.message }
    }

    revalidatePath('/income')
    revalidatePath('/expenses')
    revalidatePath('/categories')
    return { success: true }
}
