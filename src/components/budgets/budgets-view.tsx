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
    categories: Array<{ id: string; name: string; icon: string | null }>
}

export function BudgetsView({ budgets, summary, categories }: BudgetsViewProps) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                        <span className="bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">
                            Orçamentos
                        </span>
                    </h2>
                    <p className="text-muted-foreground">
                        Defina e acompanhe seus orçamentos.
                    </p>
                </div>
                <Button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-lg shadow-pink-500/50 transition-all hover-lift"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Orçamento
                </Button>
            </div>

            {/* Summary Cards */}
            <BudgetSummary {...summary} />

            {/* Budgets List */}
            {budgets.length > 0 ? (
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-white">
                        Orçamentos Ativos ({budgets.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {budgets.map((budget) => (
                            <BudgetCard key={budget.id} budget={budget} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="relative overflow-hidden rounded-2xl glass border border-pink-500/20 p-12">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-rose-500/5 to-transparent" />
                    <div className="relative text-center space-y-4">
                        <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/50">
                            <Plus className="h-12 w-12 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Nenhum Orçamento Criado</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Você ainda não criou nenhum orçamento para este mês. Clique no botão acima para começar a controlar seus gastos.
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
