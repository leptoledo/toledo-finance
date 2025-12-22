'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { createInvestment } from '@/app/(dashboard)/investments/actions'
import { Loader2, TrendingUp, Building, Bitcoin, Home, Briefcase } from 'lucide-react'
import { TickerAutocomplete } from './ticker-autocomplete'

interface AddInvestmentDialogProps {
    isOpen: boolean
    onClose: () => void
    accounts?: { id: string; name: string }[]
}

export function AddInvestmentDialog({ isOpen, onClose, accounts = [] }: AddInvestmentDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const result = await createInvestment(formData)

        if (result.error) {
            setError(result.error)
            setIsSubmitting(false)
        } else {
            onClose()
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[550px] glass border-purple-500/20">
                <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 via-pink-500/5 to-transparent rounded-lg" />
                <div className="relative">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">
                            <span className="bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                                Novo Investimento
                            </span>
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
                                {error}
                            </div>
                        )}



                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-white">Nome do Investimento</Label>
                            <TickerAutocomplete
                                id="name"
                                name="name"
                                placeholder="Ex: PETR4, BTC, AAPL..."
                                required
                                className="bg-gray-800/50 border-white/10"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type" className="text-white">Tipo de Investimento</Label>
                            <Select name="type" required>
                                <SelectTrigger className="bg-gray-800/50 border-white/10">
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="stocks">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4" />
                                            <span>Ações</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="bonds">
                                        <div className="flex items-center gap-2">
                                            <Building className="h-4 w-4" />
                                            <span>Títulos</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="crypto">
                                        <div className="flex items-center gap-2">
                                            <Bitcoin className="h-4 w-4" />
                                            <span>Criptomoedas</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="real_estate">
                                        <div className="flex items-center gap-2">
                                            <Home className="h-4 w-4" />
                                            <span>Imóveis</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="other">
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="h-4 w-4" />
                                            <span>Outros</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="account_id" className="text-white">Conta de Origem (Para débito)</Label>
                                <Select name="account_id">
                                    <SelectTrigger className="bg-gray-800/50 border-white/10">
                                        <SelectValue placeholder="Selecione uma conta (Opcional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {accounts.map((account) => (
                                            <SelectItem key={account.id} value={account.id}>
                                                {account.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Se selecionada, o valor investido será descontado desta conta.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="amount_invested" className="text-white">Valor Investido (Total)</Label>
                                    <Input
                                        id="amount_invested"
                                        name="amount_invested"
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        placeholder="0.00"
                                        required
                                        className="bg-gray-800/50 border-white/10"
                                        onChange={(e) => {
                                            // Auto-fill current value if user hasn't typed there yet? 
                                            // Creating a specific handle for this is better UX
                                            const val = e.target.value
                                            const currentInput = document.getElementById('current_value') as HTMLInputElement
                                            if (currentInput && currentInput.value === '') {
                                                currentInput.value = val
                                            }
                                        }}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="current_value" className="text-white">Valor Atual (Total)</Label>
                                    <Input
                                        id="current_value"
                                        name="current_value"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="Igual ao investido (inicialmente)"
                                        required
                                        className="bg-gray-800/50 border-white/10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="purchase_date" className="text-white">Data de Compra</Label>
                                <Input
                                    id="purchase_date"
                                    name="purchase_date"
                                    type="date"
                                    required
                                    className="bg-gray-800/50 border-white/10"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes" className="text-white">Observações (Opcional)</Label>
                                <Textarea
                                    id="notes"
                                    name="notes"
                                    placeholder="Adicione notas sobre este investimento..."
                                    rows={3}
                                    className="bg-gray-800/50 border-white/10 resize-none"
                                />
                            </div>

                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1 border-white/10 hover:bg-white/5"
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 bg-linear-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg shadow-purple-500/50"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Criando...
                                    </>
                                ) : (
                                    'Criar Investimento'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
