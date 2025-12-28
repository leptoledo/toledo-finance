import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Target, Wallet, DollarSign } from 'lucide-react'

interface TradingStatsProps {
    stats: {
        totalTrades: number
        winRate: number
        profitFactor: number
        totalResult: number
        openTrades: number
        currentBalance?: number
        initialBalance?: number
        monthlyGrowth?: number
    }
    currency?: string
}

export function TradingStats({ stats, currency = 'BRL' }: TradingStatsProps) {
    const isProfitable = stats.totalResult >= 0
    const currentBalance = stats.currentBalance || 0
    const initialBalance = stats.initialBalance || 0
    const growth = stats.monthlyGrowth || 0

    // Create formatter
    const formatMoney = (value: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value)

    // Formatter without cents for initial balance if desired, or reuse generic
    const formatMoneyNoCents = (value: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value)

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Banca / Saldo */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Banca Atual</CardTitle>
                    <Wallet className="h-4 w-4 text-indigo-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-indigo-500">
                        {formatMoney(currentBalance)}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                        <span className={growth >= 0 ? "text-emerald-500 mr-1" : "text-rose-500 mr-1"}>
                            {growth >= 0 ? '+' : ''}{growth.toFixed(2)}%
                        </span>
                        <span>sobre inicial ({formatMoneyNoCents(initialBalance)})</span>
                    </div>
                </CardContent>
            </Card>

            {/* Resultado Financeiro */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Lucro/Prejuízo</CardTitle>
                    {isProfitable ? (
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                    ) : (
                        <TrendingDown className="h-4 w-4 text-rose-500" />
                    )}
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${isProfitable ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {formatMoney(stats.totalResult)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {stats.totalTrades} operações finalizadas
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                    <Target className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-500">
                        {stats.winRate.toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Taxa de acerto
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Em Aberto</CardTitle>
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-purple-500">
                        {stats.openTrades}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Posições ativas
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
