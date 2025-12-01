import { Sidebar } from '@/components/layout/sidebar'
import { MobileHeader } from '@/components/layout/mobile-header'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ToastProvider } from '@/components/ui/toast'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <ToastProvider>
            <div className="flex h-screen overflow-hidden">
                {/* Desktop sidebar */}
                <div className="hidden md:flex md:flex-shrink-0">
                    <Sidebar userProfile={profile} userEmail={user.email} />
                </div>

                {/* Main content */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    {/* Mobile header */}
                    <MobileHeader userProfile={profile} userEmail={user.email} />

                    <main className="flex-1 overflow-y-auto focus:outline-none">
                        <div className="py-4 md:py-6">
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                                {children}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </ToastProvider>
    )
}
