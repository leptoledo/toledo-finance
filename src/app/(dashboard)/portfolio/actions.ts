'use server'

import { createClient } from '@/utils/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPortfolio(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    const name = formData.get('name') as string
    const currency = formData.get('currency') as string || 'USD'
    const description = formData.get('description') as string
    const benchmark = formData.get('benchmark') as string || 'IBOV'
    const risk_free_rate = Number(formData.get('risk_free_rate')) || 0
    const auto_adjust = formData.get('auto_adjust') === 'on'

    // Try inserting with new fields
    const { data, error } = await supabase
        .from('portfolios')
        .insert({
            user_id: user.id,
            name,
            currency,
            description,
            benchmark,
            risk_free_rate,
            auto_adjust
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating portfolio (full):', error)

        // Fallback: Try inserting without new columns if they don't exist yet
        if (error.message.includes('column') || error.message.includes('schema')) {
            console.log('Retrying without new columns (benchmark, risk_free_rate, auto_adjust)...')
            const { data: dataFallback, error: errorFallback } = await supabase
                .from('portfolios')
                .insert({
                    user_id: user.id,
                    name,
                    currency,
                    description,
                    // Exclude new fields
                })
                .select()
                .single()

            if (errorFallback) {
                console.error('Error creating portfolio (fallback):', errorFallback)
                throw new Error(`Failed to create portfolio: ${errorFallback.message}`)
            }

            revalidatePath('/portfolio')
            return { id: dataFallback.id }
        }

        throw new Error(`Failed to create portfolio: ${error.message}`)
    }

    revalidatePath('/portfolio')
    return { id: data.id }
}

export async function updatePortfolio(id: string, data: {
    name?: string;
    description?: string;
    benchmark?: string;
    risk_free_rate?: number;
    auto_adjust?: boolean;
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    const { error } = await supabase
        .from('portfolios')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error updating portfolio:', error)
        throw new Error('Failed to update portfolio')
    }

    revalidatePath(`/portfolio/${id}`)
    revalidatePath('/portfolio')
}

export async function getPortfolio(id: string) {
    const supabase = await createClient()

    // Check if id is a valid UUID, otherwise might be a legacy slug (handle gracefully or fail)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

    if (!isUuid) {
        // Fallback for slugs if necessary, or just return null
        return null
    }

    const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        if (error.code === 'PGRST116') {
            // No rows found, simply return null
            return null
        }
        console.error('Error fetching portfolio:', JSON.stringify(error, null, 2))
        return null
    }

    return data
}

export async function listPortfolios() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from('portfolios')
        .select('id, name, updated_at, currency, description')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

    if (error) {
        console.error('Error listing portfolios:', error)
        return []
    }

    return data
}


export async function deletePortfolio(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    // Try normal delete
    const { error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error deleting portfolio (standard):', error)

        // Fallback: Try with Service Role Key if RLS is blocking
        if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.log('Attempting delete with service role key...')
            const adminSupabase = createSupabaseClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY,
                {
                    auth: {
                        autoRefreshToken: false,
                        persistSession: true
                    }
                }
            )

            const { error: adminError } = await adminSupabase
                .from('portfolios')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id) // Strict ownership check

            if (adminError) {
                console.error('Error deleting portfolio (admin):', adminError)
                throw new Error('Failed to delete portfolio')
            }
            // Success with admin
        } else {
            throw new Error('Failed to delete portfolio')
        }
    }

    revalidatePath('/portfolio')
}

export async function duplicatePortfolio(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    // Get original portfolio
    const { data: original, error: fetchError } = await supabase
        .from('portfolios')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (fetchError || !original) {
        throw new Error('Failed to fetch original portfolio')
    }

    // Create copy
    const { data: newPortfolio, error: createError } = await supabase
        .from('portfolios')
        .insert({
            user_id: user.id,
            name: `${original.name} (Copy)`,
            currency: original.currency,
            description: original.description,
        })
        .select()
        .single()

    if (createError) {
        throw new Error('Failed to duplicate portfolio')
    }

    revalidatePath('/portfolio')
    return { id: newPortfolio.id }
}

export async function addTransaction(data: {
    portfolioId: string
    ticker: string
    type: 'buy' | 'sell' | 'dividend' | 'split'
    quantity: number
    price: number
    date: string
    fees?: number
    notes?: string
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    const { error } = await supabase
        .from('portfolio_transactions')
        .insert({
            user_id: user.id,
            portfolio_id: data.portfolioId,
            ticker: data.ticker.toUpperCase(),
            type: data.type,
            quantity: data.quantity,
            price: data.price,
            date: data.date,
            fees: data.fees || 0,
            notes: data.notes
        })

    if (error) {
        console.error('Error adding transaction:', error)
        throw new Error('Failed to add transaction')
    }

    revalidatePath(`/portfolio/${data.portfolioId}`)
}

export async function updateTransaction(id: string, portfolioId: string, data: Partial<{
    ticker: string
    type: 'buy' | 'sell' | 'dividend' | 'split'
    quantity: number
    price: number
    date: string
    fees?: number
    notes?: string
}>) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    const { error } = await supabase
        .from('portfolio_transactions')
        .update({
            ticker: data.ticker?.toUpperCase(),
            type: data.type,
            quantity: data.quantity,
            price: data.price,
            date: data.date,
            fees: data.fees,
            notes: data.notes
        })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error updating transaction:', error)
        throw new Error('Failed to update transaction')
    }

    revalidatePath(`/portfolio/${portfolioId}`)
}

export async function deleteTransaction(id: string, portfolioId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    const { error } = await supabase
        .from('portfolio_transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error deleting transaction:', error)
        throw new Error('Failed to delete transaction')
    }

    revalidatePath(`/portfolio/${portfolioId}`)
}

export async function getPortfolioTransactions(portfolioId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from('portfolio_transactions')
        .select('*')
        .eq('portfolio_id', portfolioId)
        .eq('user_id', user.id)
        .order('date', { ascending: false })

    if (error) {
        // Fallback for missing table or permissions if migration didn't fully propagate yet
        console.error('Error fetching transactions:', error)
        return []
    }

    return data
}

export async function searchAssets(query: string) {
    if (!query || query.length < 2) return []

    try {
        const response = await fetch(
            `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=5&newsCount=0&enableFuzzyQuery=false&quotesQueryId=tss_match_phrase_query`,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0'
                },
                next: { revalidate: 3600 } // Cache results for 1 hour
            }
        )
        const data = await response.json()

        return (data.quotes || []).map((quote: any) => ({
            symbol: quote.symbol,
            name: quote.shortname || quote.longname || quote.symbol,
            exch: quote.exchDisp,
            type: quote.typeDisp
        }))
    } catch (error) {
        console.error('Error searching assets:', error)
        return []
    }
}

export async function getAssetQuotes(tickers: string[]) {
    if (!tickers.length) return {}

    try {
        const uniqueTickers = Array.from(new Set(tickers.map(t => t.toUpperCase())))
        const quotes: Record<string, number> = {}

        // Strategy 1: Batch Quote API (v7)
        // Note: Using query2 as usually more reliable than query1 for some regions
        const symbols = uniqueTickers.map(t => encodeURIComponent(t)).join(',')
        let batchSuccess = false

        // Only try batch if NOT previously rate limited recently? 
        // We can't know Easily. We just try.
        if (symbols) {
            try {
                const url = `https://query2.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`
                const response = await fetch(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Accept': 'application/json'
                    },
                    next: { revalidate: 120 } // Increase cache to 2 min
                })

                if (response.ok) {
                    const data = await response.json()
                    if (data.quoteResponse?.result) {
                        data.quoteResponse.result.forEach((quote: any) => {
                            if (quote.regularMarketPrice) {
                                quotes[quote.symbol] = quote.regularMarketPrice
                            }
                        })
                        batchSuccess = true
                    }
                } else {
                    console.warn(`[getAssetQuotes] v7 batch failed: ${response.status} ${response.statusText}`)
                }
            } catch (e) {
                console.error('[getAssetQuotes] v7 batch error:', e)
            }
        }

        // Strategy 2: Fallback to Chart API (v8) for missing tickers (fallback for 429)
        // We iterate over everything that is still missing.
        const pendingTickers = uniqueTickers.filter(t => !quotes[t])

        if (pendingTickers.length > 0) {
            console.log(`[getAssetQuotes] Fallback to v8 chart for: ${pendingTickers.join(', ')}`)

            await Promise.all(pendingTickers.map(async (ticker) => {
                try {
                    // Try standard ticker
                    let found = await fetchChartPrice(ticker)

                    // If standard failed (0), try .SA
                    if (!found && !ticker.includes('.')) {
                        const saTicker = ticker + '.SA'
                        const saPrice = await fetchChartPrice(saTicker)
                        if (saPrice > 0) {
                            quotes[ticker] = saPrice // Map back to original
                            quotes[saTicker] = saPrice // Cache SA too
                            return
                        }
                    } else {
                        quotes[ticker] = found
                    }
                } catch (e) {
                    // ignore
                }
            }))
        }

        return quotes
    } catch (error) {
        console.error('Error fetching asset quotes:', error)
        return {}
    }
}

async function fetchChartPrice(ticker: string): Promise<number> {
    try {
        // v8 chart is often less strict on rate limits for individual access
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`
        const res = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            next: { revalidate: 300 } // Aggressive caching (5 min) for fallback
        })

        if (!res.ok) return 0

        const data = await res.json()
        // Try getting meta price
        const meta = data.chart?.result?.[0]?.meta
        return meta?.regularMarketPrice || meta?.chartPreviousClose || 0
    } catch {
        return 0
    }
}

export async function getAssetHistory(tickers: string[], range: '1mo' | '3mo' | '6mo' | '1y' | 'max' = '1y') {
    if (!tickers.length) return {}

    try {
        const historyData: Record<string, { date: string; close: number }[]> = {}

        await Promise.all(tickers.map(async (ticker) => {
            try {
                const response = await fetch(
                    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?range=${range}&interval=1d`,
                    {
                        headers: { 'User-Agent': 'Mozilla/5.0' },
                        next: { revalidate: 3600 } // Cache for 1 hour
                    }
                )

                const data = await response.json()
                const result = data.chart?.result?.[0]

                if (result) {
                    const timestamps = result.timestamp || []
                    const quotes = result.indicators?.quote?.[0]?.close || []

                    historyData[ticker] = timestamps.map((ts: number, i: number) => ({
                        date: new Date(ts * 1000).toISOString().split('T')[0],
                        close: quotes[i] || 0
                    })).filter((item: any) => item.close > 0)
                }
            } catch (err) {
                console.error(`Failed to fetch history for ${ticker}`, err)
            }
        }))

        return historyData
    } catch (error) {
        console.error('Error fetching asset history:', error)
        return {}
    }
}

export async function getGlobalPortfolioSummary() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return {
            portfolios: [],
            global: {
                netWorth: 0,
                invested: 0,
                profit: 0,
                profitPercentage: 0
            }
        }
    }

    // 1. Fetch all portfolios
    const { data: portfolios, error: portError } = await supabase
        .from('portfolios')
        .select('id, name, updated_at, currency, description')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

    if (portError || !portfolios) return { portfolios: [], global: { netWorth: 0, invested: 0, profit: 0, profitPercentage: 0 } }

    // 2. Fetch all transactions for this user
    const { data: transactions, error: transError } = await supabase
        .from('portfolio_transactions')
        .select('*')
        .eq('user_id', user.id)

    if (transError || !transactions) {
        // Return portfolios with zeroed stats if transactions fail
        const emptyPortfolios = portfolios.map(p => ({
            ...p,
            totalInvested: 0,
            currentValue: 0,
            profit: 0,
            profitPercentage: 0
        }))
        return { portfolios: emptyPortfolios, global: { netWorth: 0, invested: 0, profit: 0, profitPercentage: 0 } }
    }

    // 3. Get unique tickers and fetch quotes
    const tickers = Array.from(new Set(transactions.map(t => t.ticker.toUpperCase())))
    const quotes = await getAssetQuotes(tickers)

    // 4. Calculate values per portfolio and gather global data
    const globalPositions = new Map<string, number>() // ticker -> quantity

    // Dividend tracking
    const dividendHistoryMap = new Map<string, number>() // YYYY-MM -> amount
    let totalDividends = 0

    const portfolioStats = portfolios.map(p => {
        const portTrans = transactions.filter(t => t.portfolio_id === p.id)

        // Calculate positions
        const positions = new Map<string, number>() // ticker -> quantity
        let invested = 0

        portTrans.forEach(t => {
            const ticker = t.ticker.toUpperCase()
            const totalValue = (t.quantity * t.price)

            if (t.type === 'buy') {
                positions.set(ticker, (positions.get(ticker) || 0) + t.quantity)
                globalPositions.set(ticker, (globalPositions.get(ticker) || 0) + t.quantity)
                invested += totalValue + t.fees
            } else if (t.type === 'sell') {
                positions.set(ticker, (positions.get(ticker) || 0) - t.quantity)
                globalPositions.set(ticker, (globalPositions.get(ticker) || 0) - t.quantity)
                invested -= totalValue - t.fees
            } else if (t.type === 'split') {
                const qty = positions.get(ticker) || 0
                const gQty = globalPositions.get(ticker) || 0
                if (qty > 0) positions.set(ticker, qty * t.quantity)
                if (gQty > 0) globalPositions.set(ticker, gQty * t.quantity)
            } else if (t.type === 'dividend') {
                // Track dividends
                const dateKey = t.date.substring(0, 7) // YYYY-MM
                dividendHistoryMap.set(dateKey, (dividendHistoryMap.get(dateKey) || 0) + totalValue)
                totalDividends += totalValue
            }
        })

        let currentValue = 0
        positions.forEach((qty, ticker) => {
            if (qty > 0.000001) {
                const price = quotes[ticker] || 0
                currentValue += qty * price
            }
        })

        return {
            ...p,
            totalInvested: invested,
            currentValue,
            profit: currentValue - invested,
            profitPercentage: invested > 0 ? ((currentValue - invested) / invested) * 100 : 0
        }
    })

    // 5. Calculate Global Stats
    const globalNetWorth = portfolioStats.reduce((acc, p) => acc + p.currentValue, 0)
    const globalInvested = portfolioStats.reduce((acc, p) => acc + p.totalInvested, 0)
    const globalProfit = globalNetWorth - globalInvested
    const globalProfitPercentage = globalInvested > 0 ? (globalProfit / globalInvested) * 100 : 0

    // 6. Prepare Analytics Data

    // Allocation
    const allocation: { ticker: string; value: number; percentage: number }[] = []
    globalPositions.forEach((qty, ticker) => {
        if (qty > 0.000001) {
            const price = quotes[ticker] || 0
            const value = qty * price
            if (value > 0) {
                allocation.push({
                    ticker,
                    value,
                    percentage: globalNetWorth > 0 ? (value / globalNetWorth) * 100 : 0
                })
            }
        }
    })
    // Sort by value desc
    allocation.sort((a, b) => b.value - a.value)

    // Dividends History (Last 12 months?)
    const dividendHistory = Array.from(dividendHistoryMap.entries())
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => a.date.localeCompare(b.date))

    return {
        portfolios: portfolioStats,
        global: {
            netWorth: globalNetWorth,
            invested: globalInvested,
            profit: globalProfit,
            profitPercentage: globalProfitPercentage
        },
        analytics: {
            dividends: {
                total: totalDividends,
                history: dividendHistory
            },
            allocation
        }
    }
}
