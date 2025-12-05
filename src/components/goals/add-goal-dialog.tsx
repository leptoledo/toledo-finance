'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { createGoal } from '@/app/(dashboard)/goals/actions'
import { Loader2, PiggyBank, TrendingUp, CreditCard } from 'lucide-react'

interface AddGoalDialogProps {
    isOpen: boolean
    onClose: () => void
}

export function AddGoalDialog({ isOpen, onClose }: AddGoalDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const result = await createGoal(formData)

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
            <DialogContent className="sm:max-w-[550px] glass border-orange-500/20">
                <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 via-amber-500/5 to-transparent rounded-lg" />
                <div className="relative">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">
                            <span className="bg-linear-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                                Nova Meta Financeira
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
                            <Label htmlFor="name" className="text-white">Nome da Meta</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Ex: Viagem para Europa, Carro Novo, Reserva de Emergência"
                                required
                                className="bg-gray-800/50 border-white/10"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-white">Descrição (Opcional)</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Descreva sua meta..."
                                rows={3}
                                className="bg-gray-800/50 border-white/10 resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type" className="text-white">Tipo de Meta</Label>
                            <Select name="type" required>
                                <SelectTrigger className="bg-gray-800/50 border-white/10">
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="savings">
                                        <div className="flex items-center gap-2">
                                            <PiggyBank className="h-4 w-4" />
                                            <span>Economia</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="investment">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4" />
                                            <span>Investimento</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="debt_payment">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="h-4 w-4" />
                                            <span>Pagamento de Dívida</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="target_amount" className="text-white">Valor Alvo</Label>
                                <Input
                                    id="target_amount"
                                    name="target_amount"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    placeholder="0.00"
                                    required
                                    className="bg-gray-800/50 border-white/10"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="current_amount" className="text-white">Valor Atual</Label>
                                <Input
                                    id="current_amount"
                                    name="current_amount"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    defaultValue="0.00"
                                    placeholder="0.00"
                                    className="bg-gray-800/50 border-white/10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="deadline" className="text-white">Prazo (Opcional)</Label>
                            <Input
                                id="deadline"
                                name="deadline"
                                type="date"
                                className="bg-gray-800/50 border-white/10"
                            />
                            <p className="text-xs text-gray-400">
                                Defina uma data limite para alcançar sua meta
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
                                className="flex-1 bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg shadow-orange-500/50"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Criando...
                                    </>
                                ) : (
                                    'Criar Meta'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
