import { createClient } from '@/utils/supabase/server'
import { getTrades, getTradingStats, getTradingSettings, Trade } from '@/app/(dashboard)/trading-actions'
import { TradingStats } from '@/components/trading/trading-stats'
import { TradesTable } from '@/components/trading/trades-table'
import { AddTradeDialog } from '@/components/trading/add-trade-dialog'
import { TradingFilters } from '@/components/trading/trading-filters'
import { TradingSettingsDialog } from '@/components/trading/trading-settings-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface TradingPageProps {
    searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function TradingPage({ searchParams }: TradingPageProps) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const resolvedSearchParams = await searchParams
    const filters = {
        startDate: resolvedSearchParams.startDate,
        endDate: resolvedSearchParams.endDate,
        asset: resolvedSearchParams.asset
    }

    const { data: trades } = await getTrades(filters)
    const settings = await getTradingSettings()
    const baseStats = await getTradingStats()

    // Calculate dynamic stats based on Settings
    const currentBalance = (settings?.initial_balance || 0) + baseStats.totalResult
    const monthlyGrowth = settings?.initial_balance && settings.initial_balance > 0
        ? ((currentBalance - settings.initial_balance) / settings.initial_balance) * 100
        : 0

    const stats = {
        ...baseStats,
        initialBalance: settings?.initial_balance || 0,
        currentBalance,
        monthlyGrowth
    }

    const currency = settings?.currency || 'BRL'

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Trading Journal</h2>
                <div className="flex items-center space-x-2">
                    <TradingSettingsDialog
                        initialBalance={settings?.initial_balance || 0}
                        currency={currency}
                    />
                    <AddTradeDialog />
                </div>
            </div>

            <TradingStats stats={stats} currency={currency} />

            <TradingFilters />

            <Card>
                <CardHeader>
                    <CardTitle>Diário de Operações</CardTitle>
                    <CardDescription>
                        Histórico completo das suas operações de Day Trade e Swing Trade.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <TradesTable trades={(trades || []) as Trade[]} currency={currency} />
                </CardContent>
            </Card>
        </div>
    )
}
