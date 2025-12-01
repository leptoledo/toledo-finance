import { getAccounts, getAccountsSummary } from '@/lib/accounts'
import { AccountsView } from '@/components/accounts/accounts-view'

export default async function AccountsPage() {
    const accounts = await getAccounts()
    const summary = await getAccountsSummary()

    return <AccountsView accounts={accounts} summary={summary} />
}
