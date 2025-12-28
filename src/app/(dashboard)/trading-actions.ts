'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type TradeStatus = 'OPEN' | 'CLOSED'
export type OperationType = 'LONG' | 'SHORT'

export interface Trade {
    id: string
    user_id: string
    asset_symbol: string
    operation_type: OperationType
    quantity: number
    entry_price: number
    exit_price?: number | null
    entry_date: string
    exit_date?: string | null
    status: TradeStatus
    result?: number | null
    strategy?: string | null
    screenshot_url?: string | null
    notes?: string | null
    take_profit?: number | null
    stop_loss?: number | null
    created_at: string
    updated_at: string
}

export async function createTrade(data: {
    asset_symbol: string
    operation_type: OperationType
    quantity: number
    entry_price: number
    exit_price?: number
    entry_date: string
    exit_date?: string
    strategy?: string
    notes?: string
    take_profit?: number
    stop_loss?: number
    result?: number
    status?: TradeStatus
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('trades')
        .insert({
            ...data,
            user_id: user.id,
            status: data.status || 'OPEN'
        })

    if (error) {
        console.error('Error creating trade:', error)
        return { error: error.message }
    }

    revalidatePath('/trading')
    return { success: true }
}

export async function closeTrade(id: string, data: {
    exit_price: number
    exit_date: string
    result: number
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('trades')
        .update({
            ...data,
            status: 'CLOSED'
        })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error closing trade:', error)
        return { error: error.message }
    }

    revalidatePath('/trading')
    return { success: true }
}

export async function updateTrade(id: string, data: Partial<Trade>) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('trades')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error updating trade:', error)
        return { error: error.message }
    }

    revalidatePath('/trading')
    return { success: true }
}

export async function deleteTrade(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('trades')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error deleting trade:', error)
        return { error: error.message }
    }

    revalidatePath('/trading')
    return { success: true }
}

export async function getTrades(filters?: {
    startDate?: string
    endDate?: string
    asset?: string
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { data: [], count: 0 }

    let query = supabase
        .from('trades')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false })

    if (filters?.startDate) {
        query = query.gte('entry_date', filters.startDate)
    }
    if (filters?.endDate) {
        // Add one day to include the end date fully if it's just a date string
        query = query.lte('entry_date', filters.endDate + ' 23:59:59')
    }
    if (filters?.asset) {
        query = query.ilike('asset_symbol', `%${filters.asset}%`)
    }

    const { data, count, error } = await query

    if (error) {
        console.error('Error fetching trades:', error)
        return { data: [], count: 0 }
    }

    return { data, count }
}

export type TradingSettings = {
    initial_balance: number
    currency: string
}

export async function getTradingSettings(): Promise<TradingSettings | null> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
        .from('trading_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (error) {
        if (error.code === 'PGRST116') return null // Not found
        console.error('Error fetching settings:', error)
        return null
    }

    return {
        initial_balance: data.initial_balance,
        currency: data.currency || 'BRL'
    }
}

export async function updateTradingSettings(initialBalance: number, currency: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'User not authenticated' }

    const { error } = await supabase
        .from('trading_settings')
        .upsert({
            user_id: user.id,
            initial_balance: initialBalance,
            currency
        }, { onConflict: 'user_id' })

    if (error) {
        console.error('Error updating settings:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/trading')
    return { success: true }
}

export async function getTradingStats() {
    const { data: trades } = await getTrades()

    // Check if trades is null or undefined
    if (!trades) return {
        totalTrades: 0,
        winRate: 0,
        profitFactor: 0,
        totalResult: 0,
        openTrades: 0
    }

    const allTrades = trades as Trade[]
    const closedTrades = allTrades.filter(t => t.status === 'CLOSED')
    const openTrades = allTrades.filter(t => t.status === 'OPEN').length

    const totalTrades = closedTrades.length
    const winningTrades = closedTrades.filter(t => (t.result || 0) > 0).length
    const losingTrades = closedTrades.filter(t => (t.result || 0) < 0).length

    const totalGrossProfit = closedTrades
        .filter(t => (t.result || 0) > 0)
        .reduce((sum, t) => sum + (t.result || 0), 0)

    const totalGrossLoss = Math.abs(closedTrades
        .filter(t => (t.result || 0) < 0)
        .reduce((sum, t) => sum + (t.result || 0), 0))

    const totalResult = totalGrossProfit - totalGrossLoss
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0
    const profitFactor = totalGrossLoss > 0 ? totalGrossProfit / totalGrossLoss : totalGrossProfit > 0 ? 999 : 0

    return {
        totalTrades,
        winRate,
        profitFactor,
        totalResult,
        openTrades
    }
}
