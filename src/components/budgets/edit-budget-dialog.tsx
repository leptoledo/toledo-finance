'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateBudget } from '@/app/(dashboard)/budgets/actions'
import { Budget } from '@/lib/budgets'
import { Loader2 } from 'lucide-react'

interface EditBudgetDialogProps {
    budget: Budget
    isOpen: boolean
    onClose: () => void
}

export function EditBudgetDialog({ budget, isOpen, onClose }: EditBudgetDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const result = await updateBudget(budget.id, formData)

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
            <DialogContent className="sm:max-w-[425px] glass border-pink-500/20">
                <div className="absolute inset-0 bg-linear-to-br from-pink-500/5 via-rose-500/5 to-transparent rounded-lg" />
                <div className="relative">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">
                            <span className="bg-linear-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">
                                Editar Orçamento
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
                            <Label className="text-gray-400">Categoria</Label>
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-800/30 border border-white/5">
                                {budget.category?.icon && <span className="text-xl">{budget.category.icon}</span>}
                                <span className="text-white font-medium">{budget.category?.name}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="limit_amount" className="text-white">Novo Valor do Limite</Label>
                            <Input
                                id="limit_amount"
                                name="limit_amount"
                                type="number"
                                step="0.01"
                                min="0.01"
                                defaultValue={budget.limit_amount}
                                placeholder="0.00"
                                required
                                className="bg-gray-800/50 border-white/10"
                            />
                            <p className="text-xs text-gray-400">
                                Valor atual: {new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                }).format(Number(budget.limit_amount))}
                            </p>
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
                                className="flex-1 bg-linear-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-lg shadow-pink-500/50"
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
