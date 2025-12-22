'use client'

import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Search, Loader2, X, Bitcoin, DollarSign, TrendingUp, Briefcase } from 'lucide-react'
import { searchAssets } from '@/app/(dashboard)/portfolio/actions'
import { cn } from '@/lib/utils'

interface SymbolSearchModalProps {
    isOpen: boolean
    onClose: () => void
    onSelect: (symbol: string) => void
}

type FilterType = 'ALL' | 'EQUITY' | 'ETF' | 'FOREX' | 'CRYPTOCURRENCY'

const FILTERS: { label: string; value: FilterType }[] = [
    { label: 'Todos', value: 'ALL' },
    { label: 'Ações', value: 'EQUITY' },
    { label: 'Fundos/ETFs', value: 'ETF' },
    { label: 'Cripto', value: 'CRYPTOCURRENCY' },
    // { label: 'Forex', value: 'FOREX' }, // Yahoo often labels forex differently, skipping specifically for now or grouping
]

const POPULAR_ASSETS = [
    { symbol: 'BTC-USD', name: 'Bitcoin USD', type: 'CRYPTOCURRENCY', exch: 'CCC' },
    { symbol: 'ETH-USD', name: 'Ethereum USD', type: 'CRYPTOCURRENCY', exch: 'CCC' },
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', type: 'ETF', exch: 'NYSE Arca' },
    { symbol: 'QQQ', name: 'Invesco QQQ Trust', type: 'ETF', exch: 'NASDAQ' },
    { symbol: 'TSLA', name: 'Tesla, Inc.', type: 'EQUITY', exch: 'NASDAQ' },
    { symbol: 'AAPL', name: 'Apple Inc.', type: 'EQUITY', exch: 'NASDAQ' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'EQUITY', exch: 'NASDAQ' },
    { symbol: 'PETR4.SA', name: 'Petroleo Brasileiro S.A. - Petrobras', type: 'EQUITY', exch: 'SAO' },
    { symbol: 'VALE3.SA', name: 'Vale S.A.', type: 'EQUITY', exch: 'SAO' },
    { symbol: 'IVVB11.SA', name: 'iShares S&P 500 Fundo de Investimento', type: 'ETF', exch: 'SAO' },
]

export function SymbolSearchModal({ isOpen, onClose, onSelect }: SymbolSearchModalProps) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [activeFilter, setActiveFilter] = useState<FilterType>('ALL')

    // Debounce logic
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length < 2) {
                setResults([])
                return
            }

            setIsLoading(true)
            try {
                const data = await searchAssets(query)
                setResults(data)
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [query])

    // Determine which dataset to use: Search Results OR Popular Defaults
    const sourceData = query.length >= 2 ? results : POPULAR_ASSETS

    // Filter results locally since API doesn't support strict filtering args easily in one go
    // Note: Yahoo's `typeDisp` or `type` might vary (Equity, ETF, Cryptocurrency, etc.)
    // We will do a loose match based on the returned data
    const filteredResults = sourceData.filter(item => {
        if (activeFilter === 'ALL') return true
        const type = (item.type || '').toUpperCase()

        if (activeFilter === 'EQUITY') return type.includes('EQUITY') || type.includes('STOCK')
        if (activeFilter === 'ETF') return type.includes('ETF') || type.includes('FUND')
        if (activeFilter === 'CRYPTOCURRENCY') return type.includes('CRYPTO') || type.includes('COIN')

        return true
    })

    const getIcon = (type: string) => {
        const t = (type || '').toUpperCase()
        if (t.includes('CRYPTO')) return <Bitcoin className="h-5 w-5 text-yellow-500" />
        if (t.includes('ETF') || t.includes('FUND')) return <Briefcase className="h-5 w-5 text-blue-400" />
        if (t.includes('CURRENCY')) return <DollarSign className="h-5 w-5 text-green-400" />
        return <TrendingUp className="h-5 w-5 text-purple-400" />
    }

    const getIconStyles = (type: string) => {
        const t = (type || '').toUpperCase()
        if (t.includes('CRYPTO')) return "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
        if (t.includes('ETF') || t.includes('FUND')) return "bg-blue-500/10 border-blue-500/20 text-blue-400"
        if (t.includes('CURRENCY')) return "bg-green-500/10 border-green-500/20 text-green-400"
        return "bg-purple-500/10 border-purple-500/20 text-purple-400"
    }

    // Reset when opening
    useEffect(() => {
        if (isOpen) {
            // Maybe focus input?
        }
    }, [isOpen])

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] h-[550px] bg-[#121214] border-white/10 text-white p-0 gap-0 shadow-2xl flex flex-col overflow-hidden">
                <DialogHeader className="px-4 py-3 border-b border-white/5 flex flex-row items-center justify-between space-y-0">
                    <DialogTitle className="text-sm font-medium text-gray-200">
                        Buscar Ativo
                    </DialogTitle>
                    {/* Close button provided by DialogContent usually, but we can have custom if needed */}
                </DialogHeader>

                <div className="p-4 space-y-4">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <Input
                            placeholder="Buscar símbolo (ex: AAPL, BTC-USD, PETR4.SA)..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="pl-10 h-12 bg-black/40 border-white/10 text-lg text-white focus:border-purple-500/50 rounded-xl"
                            autoFocus
                        />
                        {isLoading && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Loader2 className="h-4 w-4 text-purple-500 animate-spin" />
                            </div>
                        )}
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-hide">
                        {FILTERS.map(filter => (
                            <button
                                key={filter.value}
                                onClick={() => setActiveFilter(filter.value)}
                                className={cn(
                                    "px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap",
                                    activeFilter === filter.value
                                        ? "bg-white text-black"
                                        : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results List */}
                <div className="flex-1 overflow-y-auto px-2">
                    {filteredResults.length === 0 && query.length > 2 && !isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2">
                            <Search className="h-8 w-8 opacity-20" />
                            <span className="text-sm">Nenhum ativo encontrado</span>
                        </div>
                    ) : (
                        <div className="space-y-1 pb-4">
                            {filteredResults.map((item) => (
                                <button
                                    key={item.symbol}
                                    onClick={() => onSelect(item.symbol)}
                                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-all group text-left border border-transparent hover:border-white/5"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "h-10 w-10 rounded-full flex items-center justify-center border font-bold text-lg",
                                            getIconStyles(item.type)
                                        )}>
                                            {getIcon(item.type)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-white group-hover:text-purple-400 transition-colors tracking-wide">
                                                {item.symbol}
                                            </span>
                                            <span className="text-xs text-gray-400 max-w-[200px] truncate font-medium">
                                                {item.name}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-right">
                                        <div className="flex flex-col items-end gap-0.5">
                                            <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">
                                                {item.type?.replace('Equity', 'Stock') || 'UNKNOWN'}
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs text-gray-300 font-semibold">
                                                    {item.exch}
                                                </span>
                                                {/* Simulated Country Flag/Icon based on Exchange could go here */}
                                                <div className={cn("h-1.5 w-1.5 rounded-full",
                                                    item.exch?.includes('Nasdaq') ? "bg-blue-500" :
                                                        item.exch?.includes('NYQ') ? "bg-blue-600" :
                                                            item.exch?.includes('SAO') ? "bg-green-500" : "bg-gray-500"
                                                )} />
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
