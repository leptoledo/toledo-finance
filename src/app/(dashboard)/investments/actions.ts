'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Helper to update account balance
async function updateAccountBalance(supabase: any, accountId: string, amountDelta: number) {
    const { data: account } = await supabase
        .from('accounts')
        .select('balance')
        .eq('id', accountId)
        .single()

    if (!account) return

    const newBalance = Number(account.balance) + amountDelta

    await supabase
        .from('accounts')
        .update({ balance: newBalance })
        .eq('id', accountId)
}

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
    const account_id = formData.get('account_id') as string

    const { error } = await supabase
        .from('investments')
        .insert({
            user_id: user.id,
            name,
            type,
            amount_invested: parseFloat(amount_invested),
            current_value: parseFloat(current_value),
            purchase_date,
            notes: notes || null,
            // Only add account_id if the column exists in your DB. 
            // Assuming it does since we are implementing 'wallet' logic.
            ...(account_id ? { account_id } : {})
        })

    if (error) {
        return { error: error.message }
    }

    // Debit the account (Money leaves account to go to investment)
    if (account_id) {
        await updateAccountBalance(supabase, account_id, -parseFloat(amount_invested))
    }

    revalidatePath('/investments')
    revalidatePath('/accounts')
    revalidatePath('/dashboard')
    return { success: true }
}

export async function deleteInvestment(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Não autenticado' }
    }

    // Get investment to revert balance
    const { data: investment } = await supabase
        .from('investments')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (!investment) return { error: 'Investment not found' }

    const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    // Credit account back (selling/liquidating investment logic ideally, or just reverting the 'buy' action)
    // Here we assume reverting the creation, so we add the amount_invested back.
    if (investment.account_id) {
        await updateAccountBalance(supabase, investment.account_id, Number(investment.amount_invested))
    }

    revalidatePath('/investments')
    revalidatePath('/accounts')
    revalidatePath('/dashboard')
    return { success: true }
}
