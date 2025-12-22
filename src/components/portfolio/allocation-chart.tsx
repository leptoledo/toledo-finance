'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AllocationChartProps {
    data: { ticker: string; value: number; percentage: number }[]
}

const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#6366f1']

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

export function AllocationChart({ data }: AllocationChartProps) {
    // Process data to show top 5 + Others if too many
    const processedData = (() => {
        if (data.length <= 6) return data
        const top5 = data.slice(0, 5)
        const others = data.slice(5)
        const othersValue = others.reduce((sum, item) => sum + item.value, 0)
        const othersPercentage = others.reduce((sum, item) => sum + item.percentage, 0)

        return [
            ...top5,
            { ticker: 'Outros', value: othersValue, percentage: othersPercentage }
        ]
    })()

    return (
        <Card className="border-white/10 bg-black/20 backdrop-blur-md h-full">
            <CardHeader>
                <CardTitle className="text-lg font-medium text-white">Alocação por Ativo</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    {data.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-gray-500">
                            Sem ativos na carteira
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={processedData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    nameKey="ticker"
                                >
                                    {processedData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000000', borderColor: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }}
                                    formatter={(value: number) => [formatCurrency(value), 'Valor']}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend
                                    wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }}
                                    layout="vertical"
                                    verticalAlign="middle"
                                    align="right"
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
