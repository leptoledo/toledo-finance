'use client'

import { useState } from 'react'
import { Investment } from '@/lib/investments'
import { Trash2, Edit, TrendingUp, TrendingDown, Building, Bitcoin, Home, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteInvestment } from '@/app/(dashboard)/investments/actions'
import { EditInvestmentDialog } from './edit-investment-dialog'

interface InvestmentCardProps {
    investment: Investment
}

const investmentTypeIcons = {
    stocks: TrendingUp,
    bonds: Building,
    crypto: Bitcoin,
    real_estate: Home,
    other: Briefcase
}

const investmentTypeLabels = {
    stocks: 'Ações',
    bonds: 'Títulos',
    crypto: 'Criptomoedas',
    real_estate: 'Imóveis',
    other: 'Outros'
}

const investmentTypeColors = {
    stocks: { border: 'border-blue-500/20', bg: 'from-blue-500/10 via-blue-500/5', gradient: 'from-blue-500 to-cyan-600', shadow: 'shadow-blue-500/50', text: 'text-blue-400' },
    bonds: { border: 'border-green-500/20', bg: 'from-green-500/10 via-green-500/5', gradient: 'from-green-500 to-emerald-600', shadow: 'shadow-green-500/50', text: 'text-green-400' },
    crypto: { border: 'border-orange-500/20', bg: 'from-orange-500/10 via-orange-500/5', gradient: 'from-orange-500 to-amber-600', shadow: 'shadow-orange-500/50', text: 'text-orange-400' },
    real_estate: { border: 'border-purple-500/20', bg: 'from-purple-500/10 via-purple-500/5', gradient: 'from-purple-500 to-violet-600', shadow: 'shadow-purple-500/50', text: 'text-purple-400' },
    other: { border: 'border-gray-500/20', bg: 'from-gray-500/10 via-gray-500/5', gradient: 'from-gray-500 to-slate-600', shadow: 'shadow-gray-500/50', text: 'text-gray-400' }
}

export function InvestmentCard({ investment }: InvestmentCardProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    const Icon = investmentTypeIcons[investment.type]
    const colors = investmentTypeColors[investment.type]

    const invested = Number(investment.amount_invested)
    const current = Number(investment.current_value)
    const returnValue = current - invested
    const returnPercentage = invested > 0 ? (returnValue / invested) * 100 : 0
    const isPositive = returnValue >= 0

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR')
    }

    const handleDelete = async () => {
        if (!confirm(`Tem certeza que deseja excluir o investimento "${investment.name}"?`)) return
        setIsDeleting(true)
        await deleteInvestment(investment.id)
    }

    return (
        <>
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
                                <h3 className="text-lg font-semibold text-white">{investment.name}</h3>
                                <p className="text-xs text-gray-400">{investmentTypeLabels[investment.type]}</p>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsEditDialogOpen(true)}
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

                    {/* Values */}
                    <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Investido</span>
                            <span className="text-sm font-semibold text-white">{formatCurrency(invested)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Valor Atual</span>
                            <span className={`text-sm font-semibold ${colors.text}`}>{formatCurrency(current)}</span>
                        </div>
                        <div className="h-px bg-white/5" />
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-400">Retorno</span>
                            <div className="text-right">
                                <p className={`text-sm font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                    {formatCurrency(returnValue)}
                                </p>
                                <p className={`text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                    {isPositive ? '+' : ''}{returnPercentage.toFixed(2)}%
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Purchase Date */}
                    <div className="text-xs text-gray-400">
                        Comprado em: {formatDate(investment.purchase_date)}
                    </div>

                    {/* Notes */}
                    {investment.notes && (
                        <div className="mt-3 pt-3 border-t border-white/5">
                            <p className="text-xs text-gray-400 line-clamp-2">{investment.notes}</p>
                        </div>
                    )}
                </div>
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${colors.bg} to-transparent pointer-events-none`} />
            </div>

            <EditInvestmentDialog
                investment={investment}
                isOpen={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
            />
        </>
    )
}
