'use client'

import { memo, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { signOut } from '@/app/(auth)/actions'
import {
    LayoutDashboard,
    TrendingUp,
    TrendingDown,
    Tags,
    PiggyBank,
    Wallet,
    LineChart,
    Target,
    BarChart3,
    Upload,
    Settings,
    Sparkles,
    MessageSquare,
    Shield,
    LogOut,
    Landmark
} from 'lucide-react'

const navigation = [
    { name: 'Painel', href: '/dashboard', icon: LayoutDashboard, color: 'text-blue-400' },
    { name: 'Receitas', href: '/income', icon: TrendingUp, color: 'text-green-400' },
    { name: 'Despesas', href: '/expenses', icon: TrendingDown, color: 'text-red-400' },
    { name: 'Planejamento', href: '/budgets', icon: PiggyBank, color: 'text-pink-400' },
    { name: 'Investimentos', href: '/investments', icon: LineChart, color: 'text-cyan-400' },
    { name: 'Análise', href: '/analysis', icon: BarChart3, color: 'text-indigo-400' },
    { name: 'Metas', href: '/goals', icon: Target, color: 'text-orange-400' },
    { name: 'Categorias', href: '/categories', icon: Tags, color: 'text-purple-400' },
    { name: 'Contas', href: '/accounts', icon: Wallet, color: 'text-yellow-400' },
    { name: 'Importar', href: '/import', icon: Upload, color: 'text-teal-400' },
    { name: 'Conectar Banco', href: '/connect-bank', icon: Landmark, color: 'text-blue-500' },
]

interface SidebarProps {
    userProfile: any
    userEmail?: string
    onNavigate?: () => void
}

function SidebarComponent({ userProfile, userEmail, onNavigate }: SidebarProps) {
    const pathname = usePathname()

    // Memoiza o nome do usuário para evitar recalcular em cada render
    const userName = useMemo(() => {
        if (userProfile?.full_name) {
            return userProfile.full_name
        }
        if (userEmail) {
            // Pega a parte antes do @ e formata
            const emailName = userEmail.split('@')[0]
            // Capitaliza primeira letra e substitui pontos/underscores por espaços
            return emailName
                .split(/[._-]/)
                .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
                .join(' ')
        }
        return 'Usuário'
    }, [userProfile?.full_name, userEmail])

    return (
        <div className="flex h-full w-72 flex-col glass border-r border-white/10 animate-slide-in">
            {/* Header com gradiente */}
            <div className="relative px-6 py-8 border-b border-white/10 overflow-hidden">
                {/* Background decorativo */}
                <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10" />

                <div className="relative space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/50">
                            <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold gradient-text">LCTNET</h1>
                            <p className="text-xs text-muted-foreground">Suas finanças sob controle</p>
                        </div>
                    </div>

                    {/* User info */}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                        <div className="h-10 w-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">Olá, {userName}!</p>
                            <p className="text-xs text-muted-foreground truncate">Bem-vindo de volta</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-1 flex-col overflow-y-auto py-6">
                <nav className="flex-1 space-y-1 px-4">
                    {navigation.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={onNavigate}
                                className={cn(
                                    'group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative overflow-hidden',
                                    isActive
                                        ? 'bg-linear-to-r from-indigo-500/20 to-purple-500/20 text-white shadow-lg shadow-indigo-500/20 border border-indigo-500/30'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                )}
                            >
                                {/* Active indicator */}
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-linear-to-b from-indigo-500 to-purple-600 rounded-r-full" />
                                )}

                                {/* Icon with color */}
                                <div className={cn(
                                    'shrink-0 transition-transform duration-200',
                                    isActive ? 'scale-110' : 'group-hover:scale-110'
                                )}>
                                    <Icon
                                        className={cn(
                                            'h-5 w-5',
                                            isActive ? item.color : 'text-gray-400 group-hover:text-white'
                                        )}
                                        aria-hidden="true"
                                    />
                                </div>

                                {/* Label */}
                                <span className={cn(
                                    'transition-all duration-200',
                                    isActive ? 'font-semibold' : ''
                                )}>
                                    {item.name}
                                </span>

                                {/* Hover glow effect */}
                                {!isActive && (
                                    <div className="absolute inset-0 bg-linear-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 rounded-xl transition-all duration-300" />
                                )}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* Settings at bottom */}
            <div className="flex flex-col shrink-0 border-t border-white/10 p-4 space-y-1">
                <Link
                    href="/feedback"
                    onClick={onNavigate}
                    className={cn(
                        'group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative overflow-hidden',
                        pathname === '/feedback'
                            ? 'bg-linear-to-r from-blue-500/20 to-cyan-500/20 text-white shadow-lg shadow-blue-500/20 border border-blue-500/30'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                    )}
                >
                    {pathname === '/feedback' && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-linear-to-b from-blue-500 to-cyan-600 rounded-r-full" />
                    )}

                    <div className={cn(
                        'shrink-0 transition-transform duration-200',
                        pathname === '/feedback' ? 'scale-110' : 'group-hover:scale-110'
                    )}>
                        <MessageSquare
                            className={cn(
                                'h-5 w-5',
                                pathname === '/feedback' ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'
                            )}
                            aria-hidden="true"
                        />
                    </div>

                    <span className={cn(
                        'transition-all duration-200',
                        pathname === '/feedback' ? 'font-semibold' : ''
                    )}>
                        Feedback
                    </span>

                    {pathname !== '/feedback' && (
                        <div className="absolute inset-0 bg-linear-to-r from-blue-500/0 via-cyan-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-cyan-500/5 group-hover:to-blue-500/5 rounded-xl transition-all duration-300" />
                    )}
                </Link>

                <Link
                    href="/settings"
                    onClick={onNavigate}
                    className={cn(
                        'group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative overflow-hidden',
                        pathname === '/settings'
                            ? 'bg-linear-to-r from-indigo-500/20 to-purple-500/20 text-white shadow-lg shadow-indigo-500/20 border border-indigo-500/30'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                    )}
                >
                    {pathname === '/settings' && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-linear-to-b from-indigo-500 to-purple-600 rounded-r-full" />
                    )}

                    <div className={cn(
                        'shrink-0 transition-transform duration-200',
                        pathname === '/settings' ? 'scale-110' : 'group-hover:scale-110'
                    )}>
                        <Settings
                            className={cn(
                                'h-5 w-5',
                                pathname === '/settings' ? 'text-gray-300' : 'text-gray-400 group-hover:text-white'
                            )}
                            aria-hidden="true"
                        />
                    </div>

                    <span className={cn(
                        'transition-all duration-200',
                        pathname === '/settings' ? 'font-semibold' : ''
                    )}>
                        Configurações
                    </span>

                    {pathname !== '/settings' && (
                        <div className="absolute inset-0 bg-linear-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 rounded-xl transition-all duration-300" />
                    )}
                </Link>

                {/* Admin Link - Only for admins */}
                {['leptoledo@hotmail.com', 'admin@financex.com'].includes(userEmail || '') && (
                    <Link
                        href="/admin/feedback"
                        onClick={onNavigate}
                        className={cn(
                            'group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative overflow-hidden',
                            pathname.startsWith('/admin')
                                ? 'bg-linear-to-r from-red-500/20 to-orange-500/20 text-white shadow-lg shadow-red-500/20 border border-red-500/30'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                        )}
                    >
                        {pathname.startsWith('/admin') && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-linear-to-b from-red-500 to-orange-600 rounded-r-full" />
                        )}

                        <div className={cn(
                            'shrink-0 transition-transform duration-200',
                            pathname.startsWith('/admin') ? 'scale-110' : 'group-hover:scale-110'
                        )}>
                            <Shield
                                className={cn(
                                    'h-5 w-5',
                                    pathname.startsWith('/admin') ? 'text-red-400' : 'text-gray-400 group-hover:text-white'
                                )}
                                aria-hidden="true"
                            />
                        </div>

                        <span className={cn(
                            'transition-all duration-200',
                            pathname.startsWith('/admin') ? 'font-semibold' : ''
                        )}>
                            Admin
                        </span>

                        {pathname !== '/admin' && (
                            <div className="absolute inset-0 bg-linear-to-r from-red-500/0 via-orange-500/0 to-red-500/0 group-hover:from-red-500/5 group-hover:via-orange-500/5 group-hover:to-red-500/5 rounded-xl transition-all duration-300" />
                        )}
                    </Link>
                )}

                {/* Logout Button */}
                <button
                    onClick={() => signOut()}
                    className="group flex w-full items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative overflow-hidden text-gray-400 hover:text-white hover:bg-white/5"
                >
                    <div className="shrink-0 transition-transform duration-200 group-hover:scale-110">
                        <LogOut
                            className="h-5 w-5 text-gray-400 group-hover:text-red-400"
                            aria-hidden="true"
                        />
                    </div>

                    <span className="transition-all duration-200">
                        Sair
                    </span>

                    <div className="absolute inset-0 bg-linear-to-r from-red-500/0 via-orange-500/0 to-red-500/0 group-hover:from-red-500/5 group-hover:via-orange-500/5 group-hover:to-red-500/5 rounded-xl transition-all duration-300" />
                </button>
            </div>
        </div>
    )
}

// Exporta o componente memoizado para evitar re-renders desnecessários
export const Sidebar = memo(SidebarComponent)
