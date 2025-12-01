import { createClient } from '@/utils/supabase/server'

export interface Investment {
    id: string
    user_id: string
    name: string
    type: 'stocks' | 'bonds' | 'crypto' | 'real_estate' | 'other'
    amount_invested: string
    current_value: string
    purchase_date: string
    notes: string | null
    created_at: string
}

export interface InvestmentSummary {
    totalInvested: number
    currentValue: number
    totalReturn: number
    returnPercentage: number
    byType: {
        type: string
        invested: number
        current: number
        return: number
        percentage: number
    }[]
}

export async function getInvestments(): Promise<Investment[]> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data: investments } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', user.id)
        .order('purchase_date', { ascending: false })

    return investments || []
}

export async function getInvestmentsSummary(): Promise<InvestmentSummary> {
    const investments = await getInvestments()

    if (investments.length === 0) {
        return {
            totalInvested: 0,
            currentValue: 0,
            totalReturn: 0,
            returnPercentage: 0,
            byType: []
        }
    }

    const totalInvested = investments.reduce((sum, inv) => sum + Number(inv.amount_invested), 0)
    const currentValue = investments.reduce((sum, inv) => sum + Number(inv.current_value), 0)
    const totalReturn = currentValue - totalInvested
    const returnPercentage = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0

    // Group by type
    const typeMap = new Map<string, { invested: number; current: number }>()

    investments.forEach(inv => {
        if (!typeMap.has(inv.type)) {
            typeMap.set(inv.type, { invested: 0, current: 0 })
        }
        const typeData = typeMap.get(inv.type)!
        typeData.invested += Number(inv.amount_invested)
        typeData.current += Number(inv.current_value)
    })

    const byType = Array.from(typeMap.entries()).map(([type, data]) => ({
        type,
        invested: data.invested,
        current: data.current,
        return: data.current - data.invested,
        percentage: totalInvested > 0 ? (data.invested / totalInvested) * 100 : 0
    }))

    return {
        totalInvested,
        currentValue,
        totalReturn,
        returnPercentage,
        byType
    }
}
