'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

interface ParsedTransaction {
    date: string
    description: string
    amount: number
    type: 'income' | 'expense'
}

export async function parseCSV(content: string): Promise<{ transactions: ParsedTransaction[], error?: string }> {
    try {
        const lines = content.trim().split('\n')
        if (lines.length < 2) {
            return { transactions: [], error: 'Arquivo CSV vazio ou inválido' }
        }

        // Remove header
        const dataLines = lines.slice(1)
        const transactions: ParsedTransaction[] = []

        for (const line of dataLines) {
            // Parse CSV line (handle quoted fields)
            const fields = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g)
            if (!fields || fields.length < 3) continue

            const date = fields[0].replace(/"/g, '').trim()
            const description = fields[1].replace(/"/g, '').trim()
            const amountStr = fields[2].replace(/"/g, '').trim()

            // Parse amount
            let amount = parseFloat(amountStr.replace(/[^\d.,-]/g, '').replace(',', '.'))
            if (isNaN(amount)) continue

            // Determine type
            const type: 'income' | 'expense' = amount >= 0 ? 'income' : 'expense'
            amount = Math.abs(amount)

            // Validate date
            const parsedDate = new Date(date)
            if (isNaN(parsedDate.getTime())) continue

            transactions.push({
                date: parsedDate.toISOString().split('T')[0],
                description,
                amount,
                type
            })
        }

        return { transactions }
    } catch (error) {
        return { transactions: [], error: 'Erro ao processar arquivo CSV' }
    }
}

export async function importTransactions(
    transactions: ParsedTransaction[],
    categoryMappings: Record<string, string>
) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Não autenticado' }
    }

    // Get default category for unmapped transactions
    const { data: defaultCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('user_id', user.id)
        .eq('type', 'expense')
        .limit(1)
        .single()

    const defaultCategoryId = defaultCategory?.id

    // Prepare transactions for insert
    const transactionsToInsert = transactions.map(t => ({
        user_id: user.id,
        type: t.type,
        amount: t.amount,
        description: t.description,
        date: t.date,
        category_id: categoryMappings[t.description] || defaultCategoryId,
        account_id: null // User can update later
    }))

    const { error, data } = await supabase
        .from('transactions')
        .insert(transactionsToInsert)
        .select()

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/import')
    revalidatePath('/dashboard')
    revalidatePath('/income')
    revalidatePath('/expenses')

    return { success: true, count: data?.length || 0 }
}

export async function getCategories() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data: categories } = await supabase
        .from('categories')
        .select('id, name, type, icon')
        .eq('user_id', user.id)
        .order('name')

    return categories || []
}
