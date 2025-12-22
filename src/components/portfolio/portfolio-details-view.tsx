'use client'

import { useState, useMemo, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
    ChevronDown,
    Plus,
    ChevronRight,
    LineChart,
    Loader2,
    Copy,
    Edit,
    Trash2,
    FolderOpen,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal
} from 'lucide-react'
import Link from 'next/link'
import { updatePortfolio, duplicatePortfolio, deletePortfolio, getAssetQuotes, deleteTransaction, getAssetHistory } from '@/app/(dashboard)/portfolio/actions'
import { useRouter } from 'next/navigation'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import {
    DropdownMenu,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { CreatePortfolioDialog } from './create-portfolio-dialog'
import { CreateTransactionDialog } from './create-transaction-dialog'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { cn } from '@/lib/utils'

interface Transaction {
    id: string
    ticker: string
    type: 'buy' | 'sell' | 'dividend' | 'split'
    quantity: number
    price: number
    date: string
    fees: number
    notes?: string
}

interface Position {
    ticker: string
    quantity: number
    averagePrice: number
    totalInvested: number
    currentValue: number
    profit: number
    profitPercentage: number
    allocation: number
}

interface PortfolioDetailsViewProps {
    id: string
    initialName: string
    initialDescription: string | null
    portfolios?: { id: string; name: string }[]
    initialTransactions?: Transaction[]
}

export function PortfolioDetailsView({ id, initialName, initialDescription, portfolios = [], initialTransactions = [] }: PortfolioDetailsViewProps) {
    const router = useRouter()

    const [portfolioName, setPortfolioName] = useState(initialName)
    const [description, setDescription] = useState(initialDescription || '')

    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [isEditingDescription, setIsEditingDescription] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [activeTab, setActiveTab] = useState('Ativos')
    const [quotes, setQuotes] = useState<Record<string, number>>({})
    const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null)
    const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null)

    // UI States
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)

    const [historyRange, setHistoryRange] = useState<'1mo' | '3mo' | '6mo' | '1y' | 'max'>('1y')
    const [chartData, setChartData] = useState<{ date: string; value: number; invested: number }[]>([])
    const [isLoadingHistory, setIsLoadingHistory] = useState(false)

    // Fetch quotes
    useEffect(() => {
        const fetchQuotes = async () => {
            const tickers = Array.from(new Set(initialTransactions.map(t => t.ticker)))
            if (tickers.length > 0) {
                const newQuotes = await getAssetQuotes(tickers)
                setQuotes(newQuotes)
            }
        }
        fetchQuotes()
    }, [initialTransactions])

    // Fetch History and Calculate Chart Data
    useEffect(() => {
        const fetchHistory = async () => {
            const tickers = Array.from(new Set(initialTransactions.map(t => t.ticker)))
            if (tickers.length === 0) {
                setChartData([])
                return
            }

            setIsLoadingHistory(true)
            try {
                // Fetch history for all assets
                const historyMap = await getAssetHistory(tickers, historyRange)

                // Get all unique dates from history, sorted
                const allDates = new Set<string>()
                Object.values(historyMap).forEach(arr => arr.forEach(d => allDates.add(d.date)))
                const sortedDates = Array.from(allDates).sort()

                // Calculate portfolio value for each date
                const dataPoints = []

                // Sort transactions for replay
                const sortedTransactions = [...initialTransactions].sort((a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                )

                for (const date of sortedDates) {
                    // Filter transactions that happened on or before this date
                    const relevantTransactions = sortedTransactions.filter(t => t.date <= date)

                    if (relevantTransactions.length === 0) continue;

                    // Reconstruct portfolio state for this date
                    const portfolioState = new Map<string, number>() // ticker -> quantity
                    let totalInvested = 0
                    let investedCash = 0

                    relevantTransactions.forEach(t => {
                        if (t.type === 'buy') {
                            portfolioState.set(t.ticker, (portfolioState.get(t.ticker) || 0) + t.quantity)
                            investedCash += (t.quantity * t.price) + t.fees
                        } else if (t.type === 'sell') {
                            portfolioState.set(t.ticker, (portfolioState.get(t.ticker) || 0) - t.quantity)
                            // Simple approximation: reduce invested cash proportionally? 
                            // Or just track net flow. Let's track Net Invested (Cash In - Cash Out)
                            investedCash -= (t.quantity * t.price) - t.fees
                        } else if (t.type === 'split') {
                            const qty = portfolioState.get(t.ticker) || 0
                            if (qty > 0) {
                                portfolioState.set(t.ticker, qty * t.quantity)
                            }
                        }
                    })

                    // Calculate total value
                    let currentVal = 0

                    portfolioState.forEach((qty, ticker) => {
                        const historyArr = historyMap[ticker]
                        // Find price for this date or closest previous
                        const pricePoint = historyArr?.find(h => h.date === date)
                            || historyArr?.filter(h => h.date < date).pop() // Fallback to last known price

                        if (pricePoint) {
                            currentVal += qty * pricePoint.close
                        } else {
                            // Use transaction price if no history yet (e.g. IPO or new split) - simplified
                        }
                    })

                    dataPoints.push({
                        date,
                        value: currentVal,
                        invested: investedCash
                    })
                }

                setChartData(dataPoints)

            } catch (error) {
                console.error("Failed to fetch history", error)
            } finally {
                setIsLoadingHistory(false)
            }
        }

        fetchHistory()
    }, [initialTransactions, historyRange])


    // Calculate Positions
    const positions = useMemo(() => {
        const posMap = new Map<string, { quantity: number, totalCost: number }>()

        // Sort by date ascending for accurate average price calc
        const sortedTransactions = [...initialTransactions].sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        )

        for (const t of sortedTransactions) {
            if (!posMap.has(t.ticker)) {
                posMap.set(t.ticker, { quantity: 0, totalCost: 0 })
            }
            const pos = posMap.get(t.ticker)!

            if (t.type === 'buy') {
                pos.quantity += t.quantity
                pos.totalCost += (t.quantity * t.price) + t.fees
            } else if (t.type === 'sell') {
                // When selling, average price doesn't change, but total cost reduces proportionally
                if (pos.quantity > 0) {
                    const avgPrice = pos.totalCost / pos.quantity
                    pos.quantity -= t.quantity
                    pos.totalCost -= (t.quantity * avgPrice) // Reduce cost basis by sold amount * avg price
                }
            } else if (t.type === 'split') {
                if (pos.quantity > 0) {
                    // t.quantity holds the split factor. E.g. 2 for 1:2 split.
                    pos.quantity = pos.quantity * t.quantity
                    // Total cost remains the same, so average price naturally decreases
                }
            }
        }

        // Convert to array and filter out closed positions (or near zero)
        const activePositions = Array.from(posMap.entries())
            .map(([ticker, data]) => {
                const currentPrice = quotes[ticker] || (data.quantity > 0 ? data.totalCost / data.quantity : 0) // Fallback to avg price
                const currentValue = data.quantity * currentPrice
                const profit = currentValue - data.totalCost
                const profitPercentage = data.totalCost > 0 ? (profit / data.totalCost) * 100 : 0

                return {
                    ticker,
                    quantity: data.quantity,
                    averagePrice: data.quantity > 0 ? data.totalCost / data.quantity : 0,
                    totalInvested: data.totalCost,
                    currentValue,
                    profit,
                    profitPercentage,
                    allocation: 0
                }
            })
            .filter(p => p.quantity > 0.000001)

        // Calculate allocation
        const totalValue = activePositions.reduce((acc, p) => acc + p.currentValue, 0)
        activePositions.forEach(p => {
            p.allocation = totalValue > 0 ? (p.currentValue / totalValue) * 100 : 0
        })

        return activePositions.sort((a, b) => b.allocation - a.allocation)
    }, [initialTransactions, quotes])

    // Calculated Stats
    // Stats Calculations
    const totalCost = positions.reduce((acc, p) => acc + p.totalInvested, 0)
    const currentPortfolioValue = positions.reduce((acc, p) => acc + p.currentValue, 0)
    const unlimitedProfit = currentPortfolioValue - totalCost
    const unlimitedProfitPercentage = totalCost > 0 ? (unlimitedProfit / totalCost) * 100 : 0

    const handleDeleteTransaction = async () => {
        if (!transactionToDelete) return
        try {
            await deleteTransaction(transactionToDelete, id)
            setTransactionToDelete(null)
            router.refresh()
        } catch (error) {
            console.error('Failed to delete transaction', error)
        }
    }

    const handleTitleSave = async () => {
        if (portfolioName === initialName) {
            setIsEditingTitle(false)
            return
        }

        try {
            await updatePortfolio(id, { name: portfolioName })
            setIsEditingTitle(false)
            router.refresh()
        } catch (error) {
            console.error('Failed to update title', error)
        }
    }

    const handleDescriptionSave = async () => {
        setIsSaving(true)
        try {
            await updatePortfolio(id, { description })
            setIsEditingDescription(false)
            router.refresh()
        } catch (error) {
            console.error('Failed to update description', error)
        } finally {
            setIsSaving(false)
        }
    }

    const handleDuplicate = async () => {
        try {
            const { id: newId } = await duplicatePortfolio(id)
            router.push(`/portfolio/${newId}`)
        } catch (error) {
            console.error('Failed to duplicate', error)
        }
    }

    const handleDelete = async () => {
        try {
            await deletePortfolio(id)
            router.push('/portfolio')
        } catch (error) {
            console.error('Failed to delete', error)
        }
    }

    return (
        <div className="space-y-8 p-8 animate-slide-in">
            <CreatePortfolioDialog
                isOpen={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
            />

            <CreateTransactionDialog
                isOpen={isTransactionDialogOpen}
                onClose={() => {
                    setIsTransactionDialogOpen(false)
                    setTransactionToEdit(null)
                }}
                portfolioId={id}
                initialData={transactionToEdit}
            />

            <ConfirmDialog
                isOpen={!!transactionToDelete}
                onClose={() => setTransactionToDelete(null)}
                onConfirm={handleDeleteTransaction}
                title="Excluir Transação"
                description="Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita e afetará o saldo do portfolio."
                confirmText="Excluir"
                variant="danger"
            />

            <ConfirmDialog
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={handleDelete}
                title="Excluir Portfolio"
                description="Tem certeza que deseja excluir este portfolio? Esta ação não pode ser desfeita e todas as transações associadas serão perdidas."
                confirmText="Excluir"
                variant="danger"
            />

            {/* Header Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link href="/portfolio" className="hover:text-purple-400 transition-colors">Portfolios</Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-white">{portfolioName}</span>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1 w-full max-w-2xl">
                        <div className="flex items-center gap-2 h-10">
                            {isEditingTitle ? (
                                <Input
                                    value={portfolioName}
                                    onChange={(e) => setPortfolioName(e.target.value)}
                                    onBlur={handleTitleSave}
                                    onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
                                    autoFocus
                                    className="text-3xl font-bold bg-transparent border-none p-0 h-auto focus-visible:ring-0 md:w-auto w-full text-white"
                                />
                            ) : (
                                <div className="flex items-center gap-2">
                                    <h1
                                        onClick={() => setIsEditingTitle(true)}
                                        className="text-3xl font-bold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity select-none"
                                    >
                                        {portfolioName}
                                    </h1>

                                    <DropdownMenu
                                        open={isMenuOpen}
                                        onOpenChange={setIsMenuOpen}
                                        trigger={
                                            <button className="text-purple-500 hover:text-purple-400 transition-colors focus:outline-none flex items-center justify-center h-8 w-8 rounded-full hover:bg-white/5">
                                                <ChevronDown className="h-6 w-6" />
                                            </button>
                                        }
                                    >
                                        <DropdownMenuItem onClick={() => { handleDuplicate(); setIsMenuOpen(false) }} className="text-gray-300 hover:text-white hover:bg-purple-500/20 cursor-pointer">
                                            <Copy className="mr-2 h-4 w-4" />
                                            <span>Fazer uma cópia...</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => { setIsEditingTitle(true); setIsMenuOpen(false) }} className="text-gray-300 hover:text-white hover:bg-purple-500/20 cursor-pointer">
                                            <Edit className="mr-2 h-4 w-4" />
                                            <span>Editar...</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => { setIsDeleteConfirmOpen(true); setIsMenuOpen(false) }} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            <span>Excluir</span>
                                        </DropdownMenuItem>

                                        <div className="h-px bg-white/10 my-1" />

                                        <DropdownMenuItem onClick={() => { setIsCreateDialogOpen(true); setIsMenuOpen(false) }} className="text-gray-300 hover:text-white hover:bg-purple-500/20 cursor-pointer">
                                            <Plus className="mr-2 h-4 w-4" />
                                            <span>Criar novo portfolio</span>
                                        </DropdownMenuItem>

                                        {portfolios.length > 0 && (
                                            <>
                                                <div className="h-px bg-white/10 my-1" />
                                                <div className="px-4 py-2 text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Usados Recentemente</div>
                                                {portfolios.map(p => (
                                                    <DropdownMenuItem
                                                        key={p.id}
                                                        onClick={() => { router.push(`/portfolio/${p.id}`); setIsMenuOpen(false) }}
                                                        className="text-gray-300 hover:text-white hover:bg-purple-500/20 cursor-pointer"
                                                    >
                                                        <span>{p.name}</span>
                                                    </DropdownMenuItem>
                                                ))}
                                            </>
                                        )}

                                        <div className="h-px bg-white/10 my-1" />

                                        <DropdownMenuItem onClick={() => { router.push('/portfolio'); setIsMenuOpen(false) }} className="text-gray-300 hover:text-white hover:bg-purple-500/20 cursor-pointer">
                                            <FolderOpen className="mr-2 h-4 w-4" />
                                            <span>Abrir portfolio...</span>
                                        </DropdownMenuItem>
                                    </DropdownMenu>
                                </div>
                            )}
                        </div>

                        {isEditingDescription ? (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                <Textarea
                                    placeholder="Digite a descrição aqui..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="bg-black/20 border-purple-500/30 text-white min-h-[80px] focus:border-purple-500"
                                />
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        className="bg-white text-black hover:bg-gray-200"
                                        onClick={handleDescriptionSave}
                                        disabled={isSaving}
                                    >
                                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar'}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-white/10 hover:bg-white/5 text-gray-400"
                                        onClick={() => setIsEditingDescription(false)}
                                        disabled={isSaving}
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsEditingDescription(true)}
                                className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 group"
                            >
                                {description ? (
                                    <span className="text-gray-400 group-hover:text-gray-300">{description}</span>
                                ) : (
                                    <>
                                        <Plus className="h-3 w-3" /> Adicionar descrição
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-px rounded-md overflow-hidden shadow-lg shadow-purple-500/20 shrink-0 self-start md:self-center">
                        <Button
                            onClick={() => setIsTransactionDialogOpen(true)}
                            className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-r-none px-6 border-r border-white/10"
                        >
                            Nova Transação
                        </Button>
                        <Button className="bg-pink-600 hover:bg-pink-700 text-white px-3 rounded-l-none">
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-5 glass border-purple-500/20 space-y-4 hover:border-purple-500/40 transition-colors">
                    <div className="text-sm text-gray-400">Patrimônio Atual</div>
                    <div className="text-2xl font-bold text-white tracking-tight">R$ {currentPortfolioValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <div className="text-xs text-gray-500">Custo: R$ {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </Card>
                <Card className="p-5 glass border-white/5 space-y-4 hover:border-white/10 transition-colors">
                    <div className="text-sm text-gray-400">Lucro (Aberto)</div>
                    <div className={`text-2xl font-bold tracking-tight ${unlimitedProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        R$ {Math.abs(unlimitedProfit).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className={`text-xs flex items-center ${unlimitedProfitPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {unlimitedProfitPercentage >= 0 ? '+' : ''}{unlimitedProfitPercentage.toFixed(2)}%
                    </div>
                </Card>
                <Card className="p-5 glass border-white/5 space-y-4 hover:border-white/10 transition-colors">
                    <div className="text-sm text-gray-400">Dividendos</div>
                    <div className="text-2xl font-bold text-gray-300 tracking-tight">R$ 0,00</div>
                    <div className="text-xs text-gray-500">Total recebido</div>
                </Card>
                <Card className="p-5 glass border-white/5 space-y-4 hover:border-white/10 transition-colors">
                    <div className="text-sm text-gray-400">Transações</div>
                    <div className="text-2xl font-bold text-purple-400 tracking-tight">{initialTransactions.length}</div>
                    <div className="text-xs text-gray-500">Total</div>
                </Card>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-white/10">
                <div className="flex gap-8">
                    {['Visão Geral', 'Ativos', 'Transações'].map((tab, i) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 text-sm font-medium transition-all relative ${activeTab === tab
                                ? 'text-white'
                                : 'text-gray-400 hover:text-purple-300'
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-linear-to-r from-purple-500 to-pink-500 rounded-t-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            {activeTab === 'Visão Geral' && (
                <div className="py-8 space-y-6 glass border-white/5 rounded-3xl min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
                    {initialTransactions.length === 0 ? (
                        <>
                            <div className="absolute top-0 right-0 w-full h-full bg-linear-to-b from-purple-500/5 to-transparent pointer-events-none" />
                            <div className="w-full max-w-5xl text-left mb-4 px-8 z-10">
                                <h2 className="text-xl font-semibold text-white">Evolução da Carteira</h2>
                            </div>
                            <div className="flex flex-col items-center justify-center max-w-md mx-auto space-y-8 z-10 text-center">
                                <div className="h-32 w-48 relative opacity-80">
                                    <div className="absolute inset-0 border-2 border-dashed border-purple-500/30 rounded-xl flex items-center justify-center bg-purple-500/5">
                                        <LineChart className="h-12 w-12 text-purple-400" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-white">Comece sua jornada</h3>
                                    <p className="text-gray-400 text-sm max-w-xs mx-auto leading-relaxed">
                                        Adicione sua primeira transação para visualizar a evolução do seu patrimônio.
                                    </p>
                                </div>
                                <Button onClick={() => setIsTransactionDialogOpen(true)} className="h-11 px-8 rounded-full bg-white text-black hover:bg-gray-200 font-semibold shadow-lg shadow-white/10 hover:shadow-white/20 transition-all gap-2 transform hover:-translate-y-0.5">
                                    <Plus className="h-4 w-4" />
                                    Nova Transação
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full px-6 pb-6 flex flex-col">
                            <div className="flex justify-between items-center mb-6 px-2">
                                <h2 className="text-lg font-semibold text-white">Evolução Patrimonial</h2>
                                <div className="flex bg-white/5 rounded-lg p-1 gap-1">
                                    {(['1mo', '3mo', '6mo', '1y', 'max'] as const).map((r) => (
                                        <button
                                            key={r}
                                            onClick={() => setHistoryRange(r)}
                                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${historyRange === r
                                                ? 'bg-purple-600 text-white shadow-lg'
                                                : 'text-gray-400 hover:text-white hover:bg-white/10'
                                                }`}
                                        >
                                            {r === '1mo' ? '1M' : r === '3mo' ? '3M' : r === '6mo' ? '6M' : r === '1y' ? '1A' : 'Max'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 w-full min-h-[350px]">
                                {isLoadingHistory ? (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
                                    </div>
                                ) : chartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={350}>
                                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                            <XAxis
                                                dataKey="date"
                                                stroke="#9ca3af"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(value) => {
                                                    const date = new Date(value);
                                                    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                                                }}
                                                minTickGap={30}
                                            />
                                            <YAxis
                                                stroke="#9ca3af"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`}
                                            />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1a1d2d', borderColor: '#ffffff20', borderRadius: '12px' }}
                                                itemStyle={{ color: '#fff' }}
                                                labelStyle={{ color: '#9ca3af', marginBottom: '8px' }}
                                                formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, '']}
                                                labelFormatter={(label) => new Date(label).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="invested"
                                                name="Investido"
                                                stroke="#3b82f6"
                                                strokeOpacity={0.5}
                                                fillOpacity={1}
                                                fill="url(#colorInvested)"
                                                strokeWidth={2}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="value"
                                                name="Patrimônio"
                                                stroke="#a855f7"
                                                fillOpacity={1}
                                                fill="url(#colorValue)"
                                                strokeWidth={2}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        Dados insuficientes para o período selecionado.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'Ativos' && (
                <div className="glass border-white/5 rounded-3xl overflow-hidden">
                    {positions.length === 0 ? (
                        <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center">
                                <LineChart className="h-8 w-8 text-gray-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">Nenhum ativo na carteira</h3>
                                <p>Adicione compras para ver seus ativos aqui.</p>
                            </div>
                            <Button onClick={() => setIsTransactionDialogOpen(true)} variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                                Adicionar Transação
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white/5 text-gray-400 uppercase text-xs font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Ativo</th>
                                        <th className="px-6 py-4 text-right">Quantidade</th>
                                        <th className="px-6 py-4 text-right">Preço Médio</th>
                                        <th className="px-6 py-4 text-right">Preço Atual</th>
                                        <th className="px-6 py-4 text-right">Total Investido</th>
                                        <th className="px-6 py-4 text-right">Saldo Atual</th>
                                        <th className="px-6 py-4 text-right">Lucro/Prej.</th>
                                        <th className="px-6 py-4 text-right">% Carteira</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {positions.map((p) => (
                                        <tr key={p.ticker} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                                                <div className={cn(
                                                    "h-10 w-10 rounded-lg flex items-center justify-center text-xs border font-bold",
                                                    p.ticker.includes('-USD') ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                                                        p.ticker.includes('.SA') ? "bg-green-500/10 text-green-400 border-green-500/20" :
                                                            "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                                )}>
                                                    {p.ticker.substring(0, 2)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span>{p.ticker}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right text-gray-300">{p.quantity}</td>
                                            <td className="px-6 py-4 text-right text-gray-300">R$ {p.averagePrice.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-right text-white">
                                                {quotes[p.ticker] ? `R$ ${quotes[p.ticker].toFixed(2)}` : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-right text-gray-300">R$ {p.totalInvested.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-right font-medium text-white">R$ {p.currentValue.toFixed(2)}</td>
                                            <td className={`px-6 py-4 text-right font-medium ${p.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                <div className="flex flex-col items-end">
                                                    <span>R$ {p.profit.toFixed(2)}</span>
                                                    <span className="text-[10px] opacity-80">{p.profitPercentage.toFixed(2)}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right text-gray-400">
                                                <div className="flex items-center justify-end gap-2">
                                                    <span>{p.allocation.toFixed(1)}%</span>
                                                    <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-linear-to-r from-purple-500 to-pink-500 rounded-full"
                                                            style={{ width: `${p.allocation}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'Transações' && (
                <div className="glass border-white/5 rounded-3xl overflow-hidden">
                    {initialTransactions.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">
                            Nenhuma transação encontrada.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white/5 text-gray-400 uppercase text-xs font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Data</th>
                                        <th className="px-6 py-4">Ativo</th>
                                        <th className="px-6 py-4">Tipo</th>
                                        <th className="px-6 py-4 text-right">Qtd</th>
                                        <th className="px-6 py-4 text-right">Preço</th>
                                        <th className="px-6 py-4 text-right">Total</th>
                                        <th className="px-6 py-4 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {initialTransactions.map((t) => (
                                        <tr key={t.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 text-gray-300">{new Date(t.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 font-bold text-white">{t.ticker}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${t.type === 'buy' ? 'bg-green-500/10 text-green-400' :
                                                    t.type === 'sell' ? 'bg-red-500/10 text-red-400' :
                                                        t.type === 'split' ? 'bg-purple-500/10 text-purple-400' :
                                                            'bg-blue-500/10 text-blue-400'
                                                    }`}>
                                                    {t.type === 'buy' ? 'Compra' : t.type === 'sell' ? 'Venda' : t.type === 'split' ? 'Desdobramento' : 'Dividendo'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-white">
                                                {t.type === 'split' ? `Fator: ${t.quantity}x` : t.quantity}
                                            </td>
                                            <td className="px-6 py-4 text-right text-gray-300">
                                                {t.type === 'split' ? '—' : `R$ ${t.price.toFixed(2)}`}
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-white">
                                                {t.type === 'split' ? '—' : `R$ ${((t.price * t.quantity) + (t.type === 'buy' ? t.fees : -t.fees)).toFixed(2)}`}
                                            </td>
                                            <td className="px-6 py-4 text-right relative">
                                                <DropdownMenu
                                                    trigger={
                                                        <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    }
                                                >
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setTransactionToEdit(t)
                                                            setIsTransactionDialogOpen(true)
                                                        }}
                                                        className="hover:bg-white/5 hover:text-white cursor-pointer"
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" /> Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => setTransactionToDelete(t.id)}
                                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                                    </DropdownMenuItem>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
