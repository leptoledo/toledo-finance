'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { PlusCircle, Loader2, Pencil } from 'lucide-react'
import { createTrade, updateTrade, Trade } from '@/app/(dashboard)/trading-actions'
import { useToast } from '@/components/ui/toast'
import { Switch } from '@/components/ui/switch'

interface TradeDialogProps {
    tradeToEdit?: Trade | null
    open?: boolean
    onOpenChange?: (open: boolean) => void
    trigger?: React.ReactNode
}

export function TradeDialog({ tradeToEdit, open: controlledOpen, onOpenChange: setControlledOpen, trigger }: TradeDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const { showToast } = useToast()
    const router = useRouter()

    const isEditing = !!tradeToEdit
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen
    const setOpen = setControlledOpen || setInternalOpen

    const [formData, setFormData] = useState({
        asset_symbol: '',
        operation_type: 'LONG',
        quantity: '',
        entry_price: '',
        exit_price: '',
        entry_date: new Date().toISOString().split('T')[0],
        strategy: '',
        notes: '',
        take_profit: '',
        stop_loss: ''
    })

    useEffect(() => {
        if (tradeToEdit) {
            setFormData({
                asset_symbol: tradeToEdit.asset_symbol,
                operation_type: tradeToEdit.operation_type,
                quantity: tradeToEdit.quantity.toString(),
                entry_price: tradeToEdit.entry_price.toString(),
                exit_price: tradeToEdit.exit_price ? tradeToEdit.exit_price.toString() : '',
                entry_date: new Date(tradeToEdit.entry_date).toISOString().split('T')[0],
                strategy: tradeToEdit.strategy || '',
                notes: tradeToEdit.notes || '',
                take_profit: tradeToEdit.take_profit ? tradeToEdit.take_profit.toString() : '',
                stop_loss: tradeToEdit.stop_loss ? tradeToEdit.stop_loss.toString() : ''
            })
        } else {
            setFormData({
                asset_symbol: '',
                operation_type: 'LONG',
                quantity: '',
                entry_price: '',
                exit_price: '',
                entry_date: new Date().toISOString().split('T')[0],
                strategy: '',
                notes: '',
                take_profit: '',
                stop_loss: ''
            })
        }
    }, [tradeToEdit, open])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        startTransition(async () => {
            const entryPrice = formData.entry_price ? Number(formData.entry_price.toString().replace(',', '.')) : 0
            const exitPrice = formData.exit_price ? Number(formData.exit_price.toString().replace(',', '.')) : 0
            const quantity = formData.quantity ? Number(formData.quantity.toString().replace(',', '.')) : 0

            const takeProfitVal = formData.take_profit ? Number(formData.take_profit.toString().replace(',', '.')) : 0
            const stopLossVal = formData.stop_loss ? Number(formData.stop_loss.toString().replace(',', '.')) : 0

            let resultVal = 0

            // Logic: 
            // 1. If Entry and Exit prices exist, calculate from them.
            // 2. Else, if Take Profit is filled, use it as positive result.
            // 3. Else, if Stop Loss is filled, use it as negative result.

            if (entryPrice > 0 && exitPrice > 0 && quantity > 0) {
                if (formData.operation_type === 'LONG') {
                    resultVal = (exitPrice - entryPrice) * quantity
                } else {
                    resultVal = (entryPrice - exitPrice) * quantity
                }
            } else if (takeProfitVal > 0) {
                resultVal = takeProfitVal
            } else if (stopLossVal > 0) {
                resultVal = -Math.abs(stopLossVal) // Ensure it's negative
            }

            const payload = {
                asset_symbol: formData.asset_symbol.toUpperCase(),
                operation_type: formData.operation_type as 'LONG' | 'SHORT',
                quantity,
                entry_price: entryPrice,
                exit_price: exitPrice,
                entry_date: new Date(formData.entry_date).toISOString(),
                exit_date: new Date(formData.entry_date).toISOString(),
                result: resultVal,
                status: 'CLOSED' as 'CLOSED',
                strategy: formData.strategy,
                notes: formData.notes,
                take_profit: takeProfitVal || undefined,
                stop_loss: stopLossVal || undefined
            }

            let resultAction
            if (isEditing && tradeToEdit) {
                resultAction = await updateTrade(tradeToEdit.id, payload)
            } else {
                resultAction = await createTrade(payload)
            }

            if (resultAction?.success) {
                showToast(isEditing ? 'Operação atualizada!' : 'Operação registrada com sucesso!', 'success')
                setOpen(false)
                if (!isEditing) {
                    setFormData({
                        asset_symbol: '',
                        operation_type: 'LONG',
                        quantity: '',
                        entry_price: '',
                        exit_price: '',
                        entry_date: new Date().toISOString().split('T')[0],
                        strategy: '',
                        notes: '',
                        take_profit: '',
                        stop_loss: ''
                    })
                }
                router.refresh()
            } else {
                showToast(resultAction?.error || 'Erro ao processar operação', 'error')
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ? trigger : (
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Registrar Operação
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Editar Operação' : 'Registrar Trade Finalizado'}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Edite os detalhes da sua operação.' : 'Adicione os detalhes da sua operação encerrada.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="asset">Ativo</Label>
                            <Input
                                id="asset"
                                placeholder="EX: WINJ24"
                                value={formData.asset_symbol}
                                onChange={(e) => setFormData({ ...formData, asset_symbol: e.target.value.toUpperCase() })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Direção</Label>
                            <Select
                                value={formData.operation_type}
                                onValueChange={(value) => setFormData({ ...formData, operation_type: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LONG">Compra (Long)</SelectItem>
                                    <SelectItem value="SHORT">Venda (Short)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantidade</Label>
                            <Input
                                id="quantity"
                                type="number"
                                step="0.01"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="entry_price">Preço de Entrada</Label>
                            <Input
                                id="entry_price"
                                type="number"
                                step="0.01"
                                placeholder="0,00"
                                value={formData.entry_price}
                                onChange={(e) => setFormData({ ...formData, entry_price: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="exit_price">Preço de Saída</Label>
                            <Input
                                id="exit_price"
                                type="number"
                                step="0.01"
                                placeholder="0,00"
                                value={formData.exit_price}
                                onChange={(e) => setFormData({ ...formData, exit_price: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Data</Label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.entry_date}
                                onChange={(e) => setFormData({ ...formData, entry_date: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="strategy">Estratégia (Opcional)</Label>
                            <Input
                                id="strategy"
                                placeholder="Ex: Rompimento VWAP"
                                value={formData.strategy}
                                onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t pt-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="stop_loss" className="text-rose-500 font-bold">Stop Loss (Prejuízo $)</Label>
                            <Input
                                id="stop_loss"
                                type="number"
                                step="0.01"
                                placeholder="0,00"
                                value={formData.stop_loss}
                                onChange={(e) => setFormData({ ...formData, stop_loss: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="take_profit" className="text-emerald-500 font-bold">Take Profit (Lucro $)</Label>
                            <Input
                                id="take_profit"
                                type="number"
                                step="0.01"
                                placeholder="0,00"
                                value={formData.take_profit}
                                onChange={(e) => setFormData({ ...formData, take_profit: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Anotações</Label>
                        <Textarea
                            id="notes"
                            placeholder="Observações sobre o trade..."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processando...
                                </>
                            ) : (isEditing ? 'Salvar Alterações' : 'Registrar Resultado')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
// Exporting as AddTradeDialog for backward compatibility if needed, or simply replacing default export default
export { TradeDialog as AddTradeDialog }
