'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, Plus, FileText, ArrowRight, MoreVertical, Trash2, Copy, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import Image from 'next/image'
import { CreatePortfolioDialog } from '@/components/portfolio/create-portfolio-dialog'
import { useRouter } from 'next/navigation'
import { deletePortfolio, duplicatePortfolio } from './actions'
import { DividendChart } from '@/components/portfolio/dividend-chart'
import { AllocationChart } from '@/components/portfolio/allocation-chart'
import {
    DropdownMenu,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

interface Portfolio {
    id: string
    name: string
    updated_at: string
    currency: string
    description?: string
    totalInvested: number
    currentValue: number
    profit: number
    profitPercentage: number
}

interface AnalyticsData {
    dividends: {
        total: number
        history: { date: string; amount: number }[]
    }
    allocation: { ticker: string; value: number; percentage: number }[]
}

interface PortfolioViewProps {
    initialPortfolios: Portfolio[]
    globalStats: {
        netWorth: number
        invested: number
        profit: number
        profitPercentage: number
    }
    analytics?: AnalyticsData
}

function timeAgo(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    let interval = seconds / 31536000
    if (interval > 1) return Math.floor(interval) + " anos atrás"
    interval = seconds / 2592000
    if (interval > 1) return Math.floor(interval) + " meses atrás"
    interval = seconds / 86400
    if (interval > 1) return Math.floor(interval) + " dias atrás"
    interval = seconds / 3600
    if (interval > 1) return Math.floor(interval) + " horas atrás"
    interval = seconds / 60
    if (interval > 1) return Math.floor(interval) + " minutos atrás"
    return "agora mesmo"
}

export function PortfolioView({ initialPortfolios, globalStats, analytics }: PortfolioViewProps) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [dialogMode, setDialogMode] = useState<'manual' | 'upload'>('manual')
    const [portfolioToDelete, setPortfolioToDelete] = useState<string | null>(null)
    const [portfolioToDuplicate, setPortfolioToDuplicate] = useState<string | null>(null)
    const router = useRouter()

    const openDialog = (mode: 'manual' | 'upload') => {
        setDialogMode(mode)
        setIsCreateDialogOpen(true)
    }

    const handleDelete = async () => {
        if (!portfolioToDelete) return
        try {
            await deletePortfolio(portfolioToDelete)
            setPortfolioToDelete(null)
            router.refresh()
        } catch (error) {
            console.error('Failed to delete portfolio', error)
        }
    }

    const handleDuplicate = async () => {
        if (!portfolioToDuplicate) return
        try {
            await duplicatePortfolio(portfolioToDuplicate)
            setPortfolioToDuplicate(null)
            router.refresh()
        } catch (error) {
            console.error('Failed to duplicate portfolio', error)
        }
    }

    return (
        <div className="space-y-8 p-8 animate-slide-in">
            <CreatePortfolioDialog
                isOpen={isCreateDialogOpen}
                onClose={() => {
                    setIsCreateDialogOpen(false)
                    router.refresh() // Refresh to see new portfolio if created (though dialog usually redirects)
                }}
                mode={dialogMode}
            />

            <ConfirmDialog
                isOpen={!!portfolioToDelete}
                onClose={() => setPortfolioToDelete(null)}
                onConfirm={handleDelete}
                title="Excluir Portfolio"
                description="Tem certeza que deseja excluir este portfolio? Esta ação não pode ser desfeita."
                confirmText="Excluir"
                variant="danger"
            />

            <ConfirmDialog
                isOpen={!!portfolioToDuplicate}
                onClose={() => setPortfolioToDuplicate(null)}
                onConfirm={handleDuplicate}
                title="Duplicar Portfolio"
                description="Deseja criar uma cópia deste portfolio? O novo portfolio terá o mesmo nome com '(Copy)' adicionado."
                confirmText="Duplicar"
                variant="info"
            />

            {/* Header with Global Stats */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">Meus Portfolios</h1>
                    <p className="text-gray-400 mt-2">Visão consolidada do seu patrimônio.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <Card className="px-6 py-3 glass border-purple-500/20 flex flex-col items-end min-w-[160px] flex-1">
                        <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Patrimônio Global</span>
                        <span className="text-2xl font-bold text-white">
                            {globalStats.netWorth.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                    </Card>
                    <Card className="px-6 py-3 glass border-white/5 flex flex-col items-end min-w-[160px]">
                        <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Lucro Total</span>
                        <div className={`flex items-center gap-2 ${globalStats.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {globalStats.profit >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                            <span className="text-xl font-bold">
                                {Math.abs(globalStats.profit).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                        </div>
                        <span className={`text-xs ${globalStats.profit >= 0 ? 'text-green-500/70' : 'text-red-500/70'}`}>
                            {globalStats.profit >= 0 ? '+' : ''}{globalStats.profitPercentage.toFixed(2)}%
                        </span>
                    </Card>
                </div>
            </div>

            {/* Analytics Section */}
            {
                analytics && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="h-[350px]">
                            <DividendChart data={analytics.dividends.history} />
                        </div>
                        <div className="h-[350px]">
                            <AllocationChart data={analytics.allocation} />
                        </div>
                    </div>
                )
            }

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Existing Portfolios */}
                {initialPortfolios.map((portfolio) => (
                    <Card
                        key={portfolio.id}
                        className="p-6 flex flex-col justify-between group glass border-white/5 hover:border-purple-500/30 transition-all cursor-pointer relative overflow-hidden min-h-[200px]"
                        onClick={() => router.push(`/portfolio/${portfolio.id}`)}
                    >
                        {/* Hover Gradient */}
                        <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                        <div className="space-y-6 relative z-10 w-full">
                            <div className="flex justify-between items-start w-full">
                                <div className="min-w-0 flex-1 mr-2">
                                    <h3 className="font-semibold text-xl text-white truncate">{portfolio.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Atualizado {timeAgo(portfolio.updated_at)}
                                    </p>
                                </div>
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <DropdownMenu
                                        trigger={
                                            <button className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10 glass">
                                                <MoreVertical className="h-4 w-4" />
                                            </button>
                                        }
                                    >
                                        <DropdownMenuItem onClick={() => {
                                            router.push(`/portfolio/${portfolio.id}`)
                                        }} className="cursor-pointer text-gray-300 hover:text-white hover:bg-white/10">
                                            Abrir
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setPortfolioToDuplicate(portfolio.id)} className="cursor-pointer text-gray-300 hover:text-white hover:bg-white/10">
                                            <Copy className="mr-2 h-4 w-4" />
                                            Duplicar
                                        </DropdownMenuItem>
                                        <div className="h-px bg-white/10 my-1" />
                                        <DropdownMenuItem onClick={() => setPortfolioToDelete(portfolio.id)} className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            <span>Excluir</span>
                                        </DropdownMenuItem>
                                    </DropdownMenu>
                                </div>
                            </div>

                            <div className="py-2">
                                <span className="text-xs text-gray-500 block mb-1">Patrimônio</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-white">
                                        {portfolio.currentValue.toLocaleString('pt-BR', { style: 'currency', currency: portfolio.currency })}
                                    </span>
                                </div>
                                <div className="h-1 w-full bg-gray-800 rounded-full mt-3 overflow-hidden">
                                    <div
                                        className="h-full bg-linear-to-r from-purple-500 to-pink-500 rounded-full"
                                        style={{ width: `${globalStats.netWorth > 0 ? (portfolio.currentValue / globalStats.netWorth) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                <div>
                                    <span className="text-xs text-gray-500 block mb-1">Lucro/Prej.</span>
                                    <span className={`text-sm font-medium ${portfolio.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {portfolio.profit >= 0 ? '+' : ''}{Math.abs(portfolio.profit).toLocaleString('pt-BR', { style: 'currency', currency: portfolio.currency })}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 block mb-1">Retorno</span>
                                    <span className={`text-sm font-medium ${portfolio.profitPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {portfolio.profitPercentage >= 0 ? '+' : ''}{portfolio.profitPercentage.toFixed(2)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}

                {/* Upload CSV */}
                <Card
                    onClick={() => openDialog('upload')}
                    className="p-8 flex flex-col items-center text-center justify-center gap-4 hover:border-purple-500/50 transition-all cursor-pointer group glass border-dashed border-white/10 min-h-[200px]"
                >
                    <div className="h-14 w-14 rounded-full bg-linear-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Upload className="h-6 w-6 text-indigo-400" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold text-lg text-white">Upload CSV</h3>
                        <p className="text-xs text-gray-400">Importe transações</p>
                    </div>
                </Card>

                {/* Create Manually */}
                <Card
                    onClick={() => openDialog('manual')}
                    className="p-8 flex flex-col items-center text-center justify-center gap-4 hover:border-pink-500/50 transition-all cursor-pointer group glass border-dashed border-white/10 min-h-[200px]"
                >
                    <div className="h-14 w-14 rounded-full bg-linear-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Plus className="h-6 w-6 text-pink-400" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold text-lg text-white">Criar Manualmente</h3>
                        <p className="text-xs text-gray-400">Comece do zero</p>
                    </div>
                </Card>

                {/* From Watchlist */}
                <Card className="p-8 flex flex-col items-center text-center justify-center gap-4 hover:border-cyan-500/50 transition-all cursor-pointer group glass border-dashed border-white/10 min-h-[200px]">
                    <div className="h-14 w-14 rounded-full bg-linear-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <FileText className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold text-lg text-white">Da Watchlist</h3>
                        <p className="text-xs text-gray-400">Use uma lista salva</p>
                    </div>
                </Card>
            </div>

            {/* Feature Section */}
            <div className="glass border-white/5 rounded-3xl p-8 md:p-12 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-purple-500/10 to-transparent pointer-events-none" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8 z-10">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                                Comece em <br />
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400">segundos</span>
                            </h2>
                            <p className="text-lg text-gray-400 max-w-md">
                                Crie seu portfolio e faça upload do seu histórico — rápido, simples e integrado.
                            </p>
                        </div>
                        <Button
                            onClick={() => openDialog('manual')}
                            className="h-12 px-8 rounded-full bg-white text-black hover:bg-gray-200 mt-4 font-semibold text-base shadow-xl shadow-white/10 hover:shadow-white/20 transition-all"
                        >
                            Começar Agora <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                    <div className="relative h-[400px] w-full lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/20 border border-white/10 bg-gray-900/50 backdrop-blur-sm group perspective-1000">
                        <div className="absolute inset-0 bg-linear-to-br from-gray-900 to-black p-6">
                            <Image
                                src="/artifacts/portfolio_dashboard_mockup.png"
                                alt="Portfolio Dashboard Interface"
                                fill
                                className="object-cover object-top-left opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
