import { getExpenseTransactions, getExpenseSummary, getExpenseOptions } from './actions'
import { ExpenseView } from '@/components/expenses/expense-view'
import { createClient } from '@/utils/supabase/server'

export default async function ExpensesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return null
    }

    const resolvedSearchParams = await searchParams
    const page = Number(resolvedSearchParams.page) || 1
    const search = (resolvedSearchParams.search as string) || ''
    const categoryId = (resolvedSearchParams.categoryId as string) || undefined
    const startDate = (resolvedSearchParams.startDate as string) || undefined
    const endDate = (resolvedSearchParams.endDate as string) || undefined
    const minAmount = resolvedSearchParams.minAmount ? Number(resolvedSearchParams.minAmount) : undefined
    const maxAmount = resolvedSearchParams.maxAmount ? Number(resolvedSearchParams.maxAmount) : undefined

    // Fetch user profile for currency preference
    const { data: profile } = await supabase
        .from('profiles')
        .select('currency')
        .eq('id', user.id)
        .single()

    const currency = profile?.currency || 'BRL'

    const [transactionsData, summaryData, optionsData] = await Promise.all([
        getExpenseTransactions(page, 10, {
            search,
            categoryId,
            startDate,
            endDate,
            minAmount,
            maxAmount
        }),
        getExpenseSummary(),
        getExpenseOptions()
    ])

    return (
        <ExpenseView
            initialTransactions={transactionsData.data}
            totalCount={transactionsData.count || 0}
            totalAmount={transactionsData.totalAmount || 0}
            currentPage={page}
            summary={summaryData}
            options={optionsData}
            currency={currency}
        />
    )
}
