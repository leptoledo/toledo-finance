'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { EditIncomeDialog } from './edit-income-dialog'
import { Search, Filter, MoreHorizontal, Trash2, Pencil } from 'lucide-react'
import { deleteTransaction } from '@/app/(dashboard)/income/actions'

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
    const [search, setSearch] = useState('')
    const [isPending, startTransition] = useTransition()
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

    const filteredTransactions = transactions.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase())
    )

    const handleDelete = (id: string) => {
        if (confirm('Tem certeza que deseja excluir esta receita?')) {
            startTransition(async () => {
                await deleteTransaction(id)
            })
        }
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
            <div className="rounded-md border border-border overflow-x-auto">
                <div className="min-w-[600px]">
                    <div className="grid grid-cols-[2fr,1.5fr,1fr,1fr,auto] gap-4 p-4 text-sm font-medium text-muted-foreground border-b border-border">
                        <div>Título</div>
                        <div>Categoria</div>
                        <div>Data</div>
                        <div className="text-right">Valor</div>
                        <div className="w-8"></div>
                    </div>
                    <div className="divide-y divide-border">
                        {filteredTransactions.map((transaction) => (
                            <div key={transaction.id} className="grid grid-cols-[2fr,1.5fr,1fr,1fr,auto] gap-4 p-4 items-center text-sm hover:bg-muted/50 transition-colors">
                                <div className="font-medium text-foreground">{transaction.title}</div>
                                <div>
                                    <Badge variant="success" className="px-3">
                                        {transaction.category?.name || 'Sem categoria'}
                                    </Badge>
                                </div>
                                <div className="text-foreground">{formatDate(transaction.date)}</div>
                                <div className="text-right font-medium text-emerald-500">
                                    {formatCurrency(transaction.amount)}
                                </div>
                                <div className="flex justify-end">
                                    <DropdownMenu
                                        trigger={
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        }
                                    >
                                        <DropdownMenuItem onClick={() => handleEdit(transaction)}>
                                            <Pencil className="h-4 w-4" />
                                            Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            variant="destructive"
                                            onClick={() => handleDelete(transaction.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Excluir
                                        </DropdownMenuItem>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                        {filteredTransactions.length === 0 && (
                            <div className="p-8 text-center text-muted-foreground">
                                Nenhuma receita encontrada.
                            </div>
                        )}
                    </div>
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
        </div>
    )
}
