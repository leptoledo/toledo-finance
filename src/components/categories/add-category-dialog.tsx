'use client'

import { useState, useTransition } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createCategory } from '@/app/(dashboard)/categories/actions'
import { useToast } from '@/components/ui/toast'

interface AddCategoryDialogProps {
    isOpen: boolean
    onClose: () => void
    type?: 'income' | 'expense'
    onCategoryCreated?: (categoryId: string) => void
}

const CATEGORY_ICONS = [
    '💰', '💵', '💸', '💳', '🏦', '📊', '📈', '💼',
    '🏠', '🚗', '🍔', '🎮', '🎬', '✈️', '🏥', '📚',
    '🛒', '⚡', '💡', '🎁', '🎯', '🔧', '🎨', '🎵'
]

export function AddCategoryDialog({ isOpen, onClose, type, onCategoryCreated }: AddCategoryDialogProps) {
    const { showToast } = useToast()
    const [isPending, startTransition] = useTransition()
    const [formData, setFormData] = useState({
        name: '',
        icon: '💰',
        type: type || 'expense'
    })

    // Update local type state if prop changes
    if (type && formData.type !== type) {
        setFormData(prev => ({ ...prev, type }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        startTransition(async () => {
            const result = await createCategory({
                name: formData.name,
                type: formData.type as 'income' | 'expense',
                icon: formData.icon
            })

            if (result.success && result.data) {
                if (onCategoryCreated) {
                    onCategoryCreated(result.data.id)
                }
                showToast('Categoria criada com sucesso!', 'success')
                onClose()
                setFormData({
                    name: '',
                    icon: '💰',
                    type: type || 'expense'
                })
            } else {
                showToast(result.error || 'Erro ao criar categoria', 'error')
            }
        })
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nova Categoria">
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Tipo (se não for fixo) */}
                {!type && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Tipo</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="type"
                                    value="income"
                                    checked={formData.type === 'income'}
                                    onChange={() => setFormData({ ...formData, type: 'income' })}
                                    className="accent-primary"
                                />
                                <span className="text-white">Receita</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="type"
                                    value="expense"
                                    checked={formData.type === 'expense'}
                                    onChange={() => setFormData({ ...formData, type: 'expense' })}
                                    className="accent-primary"
                                />
                                <span className="text-white">Despesa</span>
                            </label>
                        </div>
                    </div>
                )}

                {/* Nome */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Nome da Categoria</label>
                    <Input
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Freelance, Investimentos"
                        className="bg-card border-border text-white"
                    />
                </div>

                {/* Ícone */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Ícone</label>
                    <div className="grid grid-cols-8 gap-2 p-4 bg-card border border-border rounded-lg max-h-48 overflow-y-auto">
                        {CATEGORY_ICONS.map((icon) => (
                            <button
                                key={icon}
                                type="button"
                                onClick={() => setFormData({ ...formData, icon })}
                                className={`
                                    w-10 h-10 flex items-center justify-center text-2xl rounded-md
                                    transition-all hover:scale-110
                                    ${formData.icon === icon
                                        ? 'bg-primary ring-2 ring-primary ring-offset-2 ring-offset-background'
                                        : 'bg-background hover:bg-muted'
                                    }
                                `}
                            >
                                {icon}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Preview */}
                <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-2">Pré-visualização</p>
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">{formData.icon}</span>
                        <span className="text-white font-medium">{formData.name || 'Nome da categoria'}</span>
                        {!type && (
                            <span className="text-xs text-muted-foreground ml-auto uppercase border border-border px-2 py-1 rounded">
                                {formData.type === 'income' ? 'Receita' : 'Despesa'}
                            </span>
                        )}
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
                        {isPending ? 'Criando...' : 'Criar Categoria'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
