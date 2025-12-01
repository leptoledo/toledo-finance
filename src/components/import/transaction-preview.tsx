'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react'

interface ParsedTransaction {
    date: string
    description: string
    amount: number
    type: 'income' | 'expense'
}

interface TransactionPreviewProps {
    transactions: ParsedTransaction[]
    onContinue: () => void
    onCancel: () => void
}

export function TransactionPreview({ transactions, onContinue, onCancel }: TransactionPreviewProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value)
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('pt-BR')
    }

    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative overflow-hidden rounded-2xl glass border border-cyan-500/20 p-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-transparent" />
                    <div className="relative">
                        <p className="text-sm font-medium text-gray-400 mb-2">Total de Transações</p>
                        <p className="text-3xl font-bold text-cyan-400">{transactions.length}</p>
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl glass border border-green-500/20 p-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-transparent" />
                    <div className="relative">
                        <p className="text-sm font-medium text-gray-400 mb-2">Receitas</p>
                        <p className="text-3xl font-bold text-green-400">{formatCurrency(totalIncome)}</p>
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl glass border border-red-500/20 p-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-rose-500/5 to-transparent" />
                    <div className="relative">
                        <p className="text-sm font-medium text-gray-400 mb-2">Despesas</p>
                        <p className="text-3xl font-bold text-red-400">{formatCurrency(totalExpenses)}</p>
                    </div>
                </div>
            </div>

            {/* Transactions List */}
            <div className="relative overflow-hidden rounded-2xl glass border border-cyan-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-transparent" />
                <div className="relative p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                        Preview das Transações
                    </h3>

                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        {transactions.slice(0, 50).map((transaction, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 border border-white/5 hover:bg-gray-800/50 transition-colors"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className={`p-2 rounded-lg ${transaction.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                        {transaction.type === 'income' ? (
                                            <TrendingUp className="h-4 w-4 text-green-400" />
                                        ) : (
                                            <TrendingDown className="h-4 w-4 text-red-400" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">
                                            {transaction.description}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {formatDate(transaction.date)}
                                        </p>
                                    </div>
                                </div>
                                <p className={`text-sm font-semibold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                </p>
                            </div>
                        ))}
                    </div>

                    {transactions.length > 50 && (
                        <p className="text-xs text-gray-400 mt-4 text-center">
                            Mostrando 50 de {transactions.length} transações
                        </p>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <Button
                    onClick={onCancel}
                    variant="outline"
                    className="flex-1 border-white/10 hover:bg-white/5"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Cancelar
                </Button>
                <Button
                    onClick={onContinue}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/50"
                >
                    Continuar para Mapeamento
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
