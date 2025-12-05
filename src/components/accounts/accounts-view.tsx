'use client'

import { useState } from 'react'
import { Wallet, Plus, Building2, PiggyBank, TrendingUp, Banknote, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Account } from '@/lib/accounts'
import { deleteAccount } from '@/app/(dashboard)/accounts/actions'
import { AddAccountDialog } from './add-account-dialog'
import { EditAccountDialog } from './edit-account-dialog'

interface AccountsViewProps {
    accounts: Account[]
    summary: {
        totalBalance: number
        accountCount: number
        accountsByType: Record<string, { count: number; balance: number }>
    }
}

const accountTypeIcons = {
    checking: Building2,
    savings: PiggyBank,
    investment: TrendingUp,
    cash: Banknote
}

const accountTypeLabels = {
    checking: 'Conta Corrente',
    savings: 'Poupança',
    investment: 'Investimento',
    cash: 'Dinheiro'
}

const accountTypeColors = {
    checking: { border: 'border-blue-500/20', bg: 'from-blue-500/10 via-blue-500/5', gradient: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-500/50', text: 'text-blue-400' },
    savings: { border: 'border-green-500/20', bg: 'from-green-500/10 via-green-500/5', gradient: 'from-green-500 to-emerald-600', shadow: 'shadow-green-500/50', text: 'text-green-400' },
    investment: { border: 'border-purple-500/20', bg: 'from-purple-500/10 via-purple-500/5', gradient: 'from-purple-500 to-violet-600', shadow: 'shadow-purple-500/50', text: 'text-purple-400' },
    cash: { border: 'border-yellow-500/20', bg: 'from-yellow-500/10 via-yellow-500/5', gradient: 'from-yellow-500 to-amber-600', shadow: 'shadow-yellow-500/50', text: 'text-yellow-400' }
}

export function AccountsView({ accounts, summary }: AccountsViewProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [editingAccount, setEditingAccount] = useState<Account | null>(null)

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Tem certeza que deseja excluir a conta "${name}"?`)) return

        setDeletingId(id)
        const result = await deleteAccount(id)

        if (result.error) {
            alert(result.error)
        }
        setDeletingId(null)
    }

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
                        <span className="bg-linear-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                            Contas
                        </span>
                    </h2>
                    <p className="text-muted-foreground">
                        Gerencie suas contas bancárias e carteiras.
                    </p>
                </div>
                <Button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="w-full sm:w-auto bg-linear-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white shadow-lg shadow-yellow-500/50 transition-all hover-lift"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Conta
                </Button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Balance */}
                <div className="group relative overflow-hidden rounded-2xl glass border border-yellow-500/20 hover-lift">
                    <div className="absolute inset-0 bg-linear-to-br from-yellow-500/10 via-amber-500/5 to-transparent" />
                    <div className="relative p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-xl bg-linear-to-br from-yellow-500 to-amber-600 shadow-lg shadow-yellow-500/50">
                                <Wallet className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-xs font-medium text-yellow-400 bg-yellow-500/10 px-3 py-1 rounded-full">
                                Total
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-400">Saldo Total</p>
                            <p className="text-3xl font-bold text-yellow-400">{formatCurrency(summary.totalBalance)}</p>
                            <p className="text-xs text-muted-foreground">{summary.accountCount} conta(s)</p>
                        </div>
                    </div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-br from-yellow-500/5 to-transparent pointer-events-none" />
                </div>

                {/* By Type */}
                {Object.entries(summary.accountsByType).map(([type, data]) => {
                    const Icon = accountTypeIcons[type as keyof typeof accountTypeIcons]
                    const colors = accountTypeColors[type as keyof typeof accountTypeColors]

                    // Skip if type is not mapped
                    if (!Icon || !colors) return null

                    return (
                        <div key={type} className={`group relative overflow-hidden rounded-2xl glass border ${colors.border} hover-lift`}>
                            <div className={`absolute inset-0 bg-linear-to-br ${colors.bg} to-transparent`} />
                            <div className="relative p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-xl bg-linear-to-br ${colors.gradient} shadow-lg ${colors.shadow}`}>
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-400">{accountTypeLabels[type as keyof typeof accountTypeLabels]}</p>
                                    <p className={`text-2xl font-bold ${colors.text}`}>{formatCurrency(data.balance)}</p>
                                    <p className="text-xs text-muted-foreground">{data.count} conta(s)</p>
                                </div>
                            </div>
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-br ${colors.bg} to-transparent pointer-events-none`} />
                        </div>
                    )
                })}
            </div>

            {/* Accounts List */}
            {accounts.length > 0 ? (
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-white">
                        Suas Contas ({accounts.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {accounts.map((account) => {
                            const Icon = accountTypeIcons[account.type]
                            const colors = accountTypeColors[account.type]

                            // Skip if type is not mapped
                            if (!Icon || !colors) return null

                            return (
                                <div key={account.id} className={`group relative overflow-hidden rounded-2xl glass border ${colors.border} hover-lift`}>
                                    <div className={`absolute inset-0 bg-linear-to-br ${colors.bg} to-transparent`} />
                                    <div className="relative p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-3 rounded-xl bg-linear-to-br ${colors.gradient} shadow-lg ${colors.shadow}`}>
                                                    <Icon className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white">{account.name}</h3>
                                                    <p className="text-xs text-gray-400">{accountTypeLabels[account.type]}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setEditingAccount(account)}
                                                    className="h-8 w-8 p-0 hover:bg-white/10"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(account.id, account.name)}
                                                    disabled={deletingId === account.id}
                                                    className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-400"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm text-gray-400">Saldo Atual</p>
                                            <p className={`text-3xl font-bold ${colors.text}`}>{formatCurrency(Number(account.balance))}</p>
                                        </div>
                                    </div>
                                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-br ${colors.bg} to-transparent pointer-events-none`} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            ) : (
                <div className="relative overflow-hidden rounded-2xl glass border border-yellow-500/20 p-12">
                    <div className="absolute inset-0 bg-linear-to-br from-yellow-500/5 via-amber-500/5 to-transparent" />
                    <div className="relative text-center space-y-4">
                        <div className="inline-flex p-4 rounded-2xl bg-linear-to-br from-yellow-500 to-amber-600 shadow-lg shadow-yellow-500/50">
                            <Wallet className="h-12 w-12 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Nenhuma Conta Cadastrada</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Você ainda não cadastrou nenhuma conta. Clique no botão acima para adicionar sua primeira conta.
                        </p>
                    </div>
                </div>
            )}

            {/* Dialogs */}
            <AddAccountDialog
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
            />
            {editingAccount && (
                <EditAccountDialog
                    account={editingAccount}
                    isOpen={!!editingAccount}
                    onClose={() => setEditingAccount(null)}
                />
            )}
        </div>
    )
}
