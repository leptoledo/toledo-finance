'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MonthlyComparisonChartProps {
    data: {
        month: string
        receita: number
        despesa: number
        saldo: number
    }[]
    currency: string
}

export function MonthlyComparisonChart({ data, currency }: MonthlyComparisonChartProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: currency,
            notation: 'compact',
            maximumFractionDigits: 1,
        }).format(value)
    }

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Comparação Mensal</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                            <XAxis
                                dataKey="month"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={formatCurrency}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                                formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value)}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                            <Bar
                                dataKey="receita"
                                fill="#10b981"
                                radius={[8, 8, 0, 0]}
                                name="Receita"
                            />
                            <Bar
                                dataKey="despesa"
                                fill="#ef4444"
                                radius={[8, 8, 0, 0]}
                                name="Despesa"
                            />
                            <Bar
                                dataKey="saldo"
                                fill="#6366f1"
                                radius={[8, 8, 0, 0]}
                                name="Saldo"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
