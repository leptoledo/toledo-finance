'use client'

import { useState } from 'react'
import { Menu, X, Sparkles } from 'lucide-react'
import { Sidebar } from './sidebar'

interface MobileHeaderProps {
    userProfile: any
    userEmail?: string
}

export function MobileHeader({ userProfile, userEmail }: MobileHeaderProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <>
            {/* Mobile header */}
            <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-white/10 glass px-4 shadow-lg md:hidden">
                <button
                    type="button"
                    className="-m-2.5 p-2.5 text-foreground hover:bg-white/10 rounded-lg transition-all"
                    onClick={() => setIsSidebarOpen(true)}
                >
                    <span className="sr-only">Abrir menu</span>
                    <Menu className="h-6 w-6" aria-hidden="true" />
                </button>
                <div className="flex items-center gap-2 flex-1">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/50">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg font-bold gradient-text">FinanceX</span>
                </div>
            </div>

            {/* Mobile sidebar overlay */}
            {isSidebarOpen && (
                <div className="relative z-50 md:hidden">
                    {/* Backdrop with blur */}
                    <div
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
                        onClick={() => setIsSidebarOpen(false)}
                    />

                    {/* Sidebar */}
                    <div className="fixed inset-y-0 left-0 w-72 overflow-y-auto animate-slide-in">
                        <Sidebar userProfile={userProfile} userEmail={userEmail} />
                    </div>
                </div>
            )}
        </>
    )
}
