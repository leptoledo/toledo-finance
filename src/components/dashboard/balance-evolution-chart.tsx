'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface BalanceEvolutionChartProps {
    data: {
        date: string
        saldo: number
    }[]
    currency: string
}

export function BalanceEvolutionChart({ data, currency }: BalanceEvolutionChartProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: currency,
        }).format(value)
    }

    const currentBalance = data[data.length - 1]?.saldo || 0
    const previousBalance = data[0]?.saldo || 0
    const trend = currentBalance >= previousBalance

    return (
        <Card className="col-span-4 lg:col-span-2">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Evolução do Saldo</CardTitle>
                    <div className={`flex items-center gap-1 text-sm font-medium ${trend ? 'text-emerald-500' : 'text-red-500'}`}>
                        {trend ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        {trend ? 'Crescendo' : 'Decrescendo'}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                            <XAxis
                                dataKey="date"
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
                                tickFormatter={(value) => new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency,
                                    notation: 'compact',
                                    maximumFractionDigits: 0,
                                }).format(value)}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                                formatter={(value: number) => formatCurrency(value)}
                                labelFormatter={(label) => `Data: ${label}`}
                            />
                            <Area
                                type="monotone"
                                dataKey="saldo"
                                stroke="#6366f1"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorSaldo)"
                                name="Saldo"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
