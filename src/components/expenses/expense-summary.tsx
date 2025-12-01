import { TrendingDown } from 'lucide-react'

interface ExpenseSummaryProps {
    total: number
    currency?: string
}

export function ExpenseSummary({ total, currency = 'BRL' }: ExpenseSummaryProps) {
    const formattedTotal = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: currency,
    }).format(total)

    return (
        <div className="group relative overflow-hidden rounded-2xl glass border border-red-500/20 hover-lift">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-rose-500/5 to-transparent" />

            <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/50">
                        <TrendingDown className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-xs font-medium text-red-400 bg-red-500/10 px-3 py-1 rounded-full">
                        Despesas
                    </div>
                </div>

                <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-400">Despesa Total Exibida</p>
                    <p className="text-4xl font-bold text-red-400">-{formattedTotal}</p>
                    <p className="text-xs text-muted-foreground">Total de transações exibidas</p>
                </div>
            </div>

            {/* Glow effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />
        </div>
    )
}
