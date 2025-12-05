'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Upload } from 'lucide-react'

interface ParsedTransaction {
    date: string
    description: string
    amount: number
    type: 'income' | 'expense'
}

interface Category {
    id: string
    name: string
    type: 'income' | 'expense'
    icon: string | null
}

interface CategoryMapperProps {
    transactions: ParsedTransaction[]
    categories: Category[]
    mappings: Record<string, string>
    onMappingsChange: (mappings: Record<string, string>) => void
    onImport: () => void
    onBack: () => void
    isProcessing: boolean
    error: string | null
}

export function CategoryMapper({
    transactions,
    categories,
    mappings,
    onMappingsChange,
    onImport,
    onBack,
    isProcessing,
    error
}: CategoryMapperProps) {
    // Get unique descriptions
    const uniqueDescriptions = Array.from(new Set(transactions.map(t => t.description)))

    const handleMappingChange = (description: string, categoryId: string) => {
        onMappingsChange({
            ...mappings,
            [description]: categoryId
        })
    }

    const getTransactionType = (description: string): 'income' | 'expense' => {
        const transaction = transactions.find(t => t.description === description)
        return transaction?.type || 'expense'
    }

    const getFilteredCategories = (description: string) => {
        const type = getTransactionType(description)
        return categories.filter(c => c.type === type)
    }

    const getTransactionCount = (description: string) => {
        return transactions.filter(t => t.description === description).length
    }

    const mappedCount = Object.keys(mappings).length
    const totalDescriptions = uniqueDescriptions.length

    return (
        <div className="space-y-6">
            {/* Progress */}
            <div className="relative overflow-hidden rounded-2xl glass border border-cyan-500/20 p-6">
                <div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 via-blue-500/5 to-transparent" />
                <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-400">Progresso do Mapeamento</p>
                        <p className="text-sm font-semibold text-cyan-400">
                            {mappedCount} / {totalDescriptions}
                        </p>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-linear-to-r from-cyan-500 to-blue-600 transition-all duration-500"
                            style={{ width: `${(mappedCount / totalDescriptions) * 100}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                        Mapeie as descrições para as categorias correspondentes
                    </p>
                </div>
            </div>

            {/* Mapping List */}
            <div className="relative overflow-hidden rounded-2xl glass border border-cyan-500/20">
                <div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 via-blue-500/5 to-transparent" />
                <div className="relative p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                        Mapear Categorias
                    </h3>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        {uniqueDescriptions.map((description, index) => {
                            const type = getTransactionType(description)
                            const count = getTransactionCount(description)
                            const filteredCategories = getFilteredCategories(description)

                            return (
                                <div
                                    key={index}
                                    className="p-4 rounded-lg bg-gray-800/30 border border-white/5 space-y-3"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">
                                                {description}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${type === 'income'
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : 'bg-red-500/20 text-red-400'
                                                    }`}>
                                                    {type === 'income' ? 'Receita' : 'Despesa'}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {count} {count === 1 ? 'transação' : 'transações'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs text-gray-400">Categoria</Label>
                                        <Select
                                            value={mappings[description] || ''}
                                            onValueChange={(value) => handleMappingChange(description, value)}
                                        >
                                            <SelectTrigger className="bg-gray-800/50 border-white/10">
                                                <SelectValue placeholder="Selecione uma categoria" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {filteredCategories.map((category) => (
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
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
                    {error}
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
                <Button
                    onClick={onBack}
                    variant="outline"
                    className="flex-1 border-white/10 hover:bg-white/5"
                    disabled={isProcessing}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                </Button>
                <Button
                    onClick={onImport}
                    disabled={isProcessing || mappedCount === 0}
                    className="flex-1 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/50"
                >
                    {isProcessing ? (
                        'Importando...'
                    ) : (
                        <>
                            <Upload className="mr-2 h-4 w-4" />
                            Importar {transactions.length} Transações
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
