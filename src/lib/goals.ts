import { createClient } from '@/utils/supabase/server'

export interface Goal {
    id: string
    user_id: string
    name: string
    description: string | null
    type: 'savings' | 'investment' | 'debt_payment'
    target_amount: number
    current_amount: number
    progress_percent: number
    deadline: string | null
    created_at: string
}

export async function getGoals() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return []
    }

    const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching goals:', error)
        return []
    }

    return data as Goal[]
}

export async function getGoalsSummary() {
    const goals = await getGoals()

    const totalTarget = goals.reduce((sum, g) => sum + Number(g.target_amount), 0)
    const totalCurrent = goals.reduce((sum, g) => sum + Number(g.current_amount), 0)
    const completedGoals = goals.filter(g => Number(g.progress_percent) >= 100).length
    const activeGoals = goals.filter(g => Number(g.progress_percent) < 100).length

    return {
        totalTarget,
        totalCurrent,
        totalGoals: goals.length,
        completedGoals,
        activeGoals,
        overallProgress: totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0
    }
}
