'use client'

import { useState } from 'react'
import { Target, Plus, TrendingUp, CheckCircle, Clock, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Goal } from '@/lib/goals'
import { GoalCard } from './goal-card'
import { AddGoalDialog } from './add-goal-dialog'

interface GoalsViewProps {
    goals: Goal[]
    summary: {
        totalTarget: number
        totalCurrent: number
        totalGoals: number
        completedGoals: number
        activeGoals: number
        overallProgress: number
    }
}

export function GoalsView({ goals, summary }: GoalsViewProps) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value)
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                        <span className="bg-linear-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                            Metas Financeiras
                        </span>
                    </h2>
                    <p className="text-muted-foreground">
                        Defina e acompanhe seus objetivos financeiros.
                    </p>
                </div>
                <Button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="w-full sm:w-auto bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg shadow-orange-500/50 transition-all hover-lift"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Meta
                </Button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Overall Progress */}
                <div className="group relative overflow-hidden rounded-2xl glass border border-orange-500/20 hover-lift">
                    <div className="absolute inset-0 bg-linear-to-br from-orange-500/10 via-amber-500/5 to-transparent" />
                    <div className="relative p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-linear-to-br from-orange-500 to-amber-600 shadow-lg shadow-orange-500/50">
                                <Target className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-xs font-medium text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full">
                                {summary.overallProgress.toFixed(0)}%
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-400">Progresso Geral</p>
                            <p className="text-3xl font-bold text-orange-400">{formatCurrency(summary.totalCurrent)}</p>
                            <p className="text-xs text-muted-foreground">de {formatCurrency(summary.totalTarget)}</p>
                        </div>
                        <div className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-linear-to-r from-orange-500 to-amber-600 transition-all duration-500"
                                style={{ width: `${Math.min(summary.overallProgress, 100)}%` }}
                            />
                        </div>
                    </div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-br from-orange-500/5 to-transparent pointer-events-none" />
                </div>

                {/* Active Goals */}
                <div className="group relative overflow-hidden rounded-2xl glass border border-blue-500/20 hover-lift">
                    <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-cyan-500/5 to-transparent" />
                    <div className="relative p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-linear-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/50">
                                <Clock className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-400">Metas Ativas</p>
                            <p className="text-3xl font-bold text-blue-400">{summary.activeGoals}</p>
                            <p className="text-xs text-muted-foreground">em andamento</p>
                        </div>
                    </div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-br from-blue-500/5 to-transparent pointer-events-none" />
                </div>

                {/* Completed Goals */}
                <div className="group relative overflow-hidden rounded-2xl glass border border-green-500/20 hover-lift">
                    <div className="absolute inset-0 bg-linear-to-br from-green-500/10 via-emerald-500/5 to-transparent" />
                    <div className="relative p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-linear-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/50">
                                <CheckCircle className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-400">Metas Concluídas</p>
                            <p className="text-3xl font-bold text-green-400">{summary.completedGoals}</p>
                            <p className="text-xs text-muted-foreground">alcançadas</p>
                        </div>
                    </div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-br from-green-500/5 to-transparent pointer-events-none" />
                </div>

                {/* Total Goals */}
                <div className="group relative overflow-hidden rounded-2xl glass border border-purple-500/20 hover-lift">
                    <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 via-violet-500/5 to-transparent" />
                    <div className="relative p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-linear-to-br from-purple-500 to-violet-600 shadow-lg shadow-purple-500/50">
                                <DollarSign className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-400">Total de Metas</p>
                            <p className="text-3xl font-bold text-purple-400">{summary.totalGoals}</p>
                            <p className="text-xs text-muted-foreground">cadastradas</p>
                        </div>
                    </div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-br from-purple-500/5 to-transparent pointer-events-none" />
                </div>
            </div>

            {/* Goals List */}
            {goals.length > 0 ? (
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-white">
                        Suas Metas ({goals.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {goals.map((goal) => (
                            <GoalCard key={goal.id} goal={goal} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="relative overflow-hidden rounded-2xl glass border border-orange-500/20 p-12">
                    <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 via-amber-500/5 to-transparent" />
                    <div className="relative text-center space-y-4">
                        <div className="inline-flex p-4 rounded-2xl bg-linear-to-br from-orange-500 to-amber-600 shadow-lg shadow-orange-500/50">
                            <Target className="h-12 w-12 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Nenhuma Meta Criada</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Você ainda não criou nenhuma meta financeira. Clique no botão acima para definir seu primeiro objetivo.
                        </p>
                    </div>
                </div>
            )}

            {/* Add Goal Dialog */}
            <AddGoalDialog
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
            />
        </div>
    )
}
