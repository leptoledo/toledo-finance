'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { EditIncomeDialog } from './edit-income-dialog'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Search, Filter, MoreHorizontal, Trash2, Pencil } from 'lucide-react'
import { deleteTransaction } from '@/app/(dashboard)/income/actions'
import { useToast } from '@/components/ui/toast'

interface Transaction {
    id: string
    title: string
    amount: number
    date: string
    category_id: string
    account_id: string
    category: {
        name: string
        type: string
        icon?: string
    } | null
}

interface IncomeTableProps {
    transactions: Transaction[]
    currency?: string
    options: {
        categories: any[]
        accounts: any[]
    }
}

export function IncomeTable({ transactions, currency = 'BRL', options }: IncomeTableProps) {
    const router = useRouter()
    const { showToast } = useToast()
    const [search, setSearch] = useState('')
    const [isPending, startTransition] = useTransition()
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
    const [deletingTransactionId, setDeletingTransactionId] = useState<string | null>(null)

    const filteredTransactions = transactions.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase())
    )

    const handleDelete = (id: string) => {
        setDeletingTransactionId(id)
    }

    const confirmDelete = () => {
        if (!deletingTransactionId) return

        startTransition(async () => {
            const result = await deleteTransaction(deletingTransactionId)
            if (result?.success) {
                showToast('Receita excluída com sucesso!', 'success')
                router.refresh()
            } else {
                showToast('Erro ao excluir receita', 'error')
            }
        })
    }

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction)
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: currency,
        }).format(value)
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('pt-BR')
    }

    return (
        <div className="space-y-4">
            {/* Search and filter bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1 max-w-full sm:max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar receita..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                    <Filter className="h-4 w-4" />
                    Filtros
                </Button>
                <span className="text-sm text-muted-foreground text-center sm:text-left">
                    Exibindo {filteredTransactions.length} de {transactions.length} receitas.
                </span>
            </div>

            {/* Table with horizontal scroll on mobile */}
            <div className="rounded-md border border-border overflow-hidden">
                <div className="w-full overflow-x-auto overflow-y-visible">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b [&_tr]:border-border">
                            <tr className="border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 w-[40%]">
                                    Título
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 w-[20%]">
                                    Categoria
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 w-[15%]">
                                    Data
                                </th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 w-[15%]">
                                    Valor
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 w-[10%]">
                                </th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((transaction) => (
                                    <tr
                                        key={transaction.id}
                                        className="border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                    >
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">{transaction.category?.icon}</span>
                                                <span className="font-medium text-white">{transaction.title}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                            <Badge
                                                variant="secondary"
                                                className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 font-normal border border-emerald-500/20"
                                            >
                                                {transaction.category?.name || 'Sem categoria'}
                                            </Badge>
                                        </td>
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                            <span className="text-muted-foreground">
                                                {formatDate(transaction.date)}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-right">
                                            <span className="font-medium text-emerald-500">
                                                {formatCurrency(transaction.amount)}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-right">
                                            <DropdownMenu
                                                trigger={
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-white"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                }
                                            >
                                                <DropdownMenuItem
                                                    onClick={() => handleEdit(transaction)}
                                                    className="cursor-pointer"
                                                >
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-500 focus:text-red-500 cursor-pointer"
                                                    onClick={() => handleDelete(transaction.id)}
                                                    variant="destructive"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Excluir
                                                </DropdownMenuItem>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="h-24 text-center align-middle text-muted-foreground">
                                        Nenhuma receita encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {editingTransaction && (
                <EditIncomeDialog
                    isOpen={!!editingTransaction}
                    onClose={() => setEditingTransaction(null)}
                    transaction={editingTransaction}
                    categories={options.categories}
                    accounts={options.accounts}
                />
            )}

            <ConfirmDialog
                isOpen={!!deletingTransactionId}
                onClose={() => setDeletingTransactionId(null)}
                onConfirm={confirmDelete}
                title="Excluir Receita"
                description="Tem certeza que deseja excluir esta receita? Esta ação não pode ser desfeita."
                confirmText="Excluir"
                cancelText="Cancelar"
                variant="danger"
            />
        </div>
    )
}
