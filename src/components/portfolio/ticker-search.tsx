'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Search, Loader2 } from 'lucide-react'
import { searchAssets } from '@/app/(dashboard)/portfolio/actions'

interface TickerSearchProps {
    onSelect: (value: string) => void
    defaultValue?: string
}

// We need to create this hook if it doesn't exist, or just inline the debounce logic
function useDebounceValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay)
        return () => clearTimeout(timer)
    }, [value, delay])

    return debouncedValue
}

export function TickerSearch({ onSelect, defaultValue = '' }: TickerSearchProps) {
    const [query, setQuery] = useState(defaultValue)

    useEffect(() => {
        setQuery(defaultValue)
    }, [defaultValue])

    const [results, setResults] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const debouncedQuery = useDebounceValue(query, 500)

    useEffect(() => {
        const fetchResults = async () => {
            if (debouncedQuery.length < 2) {
                setResults([])
                setIsOpen(false)
                return
            }

            setIsLoading(true)
            try {
                const data = await searchAssets(debouncedQuery)
                setResults(data)
                setIsOpen(true)
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchResults()
    }, [debouncedQuery])

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (symbol: string) => {
        setQuery(symbol)
        onSelect(symbol)
        setIsOpen(false)
    }

    return (
        <div className="relative" ref={containerRef}>
            <div className="relative">
                <Input
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value.toUpperCase())
                        onSelect(e.target.value.toUpperCase()) // Update parent immediately too
                    }}
                    onFocus={() => {
                        if (results.length > 0) setIsOpen(true)
                    }}
                    placeholder="AAPL, PETR4.SA, BTC-USD..."
                    className="pl-9 bg-gray-900/50 border-white/10 uppercase"
                    autoComplete="off"
                    name="ticker" // Ensure form data picks it up
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 text-purple-500 animate-spin" />
                    ) : (
                        <Search className="h-4 w-4 text-gray-500" />
                    )}
                </div>
            </div>

            {isOpen && results.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-[#1a1d2d] border border-white/10 rounded-lg shadow-xl overflow-hidden max-h-[300px] overflow-y-auto">
                    {results.map((item) => (
                        <button
                            key={item.symbol}
                            type="button"
                            onClick={() => handleSelect(item.symbol)}
                            className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-center justify-between group border-b border-white/5 last:border-0"
                        >
                            <div>
                                <div className="font-bold text-white group-hover:text-purple-400 transition-colors">
                                    {item.symbol}
                                </div>
                                <div className="text-xs text-gray-400 truncate max-w-[200px]">
                                    {item.name}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-medium text-gray-500 bg-white/5 px-2 py-1 rounded">
                                    {item.exch}
                                </div>
                                <div className="text-[10px] text-gray-600 mt-1">
                                    {item.type}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
