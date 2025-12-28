import { createClient } from '@/utils/supabase/server'
import { getRecurringTransactions, RecurringTransaction } from '../recurring-actions'
import { RecurringTable } from '@/components/recurring/recurring-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProcessRecurrenceButton } from '@/components/recurring/process-recurrence-button'
import { Repeat } from 'lucide-react'

export default async function RecurringPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Fetch currency
    const { data: profile } = await supabase
        .from('profiles')
        .select('currency')
        .eq('id', user.id)
        .single()

    const currency = profile?.currency || 'BRL'

    // Fetch recurring transactions
    const result = await getRecurringTransactions()
    const transactions = (result.data || []) as RecurringTransaction[]


    // Calculate monthly estimate (rough)
    const activeTransactions = transactions.filter((t: RecurringTransaction) => t.is_active)
    const monthlyIncome = activeTransactions
        .filter((t: RecurringTransaction) => t.type === 'income')
        .reduce((acc: number, t: RecurringTransaction) => {
            if (t.frequency === 'monthly') return acc + t.amount
            if (t.frequency === 'weekly') return acc + (t.amount * 4)
            if (t.frequency === 'yearly') return acc + (t.amount / 12)
            if (t.frequency === 'daily') return acc + (t.amount * 30)
            return acc
        }, 0)

    const monthlyExpenses = activeTransactions
        .filter((t: RecurringTransaction) => t.type === 'expense')
        .reduce((acc: number, t: RecurringTransaction) => {
            if (t.frequency === 'monthly') return acc + t.amount
            if (t.frequency === 'weekly') return acc + (t.amount * 4)
            if (t.frequency === 'yearly') return acc + (t.amount / 12)
            if (t.frequency === 'daily') return acc + (t.amount * 30)
            return acc
        }, 0)

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Recorrências</h2>
                <div className="flex items-center space-x-2">
                    <ProcessRecurrenceButton />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Receita Mensal Recorrente
                        </CardTitle>
                        <Repeat className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-500">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(monthlyIncome)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Estimativa baseada nos itens ativos
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Despesa Mensal Recorrente
                        </CardTitle>
                        <Repeat className="h-4 w-4 text-rose-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-rose-500">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(monthlyExpenses)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Estimativa baseada nos itens ativos
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Gerenciar Itens Recorrentes</CardTitle>
                    <CardDescription>
                        Visualize e gerencie suas receitas e despesas que se repetem automaticamente.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RecurringTable transactions={transactions || []} currency={currency} />
                </CardContent>
            </Card>
        </div>
    )
}
