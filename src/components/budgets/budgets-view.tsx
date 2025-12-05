'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Budget } from '@/lib/budgets'
import { BudgetSummary } from './budget-summary'
import { BudgetCard } from './budget-card'
import { AddBudgetDialog } from './add-budget-dialog'

interface BudgetsViewProps {
    budgets: Budget[]
    summary: {
        totalLimit: number
        totalSpent: number
        remaining: number
        percentageUsed: number
        budgetCount: number
        overBudgetCount: number
    }
    categories: Array<{ id: string; name: string; icon: string | null; type: string }>
}

export function BudgetsView({ budgets, summary, categories }: BudgetsViewProps) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [activeType, setActiveType] = useState<'expense' | 'income'>('expense')
    const [activePeriod, setActivePeriod] = useState<string>('all')

    const filteredBudgets = budgets.filter(b => {
        if (b.type !== activeType) return false
        if (activePeriod !== 'all' && b.period !== activePeriod) return false
        return true
    })

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                        <span className="bg-linear-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">
                            Planejamento Financeiro
                        </span>
                    </h2>
                    <p className="text-muted-foreground">
                        Defina e acompanhe suas metas de despesas e receitas.
                    </p>
                </div>
                <Button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="w-full sm:w-auto bg-linear-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-lg shadow-pink-500/50 transition-all hover-lift"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Planejamento
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex gap-2 bg-black/20 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveType('expense')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeType === 'expense' ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25' : 'text-gray-400 hover:text-white'}`}
                    >
                        Despesas
                    </button>
                    <button
                        onClick={() => setActiveType('income')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeType === 'income' ? 'bg-green-500 text-white shadow-lg shadow-green-500/25' : 'text-gray-400 hover:text-white'}`}
                    >
                        Receitas
                    </button>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                    {['all', 'daily', 'weekly', 'monthly', 'yearly'].map((period) => (
                        <button
                            key={period}
                            onClick={() => setActivePeriod(period)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${activePeriod === period
                                ? 'bg-white/10 border-white/20 text-white'
                                : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {period === 'all' && 'Todos'}
                            {period === 'daily' && 'Diário'}
                            {period === 'weekly' && 'Semanal'}
                            {period === 'monthly' && 'Mensal'}
                            {period === 'yearly' && 'Anual'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary Cards */}
            <div className={activeType === 'income' ? 'hidden' : 'block'}>
                <BudgetSummary {...summary} />
            </div>

            {/* Budgets List */}
            {filteredBudgets.length > 0 ? (
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-white">
                        Planejamentos Ativos ({filteredBudgets.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBudgets.map((budget) => (
                            <BudgetCard key={budget.id} budget={budget} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="relative overflow-hidden rounded-2xl glass border border-pink-500/20 p-12">
                    <div className="absolute inset-0 bg-linear-to-br from-pink-500/5 via-rose-500/5 to-transparent" />
                    <div className="relative text-center space-y-4">
                        <div className="inline-flex p-4 rounded-2xl bg-linear-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/50">
                            <Plus className="h-12 w-12 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Nenhum Planejamento Criado</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Você ainda não criou nenhum planejamento. Clique no botão acima para começar a controlar suas finanças.
                        </p>
                    </div>
                </div>
            )}

            {/* Add Budget Dialog */}
            <AddBudgetDialog
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                categories={categories}
            />
        </div>
    )
}
