import { getDashboardData } from '../dashboard-actions'
import { KPICards } from '@/components/dashboard/kpi-cards'
import { CashFlowChart } from '@/components/dashboard/cash-flow-chart'
import { ExpensesByCategoryChart } from '@/components/dashboard/expenses-by-category-chart'
import { MonthlyComparisonChart } from '@/components/dashboard/monthly-comparison-chart'
import { BalanceEvolutionChart } from '@/components/dashboard/balance-evolution-chart'
import { InsightsSection } from '@/components/dashboard/insights-section'
import { GoalsSection } from '@/components/dashboard/goals-section'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
    const data = await getDashboardData()

    if (!data) {
        redirect('/login')
    }

    const {
        currency,
        financials,
        goals,
        chartData,
        expensesByCategoryData,
        monthlyComparisonData,
        balanceEvolutionData
    } = data

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-4xl font-bold gradient-text mb-2">Dashboard Financeiro</h2>
                    <p className="text-muted-foreground">Visão geral das suas finanças</p>
                </div>
            </div>

            <KPICards
                currency={currency}
                financials={financials}
                goalsCount={goals.totalCount}
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                <CashFlowChart data={chartData} currency={currency} />
                <InsightsSection />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                <ExpensesByCategoryChart data={expensesByCategoryData} currency={currency} />
                <BalanceEvolutionChart data={balanceEvolutionData} currency={currency} />
            </div>

            <MonthlyComparisonChart data={monthlyComparisonData} currency={currency} />

            <GoalsSection goals={goals.active} currency={currency} />
        </div>
    )
}
