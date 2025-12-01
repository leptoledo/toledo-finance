'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { MonthlyData } from '@/lib/analysis'

interface MonthlyTrendChartProps {
    data: MonthlyData[]
}

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value)
    }

    const formatMonth = (monthStr: string) => {
        const [year, month] = monthStr.split('-')
        const date = new Date(parseInt(year), parseInt(month) - 1)
        return date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
    }

    const chartData = data.map(item => ({
        month: formatMonth(item.month),
        Receitas: item.income,
        Despesas: item.expenses,
    }))

    if (chartData.length === 0) {
        return (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
                <p>Sem dados para exibir</p>
            </div>
        )
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                    dataKey="month"
                    stroke="#9CA3AF"
                    style={{ fontSize: '12px' }}
                />
                <YAxis
                    stroke="#9CA3AF"
                    style={{ fontSize: '12px' }}
                    tickFormatter={formatCurrency}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F3F4F6'
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                    labelStyle={{ color: '#F3F4F6' }}
                />
                <Legend
                    wrapperStyle={{ color: '#F3F4F6' }}
                />
                <Bar dataKey="Receitas" fill="#10B981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Despesas" fill="#EF4444" radius={[8, 8, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    )
}
