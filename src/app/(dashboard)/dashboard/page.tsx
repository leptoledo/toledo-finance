import { getDashboardData } from '../dashboard-actions'
import { KPICards } from '@/components/dashboard/kpi-cards'
import { CashFlowChart } from '@/components/dashboard/cash-flow-chart'
import { InsightsSection } from '@/components/dashboard/insights-section'
import { GoalsSection } from '@/components/dashboard/goals-section'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
    const data = await getDashboardData()

    if (!data) {
        redirect('/login')
    }

    const { currency, financials, goals, chartData } = data

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

            <GoalsSection goals={goals.active} currency={currency} />
        </div>
    )
}
