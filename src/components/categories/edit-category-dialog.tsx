'use client'

import { useState, useTransition } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateCategory } from '@/app/(dashboard)/categories/actions'
import { useToast } from '@/components/ui/toast'
import { Ban } from 'lucide-react'

interface EditCategoryDialogProps {
    isOpen: boolean
    onClose: () => void
    category: {
        id: string
        name: string
        icon?: string
        type: string
    }
}

const CATEGORY_ICONS = [
    '💰', '💵', '💸', '💳', '🏦', '📊', '📈', '💼',
    '🏠', '🚗', '🍔', '🎮', '🎬', '✈️', '🏥', '📚',
    '🛒', '⚡', '💡', '🎁', '🎯', '🔧', '🎨', '🎵'
]

export function EditCategoryDialog({ isOpen, onClose, category }: EditCategoryDialogProps) {
    const { showToast } = useToast()
    const [isPending, startTransition] = useTransition()
    const [formData, setFormData] = useState({
        name: category.name,
        icon: category.icon || '💰'
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        startTransition(async () => {
            const result = await updateCategory(category.id, {
                name: formData.name,
                icon: formData.icon
            })

            if (result.success) {
                showToast('Categoria atualizada com sucesso!', 'success')
                onClose()
            } else {
                showToast(result.error || 'Erro ao atualizar categoria', 'error')
            }
        })
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Categoria">
            <form onSubmit={handleSubmit} className="space-y-5">
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
                        {/* No Icon Option */}
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, icon: '' })}
                            className={`
                                w-10 h-10 flex items-center justify-center text-2xl rounded-md
                                transition-all hover:scale-110
                                ${formData.icon === ''
                                    ? 'bg-primary ring-2 ring-primary ring-offset-2 ring-offset-background'
                                    : 'bg-background hover:bg-muted'
                                }
                            `}
                            title="Sem ícone"
                        >
                            <Ban className="h-5 w-5 text-muted-foreground" />
                        </button>
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
                        {isPending ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
