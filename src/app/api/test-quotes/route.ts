import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getAssetQuotes } from '../../(dashboard)/portfolio/actions'

export async function GET(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const { data: transactions } = await supabase
            .from('portfolio_transactions')
            .select('ticker')
            .eq('user_id', user.id)

        const tickers = transactions ? Array.from(new Set(transactions.map((t: any) => t.ticker))) : []

        // This now uses the robust version with v8 fallback from actions.ts
        const quotes = await getAssetQuotes(tickers)

        return NextResponse.json({
            source: 'Verified Action with Fallback - V2',
            user_tickers: tickers,
            quotes_result: quotes
        })
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 })
    }
}
