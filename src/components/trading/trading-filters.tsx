'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useState, useEffect } from 'react'
import { Search, RotateCcw } from 'lucide-react'

export function TradingFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [period, setPeriod] = useState(searchParams.get('period') || 'all')
    const [asset, setAsset] = useState(searchParams.get('asset') || '')
    const [customRange, setCustomRange] = useState({
        start: searchParams.get('startDate') || '',
        end: searchParams.get('endDate') || ''
    })

    const handleApply = () => {
        const params = new URLSearchParams()
        if (asset) params.set('asset', asset)

        const now = new Date()
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().split('T')[0]

        // Calculate dates based on period
        if (period === 'today') {
            params.set('startDate', startOfDay)
            params.set('endDate', startOfDay)
        } else if (period === 'week') {
            const firstDay = new Date(now.setDate(now.getDate() - now.getDay())).toISOString().split('T')[0]
            params.set('startDate', firstDay)
            params.set('endDate', new Date().toISOString().split('T')[0])
        } else if (period === 'month') {
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
            params.set('startDate', firstDay)
            params.set('endDate', new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0])
        } else if (period === 'year') {
            const firstDay = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0]
            params.set('startDate', firstDay)
            params.set('endDate', new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0])
        } else if (period === 'custom') {
            if (customRange.start) params.set('startDate', customRange.start)
            if (customRange.end) params.set('endDate', customRange.end)
        }

        if (period !== 'all' && period !== 'custom') {
            params.set('period', period)
        }

        router.push(`/trading?${params.toString()}`)
    }

    const resetFilters = () => {
        setPeriod('all')
        setAsset('')
        setCustomRange({ start: '', end: '' })
        router.push('/trading')
    }

    return (
        <div className="flex flex-col md:flex-row gap-4 items-end mb-6 p-4 rounded-lg border border-border bg-card">
            <div className="w-full md:w-[200px] space-y-2">
                <span className="text-sm font-medium">Período</span>
                <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todo Histórico</SelectItem>
                        <SelectItem value="today">Hoje</SelectItem>
                        <SelectItem value="week">Esta Semana</SelectItem>
                        <SelectItem value="month">Este Mês</SelectItem>
                        <SelectItem value="year">Este Ano</SelectItem>
                        <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {period === 'custom' && (
                <div className="flex gap-2">
                    <div className="space-y-2">
                        <span className="text-sm font-medium">Início</span>
                        <Input
                            type="date"
                            value={customRange.start}
                            onChange={(e) => setCustomRange(prev => ({ ...prev, start: e.target.value }))}
                        />
                    </div>
                    <div className="space-y-2">
                        <span className="text-sm font-medium">Fim</span>
                        <Input
                            type="date"
                            value={customRange.end}
                            onChange={(e) => setCustomRange(prev => ({ ...prev, end: e.target.value }))}
                        />
                    </div>
                </div>
            )}

            <div className="w-full md:w-[200px] space-y-2">
                <span className="text-sm font-medium">Ativo</span>
                <Input
                    placeholder="Ex: WDO, WIN"
                    value={asset}
                    onChange={(e) => setAsset(e.target.value)}
                    className="uppercase"
                />
            </div>

            <div className="flex gap-2">
                <Button onClick={handleApply}>
                    <Search className="mr-2 h-4 w-4" />
                    Filtrar
                </Button>
                <Button variant="outline" onClick={resetFilters}>
                    <RotateCcw className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
