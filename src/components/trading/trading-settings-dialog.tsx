'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateTradingSettings } from '@/app/(dashboard)/trading-actions'
import { Settings, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/toast'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface TradingSettingsDialogProps {
    initialBalance: number
    currency?: string
}

export function TradingSettingsDialog({ initialBalance, currency = 'BRL' }: TradingSettingsDialogProps) {
    const [open, setOpen] = useState(false)
    const [balance, setBalance] = useState(initialBalance.toString())
    const [selectedCurrency, setSelectedCurrency] = useState(currency)
    const [isPending, startTransition] = useTransition()
    const { showToast } = useToast()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const value = parseFloat(balance)
        if (isNaN(value)) {
            showToast('Por favor, insira um valor válido', 'error')
            return
        }

        startTransition(async () => {
            const result = await updateTradingSettings(value, selectedCurrency)
            if (result.success) {
                showToast('Configurações salvas com sucesso', 'success')
                setOpen(false)
            } else {
                showToast(result.error || 'Erro ao salvar configurações', 'error')
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Configurações de Trading</DialogTitle>
                    <DialogDescription>
                        Ajuste as configurações do seu diário de trade.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="initialBalance">Saldo Inicial</Label>
                        <Input
                            id="initialBalance"
                            type="number"
                            step="0.01"
                            value={balance}
                            onChange={(e) => setBalance(e.target.value)}
                            placeholder="0.00"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="currency">Moeda</Label>
                        <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a moeda" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BRL">Real Brasileiro (BRL)</SelectItem>
                                <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                                <SelectItem value="EUR">Euro (EUR)</SelectItem>
                                <SelectItem value="GBP">Libra Esterlina (GBP)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Salvar Alterações
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
