import { getExpenseTransactions, getExpenseSummary, getExpenseOptions } from './actions'
import { ExpenseView } from '@/components/expenses/expense-view'
import { createClient } from '@/utils/supabase/server'

export default async function ExpensesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return null
    }

    // Fetch user profile for currency preference
    const { data: profile } = await supabase
        .from('profiles')
        .select('currency')
        .eq('id', user.id)
        .single()

    const currency = profile?.currency || 'BRL'

    const [transactionsData, summaryData, optionsData] = await Promise.all([
        getExpenseTransactions(),
        getExpenseSummary(),
        getExpenseOptions()
    ])

    return (
        <ExpenseView
            initialTransactions={transactionsData.data}
            summary={summaryData}
            options={optionsData}
            currency={currency}
        />
    )
}
