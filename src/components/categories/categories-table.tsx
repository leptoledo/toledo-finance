'use client'

import { useState, useTransition } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Trash2, Pencil } from 'lucide-react'
import { deleteCategory } from '@/app/(dashboard)/categories/actions'
import { useToast } from '@/components/ui/toast'
import { EditCategoryDialog } from './edit-category-dialog'

interface Category {
    id: string
    name: string
    type: string
    icon?: string
    user_id?: string
}

interface CategoriesTableProps {
    categories: Category[]
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
    const { showToast } = useToast()
    const [isPending, startTransition] = useTransition()
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)

    // All categories are user categories (no system defaults)
    const customCategories = categories

    const handleDelete = (id: string) => {
        if (confirm('Tem certeza que deseja excluir esta categoria?')) {
            startTransition(async () => {
                const result = await deleteCategory(id)
                if (result.success) {
                    showToast('Categoria excluída com sucesso!', 'success')
                } else {
                    showToast(result.error || 'Erro ao excluir categoria', 'error')
                }
            })
        }
    }

    return (
        <>
            <div className="rounded-md border border-border overflow-hidden">
                <div className="w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b [&_tr]:border-border">
                            <tr className="border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 w-[40%]">
                                    Nome
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 w-[20%]">
                                    Tipo
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 w-[30%]">
                                    ID
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 w-[10%]">

                                </th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {customCategories.length > 0 ? (
                                customCategories.map((category) => (
                                    <tr
                                        key={category.id}
                                        className="border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                    >
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">{category.icon || '💰'}</span>
                                                <span className="font-medium text-white">{category.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                            <Badge
                                                variant="secondary"
                                                className="bg-slate-800 text-slate-300 hover:bg-slate-700 font-normal border border-slate-700"
                                            >
                                                {category.type === 'income' ? 'Receita' : 'Despesa'}
                                            </Badge>
                                        </td>
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                            <span className="text-muted-foreground font-mono text-xs truncate block max-w-[200px]">
                                                {category.id}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-right">
                                            <DropdownMenu
                                                trigger={
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-white"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                }
                                            >
                                                <DropdownMenuItem
                                                    onClick={() => setEditingCategory(category)}
                                                    className="text-white focus:bg-muted focus:text-white cursor-pointer"
                                                >
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer"
                                                    onClick={() => handleDelete(category.id)}
                                                    variant="destructive"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Excluir
                                                </DropdownMenuItem>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="h-24 text-center align-middle text-muted-foreground">
                                        Nenhuma categoria personalizada encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {editingCategory && (
                <EditCategoryDialog
                    isOpen={!!editingCategory}
                    onClose={() => setEditingCategory(null)}
                    category={editingCategory}
                />
            )}
        </>
    )
}
