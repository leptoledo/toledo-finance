'use client'

import { useState, useTransition } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tag } from 'lucide-react'
import { createTransaction } from '@/app/(dashboard)/income/actions'
import { createRecurringTransaction } from '@/app/(dashboard)/recurring-actions'
import { AddCategoryDialog } from '@/components/categories/add-category-dialog'
import { useToast } from '@/components/ui/toast'

interface Option {
    id: string
    name: string
}

interface AddExpenseDialogProps {
    isOpen: boolean
    onClose: () => void
    categories: Option[]
    accounts: Option[]
    currency?: string
}

export function AddExpenseDialog({ isOpen, onClose, categories, accounts, currency = 'BRL' }: AddExpenseDialogProps) {
    const { showToast } = useToast()
    const [isPending, startTransition] = useTransition()
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category_id: '',
        account_id: '',
        is_recurring: false
    })

    const handleCategoryCreated = (categoryId: string) => {
        setFormData({ ...formData, category_id: categoryId })
        showToast('Categoria criada com sucesso!', 'success')
    }

    // Get currency symbol
    const getCurrencySymbol = (curr: string) => {
        const symbols: { [key: string]: string } = {
            'BRL': 'R$',
            'USD': '$',
            'EUR': '€',
            'GBP': '£'
        }
        return symbols[curr] || 'R$'
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        startTransition(async () => {
            let result

            if (formData.is_recurring) {
                // Create recurring transaction
                result = await createRecurringTransaction({
                    title: formData.title,
                    amount: Number(formData.amount),
                    start_date: formData.date,
                    category_id: formData.category_id,
                    account_id: formData.account_id,
                    type: 'expense',
                    frequency: 'monthly' // Default to monthly for now
                })
            } else {
                // Create one-time transaction
                result = await createTransaction({
                    title: formData.title,
                    amount: Number(formData.amount),
                    date: formData.date,
                    category_id: formData.category_id,
                    account_id: formData.account_id,
                    type: 'expense'
                })
            }

            if (result.success) {
                const message = formData.is_recurring
                    ? 'Despesa recorrente criada com sucesso!'
                    : 'Despesa adicionada com sucesso!'
                showToast(message, 'success')
                onClose()
                setFormData({
                    title: '',
                    amount: '',
                    date: new Date().toISOString().split('T')[0],
                    category_id: '',
                    account_id: '',
                    is_recurring: false
                })
            } else {
                showToast(result.error || 'Erro ao criar transação', 'error')
            }
        })
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Nova Despesa">
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Título */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Título</label>
                    <Input
                        required
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Ex: Aluguel, Supermercado"
                        className="bg-card border-border text-white"
                    />
                </div>

                {/* Valor e Data */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Valor ({getCurrencySymbol(currency)})</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                            {getCurrencySymbol(currency)}
                        </span>
                        <Input
                            required
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.amount}
                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            placeholder="0.00"
                            className="bg-card border-border text-white pl-12"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Data</label>
                    <Input
                        required
                        type="date"
                        value={formData.date}
                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                        className="bg-card border-border text-white"
                    />
                </div>

                {/* Categoria */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Categoria</label>
                    <div className="flex gap-2">
                        <select
                            required
                            className="flex-1 h-10 rounded-md border border-border bg-card px-3 py-2 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={formData.category_id}
                            onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                        >
                            <option value="" className="bg-card text-white">Selecione uma categoria</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id} className="bg-card text-white">{c.name}</option>
                            ))}
                        </select>
                        <Button
                            type="button"
                            variant="outline"
                            className="border-border hover:bg-card flex items-center gap-2 whitespace-nowrap"
                            onClick={() => setIsCategoryDialogOpen(true)}
                        >
                            <Tag className="h-4 w-4" />
                            Nova Categoria
                        </Button>
                    </div>
                </div>

                {/* Conta de Destino */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Conta de Origem</label>
                    <select
                        required
                        className="flex h-10 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={formData.account_id}
                        onChange={e => setFormData({ ...formData, account_id: e.target.value })}
                    >
                        <option value="" className="bg-card text-white">Selecione uma conta</option>
                        {accounts.map(a => (
                            <option key={a.id} value={a.id} className="bg-card text-white">{a.name}</option>
                        ))}
                    </select>
                </div>

                {/* Despesa Recorrente */}
                <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-white">Despesa Recorrente</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Esta despesa se repete mensalmente?</p>
                        </div>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={formData.is_recurring}
                            onClick={() => setFormData({ ...formData, is_recurring: !formData.is_recurring })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${formData.is_recurring ? 'bg-primary' : 'bg-input'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.is_recurring ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="border-border hover:bg-card"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-white text-black hover:bg-gray-200"
                    >
                        {isPending ? 'Salvando...' : 'Salvar Despesa'}
                    </Button>
                </div>
            </form>

            <AddCategoryDialog
                isOpen={isCategoryDialogOpen}
                onClose={() => setIsCategoryDialogOpen(false)}
                type="expense"
                onCategoryCreated={handleCategoryCreated}
            />
        </Modal>
    )
}
