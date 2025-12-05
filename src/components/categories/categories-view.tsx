'use client'

import { useState } from 'react'
import { Tag, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CategoriesTable } from './categories-table'
import { AddCategoryDialog } from './add-category-dialog'

interface CategoriesViewProps {
    categories: any[]
    totalCount: number
    currentPage: number
}

export function CategoriesView({ categories, totalCount, currentPage }: CategoriesViewProps) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                        <span className="bg-linear-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">
                            Gerenciamento de Categorias
                        </span>
                    </h1>
                    <p className="text-muted-foreground">Visualize e gerencie as categorias personalizadas que você criou.</p>
                </div>
                <Button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="w-full sm:w-auto bg-linear-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white shadow-lg shadow-purple-500/50 transition-all hover-lift"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Categoria
                </Button>
            </div>

            {/* Content */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-linear-to-br from-purple-500 to-violet-600 shadow-lg shadow-purple-500/50">
                        <Tag className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-white leading-none mb-1">
                            Categorias
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Exibindo {categories.length} de {totalCount} categorias personalizadas.
                        </p>
                    </div>
                </div>

                <CategoriesTable
                    categories={categories}
                    totalCount={totalCount}
                    currentPage={currentPage}
                />
            </div>

            {/* Footer Note */}
            <div className="relative overflow-hidden rounded-2xl glass border border-purple-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-violet-500/5 to-transparent" />
                <div className="relative p-6">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-purple-500/10 mt-0.5">
                            <Tag className="h-4 w-4 text-purple-400" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-2">Nota Importante</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                As categorias padrão (Ex: Alimentação, Salário) não podem ser excluídas e não aparecem nesta lista, mas estão disponíveis nos modais de transação.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Dialog */}
            <AddCategoryDialog
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
            // No type passed, so it will show the type selector
            />
        </div>
    )
}
