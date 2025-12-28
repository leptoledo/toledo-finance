'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { closeTrade, Trade } from '@/app/(dashboard)/trading-actions'
import { useToast } from '@/components/ui/toast'

interface CloseTradeDialogProps {
    trade: Trade | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CloseTradeDialog({ trade, open, onOpenChange }: CloseTradeDialogProps) {
    const [isPending, startTransition] = useTransition()
    const { showToast } = useToast()
    const router = useRouter()

    const [exitPrice, setExitPrice] = useState('')
    const [exitDate, setExitDate] = useState(new Date().toISOString().split('T')[0])

    if (!trade) return null

    const calculateResult = (price: number) => {
        const entry = trade.entry_price
        const quantity = trade.quantity
        if (trade.operation_type === 'LONG') {
            return (price - entry) * quantity
        } else {
            return (entry - price) * quantity
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const price = Number(exitPrice.replace(',', '.'))
        const result = calculateResult(price)

        startTransition(async () => {
            const response = await closeTrade(trade.id, {
                exit_price: price,
                exit_date: new Date(exitDate).toISOString(),
                result: result
            })

            if (response?.success) {
                showToast('Trade encerrado com sucesso!', 'success')
                onOpenChange(false)
                setExitPrice('')
                router.refresh()
            } else {
                showToast(`Erro: ${response?.error}`, 'error')
            }
        })
    }

    const potentialResult = exitPrice ? calculateResult(Number(exitPrice.replace(',', '.'))) : 0

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Encerrar Posição - {trade.asset_symbol}</DialogTitle>
                    <DialogDescription>
                        Informe os dados de saída da operação.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Entrada</Label>
                            <div className="p-2 border rounded bg-muted text-sm font-medium">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(trade.entry_price)}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="exit_price">Saída</Label>
                            <Input
                                id="exit_price"
                                type="number"
                                step="0.01"
                                placeholder="0,00"
                                value={exitPrice}
                                onChange={(e) => setExitPrice(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="exit_date">Data de Saída</Label>
                        <Input
                            id="exit_date"
                            type="date"
                            value={exitDate}
                            onChange={(e) => setExitDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="p-4 rounded-md bg-muted/50 border border-muted">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Resultado Estimado:</span>
                            <span className={`text-lg font-bold ${potentialResult >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(potentialResult)}
                            </span>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending || !exitPrice}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Encerrando...
                                </>
                            ) : 'Confirmar Saída'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
