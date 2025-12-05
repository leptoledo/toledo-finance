'use client'

import { useState } from 'react'
import { TrendingUp, Plus, Wallet, DollarSign, Percent, PieChart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Investment, InvestmentSummary } from '@/lib/investments'
import { InvestmentCard } from './investment-card'
import { AddInvestmentDialog } from './add-investment-dialog'

interface InvestmentsViewProps {
    investments: Investment[]
    summary: InvestmentSummary
    accounts: { id: string; name: string }[]
}

export function InvestmentsView({ investments, summary, accounts }: InvestmentsViewProps) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value)
    }

    const formatPercent = (value: number) => {
        const sign = value >= 0 ? '+' : ''
        return `${sign}${value.toFixed(2)}%`
    }

    const isPositiveReturn = summary.totalReturn >= 0

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                        <span className="bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                            Investimentos
                        </span>
                    </h2>
                    <p className="text-muted-foreground">
                        Gerencie e acompanhe sua carteira de investimentos.
                    </p>
                </div>
                <Button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="w-full sm:w-auto bg-linear-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg shadow-purple-500/50 transition-all hover-lift"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Investimento
                </Button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Invested */}
                <div className="group relative overflow-hidden rounded-2xl glass border border-blue-500/20 hover-lift">
                    <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-cyan-500/5 to-transparent" />
                    <div className="relative p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-linear-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/50">
                                <Wallet className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-400">Total Investido</p>
                            <p className="text-3xl font-bold text-blue-400">{formatCurrency(summary.totalInvested)}</p>
                        </div>
                    </div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-br from-blue-500/5 to-transparent pointer-events-none" />
                </div>

                {/* Current Value */}
                <div className="group relative overflow-hidden rounded-2xl glass border border-purple-500/20 hover-lift">
                    <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 via-violet-500/5 to-transparent" />
                    <div className="relative p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-linear-to-br from-purple-500 to-violet-600 shadow-lg shadow-purple-500/50">
                                <DollarSign className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-400">Valor Atual</p>
                            <p className="text-3xl font-bold text-purple-400">{formatCurrency(summary.currentValue)}</p>
                        </div>
                    </div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-br from-purple-500/5 to-transparent pointer-events-none" />
                </div>

                {/* Total Return */}
                <div className={`group relative overflow-hidden rounded-2xl glass border ${isPositiveReturn ? 'border-green-500/20' : 'border-red-500/20'} hover-lift`}>
                    <div className={`absolute inset-0 bg-linear-to-br ${isPositiveReturn ? 'from-green-500/10 via-emerald-500/5' : 'from-red-500/10 via-rose-500/5'} to-transparent`} />
                    <div className="relative p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-linear-to-br ${isPositiveReturn ? 'from-green-500 to-emerald-600 shadow-green-500/50' : 'from-red-500 to-rose-600 shadow-red-500/50'} shadow-lg`}>
                                <TrendingUp className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-400">Retorno Total</p>
                            <p className={`text-3xl font-bold ${isPositiveReturn ? 'text-green-400' : 'text-red-400'}`}>
                                {formatCurrency(summary.totalReturn)}
                            </p>
                        </div>
                    </div>
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-br ${isPositiveReturn ? 'from-green-500/5' : 'from-red-500/5'} to-transparent pointer-events-none`} />
                </div>

                {/* Return Percentage */}
                <div className={`group relative overflow-hidden rounded-2xl glass border ${isPositiveReturn ? 'border-emerald-500/20' : 'border-orange-500/20'} hover-lift`}>
                    <div className={`absolute inset-0 bg-linear-to-br ${isPositiveReturn ? 'from-emerald-500/10 via-green-500/5' : 'from-orange-500/10 via-amber-500/5'} to-transparent`} />
                    <div className="relative p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-linear-to-br ${isPositiveReturn ? 'from-emerald-500 to-green-600 shadow-emerald-500/50' : 'from-orange-500 to-amber-600 shadow-orange-500/50'} shadow-lg`}>
                                <Percent className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-400">Rentabilidade</p>
                            <p className={`text-3xl font-bold ${isPositiveReturn ? 'text-emerald-400' : 'text-orange-400'}`}>
                                {formatPercent(summary.returnPercentage)}
                            </p>
                        </div>
                    </div>
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-br ${isPositiveReturn ? 'from-emerald-500/5' : 'from-orange-500/5'} to-transparent pointer-events-none`} />
                </div>
            </div>

            {/* Investments List */}
            {investments.length > 0 ? (
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-white">
                        Meus Investimentos ({investments.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {investments.map((investment) => (
                            <InvestmentCard key={investment.id} investment={investment} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="relative overflow-hidden rounded-2xl glass border border-purple-500/20 p-12">
                    <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 via-pink-500/5 to-transparent" />
                    <div className="relative text-center space-y-4">
                        <div className="inline-flex p-4 rounded-2xl bg-linear-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/50">
                            <PieChart className="h-12 w-12 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Nenhum Investimento Cadastrado</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Você ainda não cadastrou nenhum investimento. Clique no botão acima para adicionar seu primeiro ativo.
                        </p>
                    </div>
                </div>
            )}

            {/* Add Investment Dialog */}
            <AddInvestmentDialog
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                accounts={accounts}
            />
        </div>
    )
}
