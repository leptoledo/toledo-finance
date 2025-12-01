'use client'

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CashFlowChartProps {
    data: {
        name: string
        receita: number
        despesa: number
    }[]
    currency: string
}

export function CashFlowChart({ data, currency }: CashFlowChartProps) {
    return (
        <Card className="col-span-4 lg:col-span-3">
            <CardHeader>
                <CardTitle>Fluxo de Caixa Mensal</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                            <XAxis
                                dataKey="name"
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
                                tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                                formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value)}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                            <Line
                                type="monotone"
                                dataKey="receita"
                                stroke="#fff"
                                strokeWidth={2}
                                dot={false}
                                name="Receita"
                            />
                            <Line
                                type="monotone"
                                dataKey="despesa"
                                stroke="#ef4444"
                                strokeWidth={2}
                                dot={false}
                                name="Despesa"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
