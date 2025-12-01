import { createClient } from '@/utils/supabase/server'

export interface Account {
    id: string
    user_id: string
    name: string
    type: 'checking' | 'savings' | 'investment' | 'cash'
    balance: number
    currency: string
    created_at: string
}

export async function getAccounts() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return []
    }

    const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching accounts:', error)
        return []
    }

    return data as Account[]
}

export async function getAccountsSummary() {
    const accounts = await getAccounts()

    const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0)
    const accountsByType = accounts.reduce((acc, account) => {
        const type = account.type
        if (!acc[type]) {
            acc[type] = { count: 0, balance: 0 }
        }
        acc[type].count++
        acc[type].balance += Number(account.balance)
        return acc
    }, {} as Record<string, { count: number; balance: number }>)

    return {
        totalBalance,
        accountCount: accounts.length,
        accountsByType
    }
}
