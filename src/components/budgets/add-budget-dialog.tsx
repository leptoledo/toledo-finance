'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createBudget } from '@/app/(dashboard)/budgets/actions'
import { Loader2 } from 'lucide-react'

interface AddBudgetDialogProps {
    isOpen: boolean
    onClose: () => void
    categories: Array<{ id: string; name: string; icon: string | null }>
}

export function AddBudgetDialog({ isOpen, onClose, categories }: AddBudgetDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const result = await createBudget(formData)

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
            <DialogContent className="sm:max-w-[500px] glass border-pink-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-rose-500/5 to-transparent rounded-lg" />
                <div className="relative">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">
                            <span className="bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">
                                Novo Orçamento
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
                            <Label htmlFor="name" className="text-white">Nome do Orçamento</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Ex: Orçamento de Aluguel Dezembro"
                                required
                                className="bg-gray-800/50 border-white/10"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-white">Descrição (opcional)</Label>
                            <Input
                                id="description"
                                name="description"
                                type="text"
                                placeholder="Descreva o objetivo deste orçamento"
                                className="bg-gray-800/50 border-white/10"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category_id" className="text-white">Categoria</Label>
                            <Select name="category_id" required>
                                <SelectTrigger className="bg-gray-800/50 border-white/10">
                                    <SelectValue placeholder="Selecione uma categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            <div className="flex items-center gap-2">
                                                {category.icon && <span>{category.icon}</span>}
                                                <span>{category.name}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="limit_amount" className="text-white">Valor do Limite</Label>
                            <Input
                                id="limit_amount"
                                name="limit_amount"
                                type="number"
                                step="0.01"
                                min="0.01"
                                placeholder="0.00"
                                required
                                className="bg-gray-800/50 border-white/10"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="due_date" className="text-white">Data Limite de Pagamento (opcional)</Label>
                            <Input
                                id="due_date"
                                name="due_date"
                                type="date"
                                className="bg-gray-800/50 border-white/10"
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
                                className="flex-1 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-lg shadow-pink-500/50"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Criando...
                                    </>
                                ) : (
                                    'Criar Orçamento'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
