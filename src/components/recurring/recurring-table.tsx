'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { MoreHorizontal, Trash2, CalendarClock, Play, Pause } from 'lucide-react'
import { deleteRecurringTransaction, toggleRecurringTransaction, RecurringTransaction } from '@/app/(dashboard)/recurring-actions'
import { useToast } from '@/components/ui/toast'
import { Switch } from '@/components/ui/switch'

interface RecurringTableProps {
    transactions: (RecurringTransaction & {
        category?: { name: string, icon?: string, type: string } | null
        account?: { name: string } | null
    })[]
    currency?: string
}

export function RecurringTable({ transactions, currency = 'BRL' }: RecurringTableProps) {
    const router = useRouter()
    const { showToast } = useToast()
    const [isPending, startTransition] = useTransition()
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: currency,
        }).format(value)
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('pt-BR')
    }

    const translateFrequency = (freq: string) => {
        const map: Record<string, string> = {
            daily: 'Diária',
            weekly: 'Semanal',
            monthly: 'Mensal',
            yearly: 'Anual'
        }
        return map[freq] || freq
    }

    const handleDelete = (id: string) => {
        setDeletingId(id)
    }

    const confirmDelete = () => {
        if (!deletingId) return

        startTransition(async () => {
            const result = await deleteRecurringTransaction(deletingId)
            if (result?.success) {
                showToast('Recorrência excluída com sucesso!', 'success')
                router.refresh()
            } else {
                showToast('Erro ao excluir recorrência', 'error')
            }
            setDeletingId(null)
        })
    }

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        startTransition(async () => {
            const result = await toggleRecurringTransaction(id, !currentStatus)
            if (result?.success) {
                showToast(
                    !currentStatus ? 'Recorrência ativada!' : 'Recorrência pausada!',
                    'success'
                )
                router.refresh()
            } else {
                showToast('Erro ao atualizar status', 'error')
            }
        })
    }

    return (
        <div className="space-y-4">
            <div className="rounded-md border border-border overflow-hidden">
                <div className="w-full overflow-x-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b [&_tr]:border-border">
                            <tr className="border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[30%]">
                                    Título
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[15%]">
                                    Categoria
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[15%]">
                                    Frequência
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[15%]">
                                    Próxima
                                </th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground w-[15%]">
                                    Valor
                                </th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground w-[10%]">
                                    Status
                                </th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground w-[5%]">
                                </th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {transactions.length > 0 ? (
                                transactions.map((transaction) => (
                                    <tr
                                        key={transaction.id}
                                        className={`border-b border-border transition-colors hover:bg-muted/50 ${!transaction.is_active ? 'opacity-60 bg-muted/20' : ''}`}
                                    >
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">{transaction.category?.icon}</span>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-white">{transaction.title}</span>
                                                    {transaction.description && (
                                                        <span className="text-xs text-muted-foreground truncate max-w-[150px]">{transaction.description}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <Badge
                                                variant="secondary"
                                                className="bg-secondary/50 font-normal"
                                            >
                                                {transaction.category?.name || 'Sem categoria'}
                                            </Badge>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <CalendarClock className="h-3 w-3" />
                                                <span>{translateFrequency(transaction.frequency)}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <span className={transaction.is_active ? "text-white" : "text-muted-foreground"}>
                                                {formatDate(transaction.next_occurrence)}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <span className={`font-medium ${transaction.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <div className="flex justify-end pr-2">
                                                <Switch
                                                    checked={transaction.is_active}
                                                    onCheckedChange={(checked) => handleToggleActive(transaction.id, !checked)}
                                                />
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle text-right">
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
                                                    onClick={() => handleToggleActive(transaction.id, transaction.is_active)}
                                                    className="cursor-pointer"
                                                >
                                                    {transaction.is_active ? (
                                                        <>
                                                            <Pause className="mr-2 h-4 w-4" />
                                                            Pausar
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Play className="mr-2 h-4 w-4" />
                                                            Retomar
                                                        </>
                                                    )}
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
                                    <td colSpan={7} className="h-24 text-center align-middle text-muted-foreground">
                                        Nenhuma recorrência encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmDialog
                isOpen={!!deletingId}
                onClose={() => setDeletingId(null)}
                onConfirm={confirmDelete}
                title="Excluir Recorrência"
                description="Tem certeza que deseja excluir esta configuração de recorrência? As transações já geradas não serão apagadas."
                confirmText="Excluir"
                cancelText="Cancelar"
                variant="danger"
            />
        </div>
    )
}
