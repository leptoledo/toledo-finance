import { createClient } from '@/utils/supabase/server'
import { getIncomeTransactions, getIncomeSummary, getIncomeOptions } from './actions'
import { IncomeView } from '@/components/income/income-view'

export default async function IncomePage() {
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

    // Fetch data in parallel
    const [transactionsData, summaryData, optionsData] = await Promise.all([
        getIncomeTransactions(),
        getIncomeSummary(),
        getIncomeOptions()
    ])

    return (
        <IncomeView
            summary={summaryData}
            transactions={transactionsData.data || []}
            options={optionsData}
            currency={currency}
        />
    )
}
