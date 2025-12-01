'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createAccount(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Não autenticado' }
    }

    const name = formData.get('name') as string
    const type = formData.get('type') as string
    const balance = parseFloat(formData.get('balance') as string) || 0
    const currency = formData.get('currency') as string || 'BRL'

    if (!name || !type) {
        return { error: 'Nome e tipo são obrigatórios' }
    }

    const { error } = await supabase
        .from('accounts')
        .insert({
            user_id: user.id,
            name,
            type,
            balance,
            currency
        })

    if (error) {
        console.error('Error creating account:', error)
        return { error: 'Erro ao criar conta' }
    }

    revalidatePath('/accounts')
    return { success: true }
}

export async function updateAccount(accountId: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Não autenticado' }
    }

    const name = formData.get('name') as string
    const type = formData.get('type') as string
    const balance = parseFloat(formData.get('balance') as string)

    if (!name || !type) {
        return { error: 'Nome e tipo são obrigatórios' }
    }

    if (isNaN(balance)) {
        return { error: 'Saldo inválido' }
    }

    const { error } = await supabase
        .from('accounts')
        .update({ name, type, balance })
        .eq('id', accountId)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error updating account:', error)
        return { error: 'Erro ao atualizar conta' }
    }

    revalidatePath('/accounts')
    return { success: true }
}

export async function deleteAccount(accountId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Não autenticado' }
    }

    const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', accountId)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error deleting account:', error)
        return { error: 'Erro ao excluir conta. Verifique se não há transações associadas.' }
    }

    revalidatePath('/accounts')
    return { success: true }
}
