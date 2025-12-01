import { getInvestments, getInvestmentsSummary } from '@/lib/investments'
import { InvestmentsView } from '@/components/investments/investments-view'

export default async function InvestmentsPage() {
    const investments = await getInvestments()
    const summary = await getInvestmentsSummary()

    return <InvestmentsView investments={investments} summary={summary} />
}
