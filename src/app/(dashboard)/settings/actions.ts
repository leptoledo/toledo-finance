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
    const first_name = formData.get('first_name') as string
    const last_name = formData.get('last_name') as string
    const avatar_url = formData.get('avatar_url') as string

    const updates: any = {
        id: user.id, // Necessário para upsert
        currency,
        first_name,
        last_name,
        updated_at: new Date().toISOString(),
    }

    if (avatar_url) {
        updates.avatar_url = avatar_url
    }

    console.log('Dados recebidos:', { currency, first_name, last_name, avatar_url })

    const { data, error } = await supabase
        .from('profiles')
        .upsert(updates)
        .select()

    console.log('Resultado do update:', { data, error })

    if (error) {
        console.error('Erro no update:', error)
        return { error: `Erro técnico: ${error.message} (Código: ${error.code})` }
    }

    revalidatePath('/settings')
    revalidatePath('/dashboard')
    return { success: 'Perfil atualizado com sucesso' }
}
