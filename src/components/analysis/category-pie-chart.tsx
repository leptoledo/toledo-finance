'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { CategoryExpense } from '@/lib/analysis'

interface CategoryPieChartProps {
    data: CategoryExpense[]
}

const COLORS = [
    '#EF4444', // red
    '#F59E0B', // amber
    '#10B981', // green
    '#3B82F6', // blue
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#14B8A6', // teal
    '#F97316', // orange
]

export function CategoryPieChart({ data }: CategoryPieChartProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value)
    }

    // Take top 8 categories
    const topCategories = data.slice(0, 8)

    const chartData = topCategories.map(item => ({
        name: item.category,
        value: item.amount,
        percentage: item.percentage,
    }))

    if (chartData.length === 0) {
        return (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
                <p>Sem dados para exibir</p>
            </div>
        )
    }

    const renderCustomLabel = (entry: any) => {
        return `${entry.percentage.toFixed(1)}%`
    }

    return (
        <div className="space-y-4">
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#F3F4F6'
                        }}
                        formatter={(value: number) => formatCurrency(value)}
                    />
                </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2">
                {chartData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-xs text-gray-300 truncate">{entry.name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
