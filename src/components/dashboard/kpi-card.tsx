import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface KPICardProps {
    title: string
    value: string
    change?: string
    changeType?: 'positive' | 'negative' | 'neutral'
    icon: LucideIcon
    className?: string
}

export function KPICard({ title, value, change, changeType, icon: Icon, className }: KPICardProps) {
    return (
        <div className={cn("rounded-xl border border-border bg-card p-6 shadow-sm", className)}>
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <Icon className="h-4 w-4" />
                </div>
            </div>
            <div className="mt-4">
                <div className="text-2xl font-bold text-foreground">{value}</div>
                {change && (
                    <p className={cn(
                        "mt-1 text-xs font-medium",
                        changeType === 'positive' ? "text-primary" :
                            changeType === 'negative' ? "text-destructive" : "text-muted-foreground"
                    )}>
                        {change}
                    </p>
                )}
            </div>
        </div>
    )
}
