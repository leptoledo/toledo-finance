'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createBudget(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Não autenticado' }
    }

    const categoryId = formData.get('category_id') as string
    const limitAmount = parseFloat(formData.get('limit_amount') as string)
    const month = parseInt(formData.get('month') as string)
    const year = parseInt(formData.get('year') as string)

    if (!categoryId || !limitAmount || !month || !year) {
        return { error: 'Todos os campos são obrigatórios' }
    }

    const { error } = await supabase
        .from('budgets')
        .insert({
            user_id: user.id,
            category_id: categoryId,
            limit_amount: limitAmount,
            month,
            year
        })

    if (error) {
        console.error('Error creating budget:', error)
        return { error: 'Erro ao criar orçamento. Verifique se já não existe um orçamento para esta categoria neste mês.' }
    }

    revalidatePath('/budgets')
    return { success: true }
}

export async function updateBudget(budgetId: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Não autenticado' }
    }

    const limitAmount = parseFloat(formData.get('limit_amount') as string)

    if (!limitAmount) {
        return { error: 'Valor do limite é obrigatório' }
    }

    const { error } = await supabase
        .from('budgets')
        .update({ limit_amount: limitAmount })
        .eq('id', budgetId)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error updating budget:', error)
        return { error: 'Erro ao atualizar orçamento' }
    }

    revalidatePath('/budgets')
    return { success: true }
}

export async function deleteBudget(budgetId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Não autenticado' }
    }

    const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', budgetId)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error deleting budget:', error)
        return { error: 'Erro ao excluir orçamento' }
    }

    revalidatePath('/budgets')
    return { success: true }
}
