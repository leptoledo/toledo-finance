'use server'

import { createClient } from '@/utils/supabase/server'

export async function getAllFeedbacks() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { data: null, error: 'Não autenticado' }
    }

    // Verificar se é admin (você pode adicionar um campo is_admin na tabela profiles)
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Por enquanto, vou usar o email para verificar se é admin
    // Você pode mudar isso para um campo is_admin no futuro
    const adminEmails = ['leptoledo@hotmail.com', 'admin@financex.com'] // Adicione seu email aqui

    if (!adminEmails.includes(user.email || '')) {
        return { data: null, error: 'Acesso negado' }
    }

    // First, let's try a simple query without the join
    const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching feedbacks:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
            fullError: JSON.stringify(error)
        })
        return { data: null, error: `Erro ao buscar feedbacks: ${error.message}` }
    }

    console.log('Feedbacks fetched successfully:', data?.length || 0)
    return { data, error: null }
}

export async function updateFeedbackStatus(feedbackId: string, status: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Não autenticado' }
    }

    const { error } = await supabase
        .from('feedback')
        .update({
            status,
            updated_at: new Date().toISOString()
        })
        .eq('id', feedbackId)

    if (error) {
        console.error('Error updating feedback:', error)
        return { error: 'Erro ao atualizar feedback' }
    }

    return { success: 'Status atualizado com sucesso' }
}
