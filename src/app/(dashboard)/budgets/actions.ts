'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createBudget(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Não autenticado' }
    }

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const categoryId = formData.get('category_id') as string
    const limitAmount = parseFloat(formData.get('limit_amount') as string)
    const dueDate = formData.get('due_date') as string

    if (!name || !categoryId || !limitAmount) {
        return { error: 'Nome, categoria e valor são obrigatórios' }
    }

    const { error } = await supabase
        .from('budgets')
        .insert({
            user_id: user.id,
            name,
            description: description || null,
            category_id: categoryId,
            limit_amount: limitAmount,
            due_date: dueDate || null
        })

    if (error) {
        console.error('Error creating budget:', error)
        console.error('Error details:', JSON.stringify(error, null, 2))

        // Check for unique constraint violation
        if (error.code === '23505') {
            return { error: 'Já existe um orçamento com este nome.' }
        }

        return { error: `Erro ao criar orçamento: ${error.message}` }
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
