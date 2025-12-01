'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ExpensesByCategoryChartProps {
    data: {
        name: string
        value: number
        icon?: string
    }[]
    currency: string
}

const COLORS = [
    '#6366f1', // indigo
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#f59e0b', // amber
    '#10b981', // emerald
    '#3b82f6', // blue
    '#ef4444', // red
    '#14b8a6', // teal
]

export function ExpensesByCategoryChart({ data, currency }: ExpensesByCategoryChartProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: currency,
        }).format(value)
    }

    const total = data.reduce((sum, item) => sum + item.value, 0)

    return (
        <Card className="col-span-4 lg:col-span-2">
            <CardHeader>
                <CardTitle>Despesas por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
                {data.length > 0 ? (
                    <>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                        formatter={(value: number) => formatCurrency(value)}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 space-y-2">
                            {data.slice(0, 5).map((item, index) => (
                                <div key={item.name} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                        />
                                        <span className="text-muted-foreground">
                                            {item.icon} {item.name}
                                        </span>
                                    </div>
                                    <span className="font-medium">{formatCurrency(item.value)}</span>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        Nenhuma despesa registrada
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
