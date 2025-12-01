import { getGoals, getGoalsSummary } from '@/lib/goals'
import { GoalsView } from '@/components/goals/goals-view'

export default async function GoalsPage() {
    const goals = await getGoals()
    const summary = await getGoalsSummary()

    return <GoalsView goals={goals} summary={summary} />
}
