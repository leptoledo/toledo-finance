'use client'

import { useState, useTransition } from 'react'
import { Trade } from '@/app/(dashboard)/trading-actions'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2, MoreHorizontal, Pencil } from 'lucide-react'
import { deleteTrade } from '@/app/(dashboard)/trading-actions'
import { useToast } from '@/components/ui/toast'
import { useRouter } from 'next/navigation'
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { AddTradeDialog } from './add-trade-dialog'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

interface TradesTableProps {
    trades: Trade[]
    currency?: string
}

export function TradesTable({ trades, currency = 'BRL' }: TradesTableProps) {
    const { showToast } = useToast()
    const router = useRouter()
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    // Edit state
    const [editingTrade, setEditingTrade] = useState<Trade | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    // Delete confirmation state
    const [tradeToDelete, setTradeToDelete] = useState<string | null>(null)

    const confirmDelete = (id: string) => {
        setTradeToDelete(id)
    }

    const executeDelete = async () => {
        if (!tradeToDelete) return

        const id = tradeToDelete
        setDeletingId(id)
        setTradeToDelete(null) // Close dialog immediately

        startTransition(async () => {
            const result = await deleteTrade(id)
            if (result?.success) {
                showToast('Operação excluída', 'success')
                router.refresh()
            } else {
                showToast('Erro ao excluir', 'error')
            }
            setDeletingId(null)
        })
    }

    const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-BR')
    const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(val)

    return (
        <div className="rounded-md border border-border overflow-hidden">
            {/* Hidden dialog for editing */}
            <AddTradeDialog
                tradeToEdit={editingTrade}
                open={isEditDialogOpen}
                onOpenChange={(open) => {
                    setIsEditDialogOpen(open)
                    if (!open) setEditingTrade(null)
                }}
                trigger={<span className="hidden border-0 w-0 h-0" />}
            />

            {/* Confirmation Dialog */}
            <ConfirmDialog
                isOpen={!!tradeToDelete}
                onClose={() => setTradeToDelete(null)}
                onConfirm={executeDelete}
                title="Excluir Transação"
                description="Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita e afetará o saldo do portfolio."
                confirmText="Excluir"
                cancelText="Cancelar"
                variant="danger"
            />

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Ativo</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="text-right">Qtd</TableHead>
                        <TableHead className="text-right">Entrada</TableHead>
                        <TableHead className="text-right">Saída</TableHead>
                        <TableHead className="text-right">Stop / Gain</TableHead>
                        <TableHead className="text-right">Resultado</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {trades.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={9} className="h-24 text-center">
                                Nenhuma operação encontrada.
                            </TableCell>
                        </TableRow>
                    ) : (
                        trades.map((trade) => (
                            <TableRow key={trade.id}>
                                <TableCell>{formatDate(trade.entry_date)}</TableCell>
                                <TableCell className="font-bold">{trade.asset_symbol}</TableCell>
                                <TableCell>
                                    <Badge variant={trade.operation_type === 'LONG' ? 'default' : 'destructive'} className={trade.operation_type === 'LONG' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}>
                                        {trade.operation_type === 'LONG' ? 'Compra' : 'Venda'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">{trade.quantity}</TableCell>
                                <TableCell className="text-right">{trade.entry_price ? formatMoney(trade.entry_price) : '-'}</TableCell>
                                <TableCell className="text-right">
                                    {trade.exit_price ? formatMoney(trade.exit_price) : '-'}
                                </TableCell>
                                <TableCell className="text-right text-xs text-muted-foreground">
                                    <div className="flex flex-col items-end">
                                        {trade.stop_loss && <span className="text-rose-500">S: {formatMoney(trade.stop_loss)}</span>}
                                        {trade.take_profit && <span className="text-emerald-500">T: {formatMoney(trade.take_profit)}</span>}
                                    </div>
                                </TableCell>
                                <TableCell className={`text-right font-bold ${trade.result && trade.result > 0 ? 'text-emerald-500' : trade.result && trade.result < 0 ? 'text-rose-500' : ''}`}>
                                    {trade.result ? formatMoney(trade.result) : '-'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu trigger={
                                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending && deletingId === trade.id}>
                                            <span className="sr-only">Abrir menu</span>
                                            {isPending && deletingId === trade.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <MoreHorizontal className="h-4 w-4" />
                                            )}
                                        </Button>
                                    }>
                                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => {
                                            setEditingTrade(trade)
                                            setIsEditDialogOpen(true)
                                        }}>
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => confirmDelete(trade.id)} variant="destructive">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Excluir
                                        </DropdownMenuItem>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
