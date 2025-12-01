'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Usuário não autenticado' }
    }

    const currency = formData.get('currency') as string

    const { error } = await supabase
        .from('profiles')
        .update({ currency, updated_at: new Date().toISOString() })
        .eq('id', user.id)

    if (error) {
        return { error: 'Erro ao atualizar perfil' }
    }

    revalidatePath('/settings')
    revalidatePath('/dashboard')
    return { success: 'Perfil atualizado com sucesso' }
}
