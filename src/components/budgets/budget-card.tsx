'use client'

import { Budget } from '@/lib/budgets'
import { Trash2, Edit, AlertTriangle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { deleteBudget } from '@/app/(dashboard)/budgets/actions'
import { EditBudgetDialog } from './edit-budget-dialog'

interface BudgetCardProps {
    budget: Budget
}

export function BudgetCard({ budget }: BudgetCardProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)

    const percentage = budget.limit_amount > 0
        ? (Number(budget.spent_amount) / Number(budget.limit_amount)) * 100
        : 0

    const isOverBudget = Number(budget.spent_amount) > Number(budget.limit_amount)
    const isNearLimit = percentage >= 80 && !isOverBudget

    const handleDelete = async () => {
        if (!confirm('Tem certeza que deseja excluir este orçamento?')) return

        setIsDeleting(true)
        const result = await deleteBudget(budget.id)

        if (result.error) {
            alert(result.error)
            setIsDeleting(false)
        }
    }

    const formattedLimit = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(Number(budget.limit_amount))

    const formattedSpent = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(Number(budget.spent_amount))

    const remaining = Number(budget.limit_amount) - Number(budget.spent_amount)
    const formattedRemaining = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(Math.abs(remaining))

    return (
        <>
            <div className="group relative overflow-hidden rounded-2xl glass border border-pink-500/20 hover-lift">
                {/* Background gradient */}
                <div className={`absolute inset-0 ${isOverBudget
                    ? 'bg-linear-to-br from-red-500/10 via-rose-500/5 to-transparent'
                    : isNearLimit
                        ? 'bg-linear-to-br from-yellow-500/10 via-amber-500/5 to-transparent'
                        : 'bg-linear-to-br from-pink-500/10 via-rose-500/5 to-transparent'
                    }`} />

                <div className="relative p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3 flex-1">
                            <div className={`p-3 rounded-xl shadow-lg ${isOverBudget
                                ? 'bg-linear-to-br from-red-500 to-rose-600 shadow-red-500/50'
                                : isNearLimit
                                    ? 'bg-linear-to-br from-yellow-500 to-amber-600 shadow-yellow-500/50'
                                    : 'bg-linear-to-br from-pink-500 to-rose-600 shadow-pink-500/50'
                                }`}>
                                {budget.category?.icon ? (
                                    <span className="text-2xl">{budget.category.icon}</span>
                                ) : (
                                    <span className="text-white text-lg">💰</span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-white truncate">
                                    {budget.name}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    {budget.category?.name} • Limite: {formattedLimit}
                                </p>
                                {budget.description && (
                                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                                        {budget.description}
                                    </p>
                                )}
                                {budget.due_date && (
                                    <p className="text-xs text-pink-400 mt-1">
                                        Vence: {new Date(budget.due_date).toLocaleDateString('pt-BR')}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsEditOpen(true)}
                                className="h-8 w-8 p-0 hover:bg-white/10"
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
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
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Pago</span>
                            <span className={`font-semibold ${isOverBudget ? 'text-red-400' : isNearLimit ? 'text-yellow-400' : 'text-pink-400'
                                }`}>
                                {percentage.toFixed(1)}%
                            </span>
                        </div>
                        <div className="h-3 bg-gray-800/50 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-300 ${isOverBudget
                                    ? 'bg-linear-to-r from-red-500 to-rose-600'
                                    : isNearLimit
                                        ? 'bg-linear-to-r from-yellow-500 to-amber-600'
                                        : 'bg-linear-to-r from-pink-500 to-rose-600'
                                    }`}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Pago</p>
                            <p className="text-lg font-bold text-white">{formattedSpent}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 mb-1">
                                {remaining >= 0 ? 'Restante' : 'Excedido'}
                            </p>
                            <p className={`text-lg font-bold ${remaining >= 0 ? 'text-green-400' : 'text-red-400'
                                }`}>
                                {remaining >= 0 ? formattedRemaining : `-${formattedRemaining}`}
                            </p>
                        </div>
                    </div>

                    {/* Status Badge */}
                    {isOverBudget && (
                        <div className="mt-4 flex items-center gap-2 text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Orçamento excedido!</span>
                        </div>
                    )}
                    {isNearLimit && !isOverBudget && (
                        <div className="mt-4 flex items-center gap-2 text-xs text-yellow-400 bg-yellow-500/10 px-3 py-2 rounded-lg">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Próximo do limite</span>
                        </div>
                    )}
                    {!isOverBudget && !isNearLimit && percentage > 0 && (
                        <div className="mt-4 flex items-center gap-2 text-xs text-green-400 bg-green-500/10 px-3 py-2 rounded-lg">
                            <CheckCircle className="h-4 w-4" />
                            <span>Dentro do orçamento</span>
                        </div>
                    )}
                </div>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-br from-pink-500/5 to-transparent pointer-events-none" />
            </div>

            <EditBudgetDialog
                budget={budget}
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
            />
        </>
    )
}
