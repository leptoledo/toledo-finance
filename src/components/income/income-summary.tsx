import { TrendingUp } from 'lucide-react'

interface IncomeSummaryProps {
    total: number
    currency?: string
}

export function IncomeSummary({ total, currency = 'BRL' }: IncomeSummaryProps) {
    const formattedTotal = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: currency,
    }).format(total)

    return (
        <div className="group relative overflow-hidden rounded-2xl glass border border-green-500/20 hover-lift">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-linear-to-br from-green-500/10 via-emerald-500/5 to-transparent" />

            <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-linear-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/50">
                        <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-xs font-medium text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
                        Receitas
                    </div>
                </div>

                <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-400">Receita Total Exibida</p>
                    <p className="text-4xl font-bold text-green-400">{formattedTotal}</p>
                    <p className="text-xs text-muted-foreground">Total de transações exibidas</p>
                </div>
            </div>

            {/* Glow effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-br from-green-500/5 to-transparent pointer-events-none" />
        </div>
    )
}
