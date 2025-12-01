'use client'

import { BarChart3, TrendingUp, TrendingDown, PieChart, DollarSign, Percent } from 'lucide-react'
import { AnalysisSummary } from '@/lib/analysis'
import { MonthlyTrendChart } from './monthly-trend-chart'
import { CategoryPieChart } from './category-pie-chart'

interface AnalysisViewProps {
    data: AnalysisSummary
}

export function AnalysisView({ data }: AnalysisViewProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value)
    }

    const formatPercent = (value: number) => {
        return `${value.toFixed(1)}%`
    }

    const isPositiveBalance = data.netBalance >= 0

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                    <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                        Análise Financeira
                    </span>
                </h2>
                <p className="text-muted-foreground">
                    Visualize tendências e insights dos últimos 6 meses.
                </p>
            </div>

            {/* Summary KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Income */}
                <div className="group relative overflow-hidden rounded-2xl glass border border-green-500/20 hover-lift">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent" />
                    <div className="relative p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/50">
                                <TrendingUp className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-xs font-medium text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
                                Receitas
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-400">Total de Receitas</p>
                            <p className="text-3xl font-bold text-green-400">{formatCurrency(data.totalIncome)}</p>
                            <p className="text-xs text-muted-foreground">Média: {formatCurrency(data.averageMonthlyIncome)}/mês</p>
                        </div>
                    </div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none" />
                </div>

                {/* Total Expenses */}
                <div className="group relative overflow-hidden rounded-2xl glass border border-red-500/20 hover-lift">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-rose-500/5 to-transparent" />
                    <div className="relative p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/50">
                                <TrendingDown className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-xs font-medium text-red-400 bg-red-500/10 px-3 py-1 rounded-full">
                                Despesas
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-400">Total de Despesas</p>
                            <p className="text-3xl font-bold text-red-400">{formatCurrency(data.totalExpenses)}</p>
                            <p className="text-xs text-muted-foreground">Média: {formatCurrency(data.averageMonthlyExpenses)}/mês</p>
                        </div>
                    </div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />
                </div>

                {/* Net Balance */}
                <div className={`group relative overflow-hidden rounded-2xl glass border ${isPositiveBalance ? 'border-blue-500/20' : 'border-yellow-500/20'} hover-lift`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${isPositiveBalance ? 'from-blue-500/10 via-cyan-500/5' : 'from-yellow-500/10 via-amber-500/5'} to-transparent`} />
                    <div className="relative p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${isPositiveBalance ? 'from-blue-500 to-cyan-600 shadow-blue-500/50' : 'from-yellow-500 to-amber-600 shadow-yellow-500/50'} shadow-lg`}>
                                <DollarSign className="h-6 w-6 text-white" />
                            </div>
                            <div className={`text-xs font-medium ${isPositiveBalance ? 'text-blue-400 bg-blue-500/10' : 'text-yellow-400 bg-yellow-500/10'} px-3 py-1 rounded-full`}>
                                {isPositiveBalance ? 'Superávit' : 'Déficit'}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-400">Saldo Líquido</p>
                            <p className={`text-3xl font-bold ${isPositiveBalance ? 'text-blue-400' : 'text-yellow-400'}`}>
                                {formatCurrency(data.netBalance)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Taxa de poupança: {formatPercent(data.savingsRate)}
                            </p>
                        </div>
                    </div>
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${isPositiveBalance ? 'from-blue-500/5' : 'from-yellow-500/5'} to-transparent pointer-events-none`} />
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Trend Chart */}
                <div className="relative overflow-hidden rounded-2xl glass border border-indigo-500/20 p-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent" />
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/50">
                                <BarChart3 className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Tendência Mensal</h3>
                                <p className="text-xs text-gray-400">Receitas vs Despesas</p>
                            </div>
                        </div>
                        <MonthlyTrendChart data={data.monthlyTrend} />
                    </div>
                </div>

                {/* Category Pie Chart */}
                <div className="relative overflow-hidden rounded-2xl glass border border-purple-500/20 p-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-transparent" />
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/50">
                                <PieChart className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Despesas por Categoria</h3>
                                <p className="text-xs text-gray-400">Distribuição percentual</p>
                            </div>
                        </div>
                        <CategoryPieChart data={data.expensesByCategory} />
                    </div>
                </div>
            </div>

            {/* Top Category */}
            {data.topExpenseCategory && (
                <div className="relative overflow-hidden rounded-2xl glass border border-orange-500/20 p-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-amber-500/5 to-transparent" />
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg shadow-orange-500/50">
                                <Percent className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Maior Categoria de Despesa</h3>
                                <p className="text-xs text-gray-400">Onde você mais gasta</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {data.topExpenseCategory.icon && (
                                    <span className="text-3xl">{data.topExpenseCategory.icon}</span>
                                )}
                                <div>
                                    <p className="text-xl font-semibold text-white">{data.topExpenseCategory.category}</p>
                                    <p className="text-sm text-gray-400">
                                        {formatPercent(data.topExpenseCategory.percentage)} do total
                                    </p>
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-orange-400">
                                {formatCurrency(data.topExpenseCategory.amount)}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
