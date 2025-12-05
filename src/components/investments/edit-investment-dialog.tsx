'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateInvestment } from '@/app/(dashboard)/investments/actions'
import { Investment } from '@/lib/investments'
import { Loader2 } from 'lucide-react'

interface EditInvestmentDialogProps {
    investment: Investment
    isOpen: boolean
    onClose: () => void
}

export function EditInvestmentDialog({ investment, isOpen, onClose }: EditInvestmentDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const result = await updateInvestment(investment.id, formData)

        if (result.error) {
            setError(result.error)
            setIsSubmitting(false)
        } else {
            onClose()
            setIsSubmitting(false)
        }
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] glass border-purple-500/20">
                <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 via-pink-500/5 to-transparent rounded-lg" />
                <div className="relative">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">
                            <span className="bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                                Editar Investimento
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
                            <Label className="text-gray-400">Nome</Label>
                            <div className="p-3 rounded-lg bg-gray-800/30 border border-white/5">
                                <p className="text-white font-semibold">{investment.name}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-400">Valor Investido</Label>
                            <div className="p-3 rounded-lg bg-gray-800/30 border border-white/5">
                                <p className="text-blue-400 font-semibold">
                                    {formatCurrency(Number(investment.amount_invested))}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="current_value" className="text-white">Valor Atual</Label>
                            <Input
                                id="current_value"
                                name="current_value"
                                type="number"
                                step="0.01"
                                min="0"
                                defaultValue={investment.current_value}
                                required
                                className="bg-gray-800/50 border-white/10"
                            />
                            <p className="text-xs text-gray-400">
                                Atualize o valor atual do seu investimento
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes" className="text-white">Observações</Label>
                            <Textarea
                                id="notes"
                                name="notes"
                                defaultValue={investment.notes || ''}
                                placeholder="Adicione notas sobre este investimento..."
                                rows={3}
                                className="bg-gray-800/50 border-white/10 resize-none"
                            />
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
                                        Salvando...
                                    </>
                                ) : (
                                    'Salvar Alterações'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
