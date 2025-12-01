'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createGoal(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Não autenticado' }
    }

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const type = formData.get('type') as string
    const targetAmount = parseFloat(formData.get('target_amount') as string)
    const currentAmount = parseFloat(formData.get('current_amount') as string) || 0
    const deadline = formData.get('deadline') as string

    if (!name || !type || !targetAmount) {
        return { error: 'Nome, tipo e valor alvo são obrigatórios' }
    }

    const { error } = await supabase
        .from('goals')
        .insert({
            user_id: user.id,
            name,
            description: description || null,
            type,
            target_amount: targetAmount,
            current_amount: currentAmount,
            deadline: deadline || null
        })

    if (error) {
        console.error('Error creating goal:', error)
        return { error: 'Erro ao criar meta' }
    }

    revalidatePath('/goals')
    return { success: true }
}

export async function updateGoalProgress(goalId: string, amount: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Não autenticado' }
    }

    const { error } = await supabase
        .from('goals')
        .update({ current_amount: amount })
        .eq('id', goalId)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error updating goal:', error)
        return { error: 'Erro ao atualizar progresso' }
    }

    revalidatePath('/goals')
    return { success: true }
}

export async function deleteGoal(goalId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Não autenticado' }
    }

    const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error deleting goal:', error)
        return { error: 'Erro ao excluir meta' }
    }

    revalidatePath('/goals')
    return { success: true }
}
