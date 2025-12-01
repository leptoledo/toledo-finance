'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createInvestment(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Não autenticado' }
    }

    const name = formData.get('name') as string
    const type = formData.get('type') as string
    const amount_invested = formData.get('amount_invested') as string
    const current_value = formData.get('current_value') as string
    const purchase_date = formData.get('purchase_date') as string
    const notes = formData.get('notes') as string

    const { error } = await supabase
        .from('investments')
        .insert({
            user_id: user.id,
            name,
            type,
            amount_invested: parseFloat(amount_invested),
            current_value: parseFloat(current_value),
            purchase_date,
            notes: notes || null
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/investments')
    return { success: true }
}

export async function updateInvestment(id: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Não autenticado' }
    }

    const current_value = formData.get('current_value') as string
    const notes = formData.get('notes') as string

    const { error } = await supabase
        .from('investments')
        .update({
            current_value: parseFloat(current_value),
            notes: notes || null
        })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/investments')
    return { success: true }
}

export async function deleteInvestment(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Não autenticado' }
    }

    const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/investments')
    return { success: true }
}
