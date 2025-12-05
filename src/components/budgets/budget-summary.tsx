'use client'

import { TrendingDown, AlertCircle, CheckCircle2, PiggyBank } from 'lucide-react'

interface BudgetSummaryProps {
    totalLimit: number
    totalSpent: number
    remaining: number
    percentageUsed: number
    budgetCount: number
    overBudgetCount: number
}

export function BudgetSummary({
    totalLimit,
    totalSpent,
    remaining,
    percentageUsed,
    budgetCount,
    overBudgetCount
}: BudgetSummaryProps) {
    const formattedLimit = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(totalLimit)

    const formattedSpent = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(totalSpent)

    const formattedRemaining = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(Math.abs(remaining))

    const isOverBudget = remaining < 0
    const isNearLimit = percentageUsed >= 80 && !isOverBudget

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Limit */}
            <div className="group relative overflow-hidden rounded-2xl glass border border-pink-500/20 hover-lift">
                <div className="absolute inset-0 bg-linear-to-br from-pink-500/10 via-rose-500/5 to-transparent" />
                <div className="relative p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-linear-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/50">
                            <PiggyBank className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-xs font-medium text-pink-400 bg-pink-500/10 px-3 py-1 rounded-full">
                            Limite Total
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-400">Orçamento Total</p>
                        <p className="text-3xl font-bold text-pink-400">{formattedLimit}</p>
                        <p className="text-xs text-muted-foreground">{budgetCount} orçamento(s) ativo(s)</p>
                    </div>
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-br from-pink-500/5 to-transparent pointer-events-none" />
            </div>

            {/* Total Spent */}
            <div className="group relative overflow-hidden rounded-2xl glass border border-red-500/20 hover-lift">
                <div className="absolute inset-0 bg-linear-to-br from-red-500/10 via-rose-500/5 to-transparent" />
                <div className="relative p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-linear-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/50">
                            <TrendingDown className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-xs font-medium text-red-400 bg-red-500/10 px-3 py-1 rounded-full">
                            Pago
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-400">Total Pago</p>
                        <p className="text-3xl font-bold text-red-400">{formattedSpent}</p>
                        <p className="text-xs text-muted-foreground">{percentageUsed.toFixed(1)}% do orçamento</p>
                    </div>
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-br from-red-500/5 to-transparent pointer-events-none" />
            </div>

            {/* Remaining */}
            <div className={`group relative overflow-hidden rounded-2xl glass border ${isOverBudget ? 'border-red-500/20' : 'border-green-500/20'
                } hover-lift`}>
                <div className={`absolute inset-0 ${isOverBudget
                    ? 'bg-linear-to-br from-red-500/10 via-rose-500/5 to-transparent'
                    : 'bg-linear-to-br from-green-500/10 via-emerald-500/5 to-transparent'
                    }`} />
                <div className="relative p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl shadow-lg ${isOverBudget
                            ? 'bg-linear-to-br from-red-500 to-rose-600 shadow-red-500/50'
                            : 'bg-linear-to-br from-green-500 to-emerald-600 shadow-green-500/50'
                            }`}>
                            {isOverBudget ? (
                                <AlertCircle className="h-6 w-6 text-white" />
                            ) : (
                                <CheckCircle2 className="h-6 w-6 text-white" />
                            )}
                        </div>
                        <div className={`text-xs font-medium px-3 py-1 rounded-full ${isOverBudget
                            ? 'text-red-400 bg-red-500/10'
                            : 'text-green-400 bg-green-500/10'
                            }`}>
                            {isOverBudget ? 'Excedido' : 'Disponível'}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-400">
                            {isOverBudget ? 'Valor Excedido' : 'Saldo Restante'}
                        </p>
                        <p className={`text-3xl font-bold ${isOverBudget ? 'text-red-400' : 'text-green-400'
                            }`}>
                            {isOverBudget ? `-${formattedRemaining}` : formattedRemaining}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {isOverBudget ? 'Acima do limite' : 'Dentro do orçamento'}
                        </p>
                    </div>
                </div>
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isOverBudget
                    ? 'bg-linear-to-br from-red-500/5 to-transparent'
                    : 'bg-linear-to-br from-green-500/5 to-transparent'
                    } pointer-events-none`} />
            </div>

            {/* Status */}
            <div className={`group relative overflow-hidden rounded-2xl glass border ${overBudgetCount > 0 ? 'border-yellow-500/20' : 'border-blue-500/20'
                } hover-lift`}>
                <div className={`absolute inset-0 ${overBudgetCount > 0
                    ? 'bg-linear-to-br from-yellow-500/10 via-amber-500/5 to-transparent'
                    : 'bg-linear-to-br from-blue-500/10 via-cyan-500/5 to-transparent'
                    }`} />
                <div className="relative p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl shadow-lg ${overBudgetCount > 0
                            ? 'bg-linear-to-br from-yellow-500 to-amber-600 shadow-yellow-500/50'
                            : 'bg-linear-to-br from-blue-500 to-cyan-600 shadow-blue-500/50'
                            }`}>
                            <AlertCircle className="h-6 w-6 text-white" />
                        </div>
                        <div className={`text-xs font-medium px-3 py-1 rounded-full ${overBudgetCount > 0
                            ? 'text-yellow-400 bg-yellow-500/10'
                            : 'text-blue-400 bg-blue-500/10'
                            }`}>
                            Status
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-400">Orçamentos Excedidos</p>
                        <p className={`text-3xl font-bold ${overBudgetCount > 0 ? 'text-yellow-400' : 'text-blue-400'
                            }`}>
                            {overBudgetCount}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {overBudgetCount > 0 ? 'Requer atenção' : 'Tudo sob controle'}
                        </p>
                    </div>
                </div>
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${overBudgetCount > 0
                    ? 'bg-linear-to-br from-yellow-500/5 to-transparent'
                    : 'bg-linear-to-br from-blue-500/5 to-transparent'
                    } pointer-events-none`} />
            </div>
        </div>
    )
}
