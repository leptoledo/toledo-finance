import { TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react'
import Link from 'next/link'

interface KPICardsProps {
    currency: string
    financials: {
        totalIncome: number
        totalExpense: number
        totalBalance: number
    }
    goalsCount: number
}

export function KPICards({ currency, financials, goalsCount }: KPICardsProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: currency,
        }).format(value)
    }

    const cashFlow = financials.totalIncome - financials.totalExpense

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-fade-in">
            {/* Receita Total */}
            <Link href="/income" className="block">
                <div className="group relative overflow-hidden rounded-2xl glass border border-green-500/20 hover-lift cursor-pointer h-full">
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-linear-to-br from-green-500/10 via-emerald-500/5 to-transparent" />

                    <div className="relative p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-linear-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/50">
                                <TrendingUp className="h-5 w-5 text-white" />
                            </div>
                            <div className="text-xs font-medium text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
                                Receitas
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-400">Receita Total do Mês</p>
                            <p className="text-3xl font-bold text-green-400">{formatCurrency(financials.totalIncome)}</p>
                            <p className="text-xs text-muted-foreground">Total de entradas no mês atual</p>
                        </div>
                    </div>

                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-br from-green-500/5 to-transparent pointer-events-none" />
                </div>
            </Link>

            {/* Despesa Total */}
            <Link href="/expenses" className="block">
                <div className="group relative overflow-hidden rounded-2xl glass border border-red-500/20 hover-lift cursor-pointer h-full">
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-linear-to-br from-red-500/10 via-rose-500/5 to-transparent" />

                    <div className="relative p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-linear-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/50">
                                <TrendingDown className="h-5 w-5 text-white" />
                            </div>
                            <div className="text-xs font-medium text-red-400 bg-red-500/10 px-3 py-1 rounded-full">
                                Despesas
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-400">Despesa Total</p>
                            <p className="text-3xl font-bold text-red-400">{formatCurrency(financials.totalExpense)}</p>
                            <p className="text-xs text-muted-foreground">Total de gastos no mês atual</p>
                        </div>
                    </div>

                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-br from-red-500/5 to-transparent pointer-events-none" />
                </div>
            </Link>

            {/* Saldo Consolidado */}
            <div className="group relative overflow-hidden rounded-2xl glass border border-blue-500/20 hover-lift">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-cyan-500/5 to-transparent" />

                <div className="relative p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-linear-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/50">
                            <Wallet className="h-5 w-5 text-white" />
                        </div>
                        <div className="text-xs font-medium text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">
                            Saldo
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-400">Saldo Remanescente</p>
                        <p className="text-3xl font-bold text-blue-400">{formatCurrency(financials.totalBalance)}</p>
                        <p className="text-xs text-muted-foreground">
                            Fluxo: <span className={cashFlow >= 0 ? 'text-green-400' : 'text-red-400'}>{formatCurrency(cashFlow)}</span>
                        </p>
                    </div>
                </div>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-br from-blue-500/5 to-transparent pointer-events-none" />
            </div>

            {/* Metas Ativas */}
            <div className="group relative overflow-hidden rounded-2xl glass border border-purple-500/20 hover-lift">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 via-violet-500/5 to-transparent" />

                <div className="relative p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-linear-to-br from-purple-500 to-violet-600 shadow-lg shadow-purple-500/50">
                            <Target className="h-5 w-5 text-white" />
                        </div>
                        <div className="text-xs font-medium text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full">
                            Metas
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-400">Metas Ativas</p>
                        <p className="text-3xl font-bold text-purple-400">{goalsCount}</p>
                        <p className="text-xs text-muted-foreground">Metas em andamento</p>
                    </div>
                </div>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-br from-purple-500/5 to-transparent pointer-events-none" />
            </div>
        </div>
    )
}
