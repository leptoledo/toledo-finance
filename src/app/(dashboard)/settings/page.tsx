import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { SettingsForm } from './settings-form'
import { Settings } from 'lucide-react'

export default async function SettingsPage() {
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
        <div className="space-y-8 animate-fade-in">
            <div>
                <h3 className="text-3xl sm:text-4xl font-bold mb-2">
                    <span className="bg-gradient-to-r from-gray-300 to-gray-400 bg-clip-text text-transparent">
                        Configurações
                    </span>
                </h3>
                <p className="text-muted-foreground">
                    Gerencie suas preferências e configurações de conta.
                </p>
            </div>

            <div className="relative overflow-hidden rounded-2xl glass border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 via-slate-500/5 to-transparent" />
                <div className="relative p-6 sm:p-8">
                    <div className="md:grid md:grid-cols-3 md:gap-8">
                        <div className="md:col-span-1">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-gray-500 to-slate-600 shadow-lg shadow-gray-500/50">
                                    <Settings className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Preferências Gerais</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Personalize como você visualiza seus dados.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 md:col-span-2 md:mt-0">
                            <SettingsForm profile={profile} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
