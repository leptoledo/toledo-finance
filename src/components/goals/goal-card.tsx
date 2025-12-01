'use client'

import { useState } from 'react'
import { Goal } from '@/lib/goals'
import { Trash2, Plus, Minus, Calendar, PiggyBank, TrendingUp, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { deleteGoal, updateGoalProgress } from '@/app/(dashboard)/goals/actions'

interface GoalCardProps {
    goal: Goal
}

const goalTypeIcons = {
    savings: PiggyBank,
    investment: TrendingUp,
    debt_payment: CreditCard
}

const goalTypeLabels = {
    savings: 'Economia',
    investment: 'Investimento',
    debt_payment: 'Pagamento de Dívida'
}

const goalTypeColors = {
    savings: { border: 'border-green-500/20', bg: 'from-green-500/10 via-green-500/5', gradient: 'from-green-500 to-emerald-600', shadow: 'shadow-green-500/50', text: 'text-green-400' },
    investment: { border: 'border-purple-500/20', bg: 'from-purple-500/10 via-purple-500/5', gradient: 'from-purple-500 to-violet-600', shadow: 'shadow-purple-500/50', text: 'text-purple-400' },
    debt_payment: { border: 'border-red-500/20', bg: 'from-red-500/10 via-rose-500/5', gradient: 'from-red-500 to-rose-600', shadow: 'shadow-red-500/50', text: 'text-red-400' }
}

export function GoalCard({ goal }: GoalCardProps) {
    const [isUpdating, setIsUpdating] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showUpdateInput, setShowUpdateInput] = useState(false)
    const [updateAmount, setUpdateAmount] = useState('')

    const Icon = goalTypeIcons[goal.type]
    const colors = goalTypeColors[goal.type]
    const progress = Number(goal.progress_percent)
    const isCompleted = progress >= 100

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value)
    }

    const formatDate = (dateString: string | null) => {
        if (!dateString) return null
        return new Date(dateString).toLocaleDateString('pt-BR')
    }

    const handleUpdateProgress = async (increment: number) => {
        setIsUpdating(true)
        const newAmount = Number(goal.current_amount) + increment
        await updateGoalProgress(goal.id, newAmount)
        setIsUpdating(false)
    }

    const handleCustomUpdate = async () => {
        if (!updateAmount) return
        setIsUpdating(true)
        await updateGoalProgress(goal.id, parseFloat(updateAmount))
        setUpdateAmount('')
        setShowUpdateInput(false)
        setIsUpdating(false)
    }

    const handleDelete = async () => {
        if (!confirm(`Tem certeza que deseja excluir a meta "${goal.name}"?`)) return
        setIsDeleting(true)
        await deleteGoal(goal.id)
    }

    return (
        <div className={`group relative overflow-hidden rounded-2xl glass border ${colors.border} hover-lift`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} to-transparent`} />
            <div className="relative p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.gradient} shadow-lg ${colors.shadow}`}>
                            <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">{goal.name}</h3>
                            <p className="text-xs text-gray-400">{goalTypeLabels[goal.type]}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-400"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>

                {/* Description */}
                {goal.description && (
                    <p className="text-sm text-gray-400 mb-4">{goal.description}</p>
                )}

                {/* Progress */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Progresso</span>
                        <span className={`text-sm font-semibold ${colors.text}`}>{progress.toFixed(1)}%</span>
                    </div>
                    <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full bg-gradient-to-r ${colors.gradient} transition-all duration-500`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className={`font-bold ${colors.text}`}>{formatCurrency(Number(goal.current_amount))}</span>
                        <span className="text-gray-400">de {formatCurrency(Number(goal.target_amount))}</span>
                    </div>
                </div>

                {/* Deadline */}
                {goal.deadline && (
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                        <Calendar className="h-3 w-3" />
                        <span>Prazo: {formatDate(goal.deadline)}</span>
                    </div>
                )}

                {/* Status Badge */}
                {isCompleted && (
                    <div className="mb-4">
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                            <span className="text-xs font-medium text-green-400">✓ Meta Alcançada!</span>
                        </div>
                    </div>
                )}

                {/* Update Controls */}
                {!isCompleted && (
                    <div className="space-y-3 pt-4 border-t border-white/5">
                        {!showUpdateInput ? (
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleUpdateProgress(100)}
                                    disabled={isUpdating}
                                    className="flex-1 border-white/10 hover:bg-white/5"
                                >
                                    <Plus className="h-3 w-3 mr-1" />
                                    R$ 100
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleUpdateProgress(500)}
                                    disabled={isUpdating}
                                    className="flex-1 border-white/10 hover:bg-white/5"
                                >
                                    <Plus className="h-3 w-3 mr-1" />
                                    R$ 500
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => setShowUpdateInput(true)}
                                    className={`flex-1 bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white`}
                                >
                                    Outro
                                </Button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Valor"
                                    value={updateAmount}
                                    onChange={(e) => setUpdateAmount(e.target.value)}
                                    className="flex-1 bg-gray-800/50 border-white/10"
                                />
                                <Button
                                    size="sm"
                                    onClick={handleCustomUpdate}
                                    disabled={isUpdating || !updateAmount}
                                    className={`bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white`}
                                >
                                    OK
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        setShowUpdateInput(false)
                                        setUpdateAmount('')
                                    }}
                                    className="border-white/10 hover:bg-white/5"
                                >
                                    ✕
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${colors.bg} to-transparent pointer-events-none`} />
        </div>
    )
}
