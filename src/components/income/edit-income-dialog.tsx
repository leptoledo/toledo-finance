'use client'

import { useState, useTransition } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateTransaction } from '@/app/(dashboard)/income/actions'

interface EditIncomeDialogProps {
    isOpen: boolean
    onClose: () => void
    transaction: {
        id: string
        title: string
        amount: number
        date: string
        category_id: string
        account_id: string
    }
    categories: Array<{ id: string; name: string }>
    accounts: Array<{ id: string; name: string }>
}

export function EditIncomeDialog({
    isOpen,
    onClose,
    transaction,
    categories,
    accounts
}: EditIncomeDialogProps) {
    const [isPending, startTransition] = useTransition()
    const [formData, setFormData] = useState({
        title: transaction.title,
        amount: transaction.amount.toString(),
        date: transaction.date,
        category_id: transaction.category_id,
        account_id: transaction.account_id
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        startTransition(async () => {
            await updateTransaction(transaction.id, {
                title: formData.title,
                amount: parseFloat(formData.amount),
                date: formData.date,
                category_id: formData.category_id,
                account_id: formData.account_id,
                type: 'income'
            })
            onClose()
        })
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Receita">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-foreground">Título</label>
                    <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Ex: Salário"
                        required
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-foreground">Valor</label>
                    <Input
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        placeholder="0.00"
                        required
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-foreground">Data</label>
                    <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-foreground">Categoria</label>
                    <select
                        value={formData.category_id}
                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground"
                        required
                    >
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-sm font-medium text-foreground">Conta</label>
                    <select
                        value={formData.account_id}
                        onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground"
                        required
                    >
                        {accounts.map((acc) => (
                            <option key={acc.id} value={acc.id}>
                                {acc.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-2 justify-end pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? 'Salvando...' : 'Salvar'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
