import { PiggyBank, Plus } from 'lucide-react'
import { getBudgets, getBudgetSummary } from '@/lib/budgets'
import { createClient } from '@/utils/supabase/server'
import { BudgetsView } from '@/components/budgets/budgets-view'

export default async function BudgetsPage() {
    const budgets = await getBudgets()
    const summary = await getBudgetSummary()

    // Get expense categories for the add budget dialog
    const supabase = await createClient()
    const { data: categories } = await supabase
        .from('categories')
        .select('id, name, icon')
        .eq('type', 'expense')
        .order('name')

    return (
        <BudgetsView
            budgets={budgets}
            summary={summary}
            categories={categories || []}
        />
    )
}
