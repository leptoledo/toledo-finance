import { createClient } from '@/utils/supabase/server'
import { getIncomeTransactions, getIncomeSummary, getIncomeOptions } from './actions'
import { IncomeView } from '@/components/income/income-view'

export default async function IncomePage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const resolvedSearchParams = await searchParams
    const page = Number(resolvedSearchParams.page) || 1
    const search = (resolvedSearchParams.search as string) || ''
    const categoryId = (resolvedSearchParams.categoryId as string) || undefined
    const startDate = (resolvedSearchParams.startDate as string) || undefined
    const endDate = (resolvedSearchParams.endDate as string) || undefined
    const minAmount = resolvedSearchParams.minAmount ? Number(resolvedSearchParams.minAmount) : undefined
    const maxAmount = resolvedSearchParams.maxAmount ? Number(resolvedSearchParams.maxAmount) : undefined

    // Fetch currency
    const { data: profile } = await supabase
        .from('profiles')
        .select('currency')
        .eq('id', user.id)
        .single()

    const currency = profile?.currency || 'BRL'

    // Fetch data in parallel
    const [transactionsData, summaryData, optionsData] = await Promise.all([
        getIncomeTransactions(page, 10, {
            search,
            categoryId,
            startDate,
            endDate,
            minAmount,
            maxAmount
        }),
        getIncomeSummary(),
        getIncomeOptions()
    ])

    return (
        <IncomeView
            summary={summaryData}
            transactions={transactionsData.data || []}
            totalCount={transactionsData.count || 0}
            totalAmount={transactionsData.totalAmount || 0}
            currentPage={page}
            options={optionsData}
            currency={currency}
        />
    )
}
