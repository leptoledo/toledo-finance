'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createFeedback(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Não autenticado' }
    }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const priority = formData.get('priority') as string
    const imageFile = formData.get('image') as File | null

    if (!title || !description) {
        return { error: 'Título e descrição são obrigatórios' }
    }

    let imageUrl = null

    // Upload image if provided
    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
            .from('feedback-images')
            .upload(fileName, imageFile, {
                cacheControl: '3600',
                upsert: false
            })

        if (uploadError) {
            console.error('Error uploading image:', uploadError)
            return { error: 'Erro ao fazer upload da imagem' }
        }

        const { data: { publicUrl } } = supabase.storage
            .from('feedback-images')
            .getPublicUrl(fileName)

        imageUrl = publicUrl
    }

    const { data: feedbackData, error } = await supabase
        .from('feedback')
        .insert({
            user_id: user.id,
            title,
            description,
            image_url: imageUrl,
            priority,
            status: 'pending'
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating feedback:', error)
        return { error: 'Erro ao enviar feedback' }
    }

    // Log do feedback criado (você pode ver isso nos logs do Supabase)
    console.log('Novo feedback recebido:', {
        id: feedbackData?.id,
        title,
        priority,
        user_email: user.email,
        has_image: !!imageUrl
    })

    // TODO: Adicionar notificação por email
    // Você pode usar serviços como:
    // 1. Resend (https://resend.com)
    // 2. SendGrid
    // 3. Supabase Edge Functions com webhooks
    // 
    // Exemplo com Resend:
    // await fetch('https://api.resend.com/emails', {
    //     method: 'POST',
    //     headers: {
    //         'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         from: 'FinanceX <noreply@seudominio.com>',
    //         to: 'seu-email@example.com',
    //         subject: `Novo Feedback: ${title}`,
    //         html: `
    //             <h2>Novo feedback recebido</h2>
    //             <p><strong>Título:</strong> ${title}</p>
    //             <p><strong>Prioridade:</strong> ${priority}</p>
    //             <p><strong>Descrição:</strong></p>
    //             <p>${description}</p>
    //             ${imageUrl ? `<p><a href="${imageUrl}">Ver imagem</a></p>` : ''}
    //         `
    //     })
    // })

    revalidatePath('/feedback')
    revalidatePath('/admin/feedback')
    return { success: 'Feedback enviado com sucesso! Obrigado pela sua contribuição.' }
}

export async function getFeedbacks() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { data: null, error: 'Não autenticado' }
    }

    const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching feedbacks:', error)
        return { data: null, error: 'Erro ao buscar feedbacks' }
    }

    return { data, error: null }
}
