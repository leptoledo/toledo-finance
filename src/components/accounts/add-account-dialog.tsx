'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createAccount } from '@/app/(dashboard)/accounts/actions'
import { Loader2, Building2, PiggyBank, TrendingUp, Banknote } from 'lucide-react'

interface AddAccountDialogProps {
    isOpen: boolean
    onClose: () => void
}

export function AddAccountDialog({ isOpen, onClose }: AddAccountDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const result = await createAccount(formData)

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
            <DialogContent className="sm:max-w-[500px] glass border-yellow-500/20">
                <div className="absolute inset-0 bg-linear-to-br from-yellow-500/5 via-amber-500/5 to-transparent rounded-lg" />
                <div className="relative">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">
                            <span className="bg-linear-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                                Nova Conta
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
                            <Label htmlFor="name" className="text-white">Nome da Conta</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Ex: Banco Inter, Nubank, Carteira"
                                required
                                className="bg-gray-800/50 border-white/10"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type" className="text-white">Tipo de Conta</Label>
                            <Select name="type" required>
                                <SelectTrigger className="bg-gray-800/50 border-white/10">
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="checking">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="h-4 w-4" />
                                            <span>Conta Corrente</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="savings">
                                        <div className="flex items-center gap-2">
                                            <PiggyBank className="h-4 w-4" />
                                            <span>Poupança</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="investment">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4" />
                                            <span>Investimento</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="cash">
                                        <div className="flex items-center gap-2">
                                            <Banknote className="h-4 w-4" />
                                            <span>Dinheiro</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="balance" className="text-white">Saldo Inicial</Label>
                            <Input
                                id="balance"
                                name="balance"
                                type="number"
                                step="0.01"
                                defaultValue="0.00"
                                placeholder="0.00"
                                className="bg-gray-800/50 border-white/10"
                            />
                            <p className="text-xs text-gray-400">
                                Informe o saldo atual desta conta
                            </p>
                        </div>

                        <input type="hidden" name="currency" value="BRL" />

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
                                className="flex-1 bg-linear-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white shadow-lg shadow-yellow-500/50"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Criando...
                                    </>
                                ) : (
                                    'Criar Conta'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
