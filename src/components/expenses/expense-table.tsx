'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EditExpenseDialog } from './edit-expense-dialog'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Search, Filter, MoreHorizontal, Trash2, Pencil, Check, X, CalendarIcon } from 'lucide-react'
import { deleteTransaction } from '@/app/(dashboard)/income/actions'
import { useToast } from '@/components/ui/toast'

interface Transaction {
    id: string
    title: string
    amount: number
    date: string
    category_id: string
    account_id: string
    category: {
        name: string
        type: string
        icon?: string
    } | null
}

interface ExpenseTableProps {
    transactions: Transaction[]
    totalCount: number
    currentPage: number
    currency?: string
    options: {
        categories: any[]
        accounts: any[]
    }
    totalAmount?: number
}

// Wrapper to prevent browser issues with date inputs
const DateInput = ({ value, onChange, placeholder }: { value: string, onChange: (val: string) => void, placeholder?: string }) => {
    const inputRef = useRef<HTMLInputElement>(null)
    return (
        <div className="relative group cursor-pointer" onClick={() => inputRef.current?.showPicker()}>
            <div className="absolute left-0 inset-y-0 flex items-center justify-center pl-3 pointer-events-none z-10">
                <CalendarIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <Input
                ref={inputRef}
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-9 [&::-webkit-calendar-picker-indicator]:opacity-0 cursor-pointer text-left font-normal"
                style={{ paddingLeft: '2.5rem' }} // Ensure space for icon
            />
            {/* Fallback space for native picker if needed, but styling opacity-0 hides it while keeping it clickable */}
        </div>
    )
}

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export function ExpenseTable({ transactions, totalCount, currentPage, currency = 'BRL', options, totalAmount = 0 }: ExpenseTableProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { showToast } = useToast()
    const [isPending, startTransition] = useTransition()
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
    const [deletingTransactionId, setDeletingTransactionId] = useState<string | null>(null)

    // Filter States
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    // Get search from URL or default to empty
    const currentSearch = searchParams.get('search') || ''
    const currentCategoryId = searchParams.get('categoryId')
    const currentStartDate = searchParams.get('startDate')
    const currentEndDate = searchParams.get('endDate')
    const currentMinAmount = searchParams.get('minAmount')
    const currentMaxAmount = searchParams.get('maxAmount')

    const [searchTerm, setSearchTerm] = useState(currentSearch)
    // Debounced search term
    const debouncedSearchTerm = useDebounce(searchTerm, 500)

    const [tempFilters, setTempFilters] = useState({
        search: currentSearch || '',
        categoryId: currentCategoryId || 'all',
        startDate: currentStartDate || '',
        endDate: currentEndDate || '',
        minAmount: currentMinAmount || '',
        maxAmount: currentMaxAmount || ''
    })

    const pageSize = 10
    const totalPages = Math.ceil(totalCount / pageSize)

    // Effect to trigger search when debounced value changes
    useEffect(() => {
        // Only trigger if the value actually changed from what's in the URL
        if (debouncedSearchTerm !== currentSearch) {
            const params = new URLSearchParams(searchParams)
            if (debouncedSearchTerm) {
                params.set('search', debouncedSearchTerm)
            } else {
                params.delete('search')
            }
            params.set('page', '1') // Reset to page 1 on search
            startTransition(() => {
                router.push(`?${params.toString()}`)
            })
        }
    }, [debouncedSearchTerm, currentSearch, router, searchParams, startTransition])

    // Sync tempFilters when URL params change (and menu is closed)
    useEffect(() => {
        if (!isFilterOpen) {
            setTempFilters({
                search: currentSearch || '',
                categoryId: currentCategoryId || 'all',
                startDate: currentStartDate || '',
                endDate: currentEndDate || '',
                minAmount: currentMinAmount || '',
                maxAmount: currentMaxAmount || ''
            })
        }
    }, [currentSearch, currentCategoryId, currentStartDate, currentEndDate, currentMinAmount, currentMaxAmount, isFilterOpen])

    // Update local search term when URL changes, also sync to temp filters
    useEffect(() => {
        setSearchTerm(currentSearch)
        // Sync tempFilters search too if it differs (e.g. initial load or external change)
        if (!isFilterOpen) {
            setTempFilters(prev => ({ ...prev, search: currentSearch }))
        }
    }, [currentSearch, isFilterOpen])


    // Handle update from inputs
    const handleSearchChange = (term: string) => {
        setSearchTerm(term)
        setTempFilters(prev => ({ ...prev, search: term }))
    }

    const handleApplyFilters = () => {
        const params = new URLSearchParams(searchParams)

        // Title Filter (which is 'search' in URL)
        if (tempFilters.search) {
            params.set('search', tempFilters.search)
        } else {
            params.delete('search')
        }

        if (tempFilters.categoryId && tempFilters.categoryId !== 'all') {
            params.set('categoryId', tempFilters.categoryId)
        } else {
            params.delete('categoryId')
        }

        if (tempFilters.startDate) params.set('startDate', tempFilters.startDate)
        else params.delete('startDate')

        if (tempFilters.endDate) params.set('endDate', tempFilters.endDate)
        else params.delete('endDate')

        if (tempFilters.minAmount) params.set('minAmount', tempFilters.minAmount)
        else params.delete('minAmount')

        if (tempFilters.maxAmount) params.set('maxAmount', tempFilters.maxAmount)
        else params.delete('maxAmount')

        params.set('page', '1')
        router.push(`?${params.toString()}`)
        setIsFilterOpen(false)
    }

    const handleClearFilters = () => {
        setTempFilters({
            search: '',
            categoryId: 'all',
            startDate: '',
            endDate: '',
            minAmount: '',
            maxAmount: ''
        })
        const params = new URLSearchParams(searchParams)
        params.delete('search')
        params.delete('categoryId')
        params.delete('startDate')
        params.delete('endDate')
        params.delete('minAmount')
        params.delete('maxAmount')
        params.set('page', '1')
        router.push(`?${params.toString()}`)
    }

    const activeFiltersCount = [
        currentCategoryId,
        currentStartDate,
        currentEndDate,
        currentMinAmount,
        currentMaxAmount,
        // Dont count search if it is just a text search, traditionally filters are "extra"
        // But user might want to see valid count. Let's include it if present.
        currentSearch
    ].filter(Boolean).length

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', page.toString())
        router.push(`?${params.toString()}`)
    }

    const handleDelete = (id: string) => {
        setDeletingTransactionId(id)
    }

    const confirmDelete = () => {
        if (!deletingTransactionId) return

        startTransition(async () => {
            const result = await deleteTransaction(deletingTransactionId)
            if (result?.success) {
                showToast('Despesa excluída com sucesso!', 'success')
                router.refresh()
            } else {
                showToast('Erro ao excluir despesa', 'error')
            }
        })
    }

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction)
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: currency,
        }).format(value)
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('pt-BR')
    }

    return (
        <div className="space-y-4">
            {/* Search and filter bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1 max-w-full sm:max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar despesa..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                </div>
                <DropdownMenu
                    open={isFilterOpen}
                    onOpenChange={setIsFilterOpen}
                    trigger={
                        <Button variant="outline" className="gap-2 w-full sm:w-auto">
                            <Filter className="h-4 w-4" />
                            Filtros
                            {activeFiltersCount > 0 && (
                                <Badge variant="secondary" className="ml-1 px-1 h-5 min-w-5 justify-center">
                                    {activeFiltersCount}
                                </Badge>
                            )}
                        </Button>
                    }
                >
                    <div className="p-4 space-y-4 w-80">
                        {/* Title Input inside Filters */}
                        <div className="space-y-2">
                            <Label>Título / Descrição</Label>
                            <Input
                                placeholder="Filtrar por nome..."
                                value={tempFilters.search}
                                onChange={(e) => handleSearchChange(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Categoria</Label>
                            <Select
                                value={tempFilters.categoryId}
                                onValueChange={(value) => setTempFilters({ ...tempFilters, categoryId: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas as categorias</SelectItem>
                                    {options.categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            <span className="flex items-center gap-2">
                                                <span>{category.icon}</span>
                                                <span>{category.name}</span>
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Data</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground">De</span>
                                    <DateInput
                                        value={tempFilters.startDate}
                                        onChange={(val) => setTempFilters({ ...tempFilters, startDate: val })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground">Até</span>
                                    <DateInput
                                        value={tempFilters.endDate}
                                        onChange={(val) => setTempFilters({ ...tempFilters, endDate: val })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Valor</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground">Mínimo</span>
                                    <Input
                                        type="number"
                                        placeholder="0,00"
                                        value={tempFilters.minAmount}
                                        onChange={(e) => setTempFilters({ ...tempFilters, minAmount: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground">Máximo</span>
                                    <Input
                                        type="number"
                                        placeholder="0,00"
                                        value={tempFilters.maxAmount}
                                        onChange={(e) => setTempFilters({ ...tempFilters, maxAmount: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Summary of Total Found */}
                        <div className="pt-2 pb-2 text-center border-t border-border">
                            <span className="text-xs text-muted-foreground block mb-1">Total filtrado</span>
                            <span className="text-lg font-bold text-red-500">
                                {formatCurrency(totalAmount)}
                            </span>
                        </div>

                        <div className="flex gap-2">
                            <Button className="flex-1" onClick={handleApplyFilters}>Aplicar</Button>
                            <Button variant="outline" onClick={handleClearFilters}>Limpar</Button>
                        </div>
                    </div>
                </DropdownMenu>
            </div>

            {/* Info Bar */}
            <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
                <span>
                    Exibindo {transactions.length} de {totalCount} despesas.
                </span>
                {totalAmount > 0 && (
                    <span className="hidden sm:inline-block">
                        Total nesta busca: <span className="font-medium text-red-500">{formatCurrency(totalAmount)}</span>
                    </span>
                )}
            </div>

            {/* Table with horizontal scroll on mobile */}
            <div className="rounded-md border border-border overflow-hidden">
                <div className="w-full overflow-x-auto overflow-y-visible">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b [&_tr]:border-border">
                            <tr className="border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 w-[40%]">
                                    Título
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 w-[20%]">
                                    Categoria
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 w-[15%]">
                                    Data
                                </th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 w-[15%]">
                                    Valor
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 w-[10%]">
                                </th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {transactions.length > 0 ? (
                                transactions.map((transaction) => (
                                    <tr
                                        key={transaction.id}
                                        className="border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                    >
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">{transaction.category?.icon}</span>
                                                <span className="font-medium text-white">{transaction.title}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                            <Badge
                                                variant="secondary"
                                                className="bg-red-500/10 text-red-500 hover:bg-red-500/20 font-normal border border-red-500/20"
                                            >
                                                {transaction.category?.name || 'Sem categoria'}
                                            </Badge>
                                        </td>
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                            <span className="text-muted-foreground">
                                                {formatDate(transaction.date)}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-right">
                                            <span className="font-medium text-red-500">
                                                -{formatCurrency(transaction.amount)}
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
                                                    onClick={() => handleEdit(transaction)}
                                                    className="cursor-pointer"
                                                >
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-500 focus:text-red-500 cursor-pointer"
                                                    onClick={() => handleDelete(transaction.id)}
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
                                    <td colSpan={5} className="h-24 text-center align-middle text-muted-foreground">
                                        Nenhuma despesa encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                    >
                        Anterior
                    </Button>
                    <div className="text-sm font-medium">
                        Página {currentPage} de {totalPages}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                    >
                        Próxima
                    </Button>
                </div>
            )}

            {editingTransaction && (
                <EditExpenseDialog
                    isOpen={!!editingTransaction}
                    onClose={() => setEditingTransaction(null)}
                    transaction={editingTransaction}
                    categories={options.categories}
                    accounts={options.accounts}
                />
            )}

            <ConfirmDialog
                isOpen={!!deletingTransactionId}
                onClose={() => setDeletingTransactionId(null)}
                onConfirm={confirmDelete}
                title="Excluir Despesa"
                description="Tem certeza que deseja excluir esta despesa? Esta ação não pode ser desfeita."
                confirmText="Excluir"
                cancelText="Cancelar"
                variant="danger"
            />
        </div>
    )
}
