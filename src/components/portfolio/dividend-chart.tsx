'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DividendChartProps {
    data: { date: string; amount: number }[]
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

const formatDate = (dateStr: string) => {
    // Expecting YYYY-MM
    const [year, month] = dateStr.split('-')
    return `${month}/${year.slice(2)}`
}

export function DividendChart({ data }: DividendChartProps) {
    // If no data, show empty state or just empty graph? 
    // Let's ensure we have at least defaults if empty to avoid crashes
    const chartData = data.length > 0 ? data : []

    return (
        <Card className="border-white/10 bg-black/20 backdrop-blur-md h-full">
            <CardHeader>
                <CardTitle className="text-lg font-medium text-white">Proventos Recebidos</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    {chartData.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-gray-500">
                            Sem dados de proventos
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={formatDate}
                                    stroke="#6b7280"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#6b7280"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `R$${value}`}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ backgroundColor: '#000000', borderColor: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }}
                                    formatter={(value: number) => [formatCurrency(value), 'Valor']}
                                    labelFormatter={(label) => formatDate(label)}
                                />
                                <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
