import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { MoreHorizontal, TrendingUp, PiggyBank, Wallet, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Goal {
    id: string
    name: string
    type: string
    current_amount: number
    target_amount: number
    progress_percent: number
    deadline: string
}

interface GoalsSectionProps {
    goals: Goal[]
    currency: string
}

export function GoalsSection({ goals, currency }: GoalsSectionProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: currency,
        }).format(value)
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'investment': return <TrendingUp className="h-4 w-4 text-green-500" />
            case 'savings': return <PiggyBank className="h-4 w-4 text-blue-500" />
            case 'debt_payment': return <Wallet className="h-4 w-4 text-red-500" />
            default: return <Target className="h-4 w-4 text-primary" />
        }
    }

    const getLabel = (type: string) => {
        switch (type) {
            case 'investment': return 'Investimento'
            case 'savings': return 'Economia'
            case 'debt_payment': return 'Quitação de Dívida'
            default: return 'Meta'
        }
    }

    const getProgressColor = (type: string) => {
        switch (type) {
            case 'investment': return '[&>div]:bg-green-500'
            case 'savings': return '[&>div]:bg-blue-500'
            case 'debt_payment': return '[&>div]:bg-red-600'
            default: return '[&>div]:bg-primary'
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Suas Metas Ativas ({goals.length})</h3>
                <Button variant="outline" size="sm" asChild>
                    <Link href="/goals">Ver Todas</Link>
                </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
                {goals.map((goal) => (
                    <Card key={goal.id}>
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                            <div className="flex items-center gap-2">
                                {getIcon(goal.type)}
                                <span className="font-semibold">{goal.name}</span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs text-muted-foreground mb-4">
                                {getLabel(goal.type)} | Limite: {new Date(goal.deadline).toLocaleDateString('pt-BR')}
                            </div>
                            <div className="flex justify-between text-sm font-medium mb-2">
                                <span>Atual: {formatCurrency(goal.current_amount)}</span>
                                <span>Alvo: {formatCurrency(goal.target_amount)}</span>
                            </div>
                            <Progress value={goal.progress_percent} className={`h-2 ${getProgressColor(goal.type)}`} />
                            <p className="text-xs text-muted-foreground mt-2">
                                Faltam {formatCurrency(goal.target_amount - goal.current_amount)} para completar.
                            </p>
                        </CardContent>
                    </Card>
                ))}
                {goals.length === 0 && (
                    <div className="col-span-3 text-center py-8 text-muted-foreground">
                        Nenhuma meta ativa no momento.
                    </div>
                )}
            </div>
        </div>
    )
}
