import { getInvestments, getInvestmentsSummary } from '@/lib/investments'
import { InvestmentsView } from '@/components/investments/investments-view'
import { createClient } from '@/utils/supabase/server'

async function getAccounts() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data } = await supabase
        .from('accounts')
        .select('id, name')
        .eq('user_id', user.id)
        .order('name')

    return data || []
}

export default async function InvestmentsPage() {
    const investments = await getInvestments()
    const summary = await getInvestmentsSummary()
    const accounts = await getAccounts()

    return <InvestmentsView investments={investments} summary={summary} accounts={accounts} />
}
