'use client'

import { useActionState, useState, useEffect } from 'react'
import { updateProfile } from './actions'
import { AvatarUpload } from './avatar-upload'
import { useTheme } from 'next-themes'
import { Moon, Sun, Laptop } from 'lucide-react'

const initialState = {
    message: '',
    error: '',
}

export function SettingsForm({ profile }: { profile: any }) {
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    // Evitar erro de hidratação
    useEffect(() => {
        setMounted(true)
    }, [])

    // Atualizar estado local quando o perfil mudar (ex: após salvar)
    useEffect(() => {
        if (profile?.avatar_url) {
            setAvatarUrl(profile.avatar_url)
        }
    }, [profile])


    // @ts-ignore
    const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        const result = await updateProfile(formData)
        if (result?.error) {
            return { error: result.error, message: '' }
        }
        return { message: result.success, error: '' }
    }, initialState)

    // Fallback para full_name se first_name/last_name não existirem
    const fullNameParts = profile?.full_name ? profile.full_name.split(' ') : []
    const defaultFirstName = profile?.first_name || fullNameParts[0] || ''
    const defaultLastName = profile?.last_name || fullNameParts.slice(1).join(' ') || ''

    return (
        <form action={formAction} className="space-y-8" key={profile?.updated_at}>
            {/* Seção de Perfil */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">Perfil</h3>
                <div className="flex flex-col gap-6">
                    <AvatarUpload
                        uid={profile?.id}
                        url={avatarUrl}
                        onUpload={(url) => setAvatarUrl(url)}
                    />
                    <input type="hidden" name="avatar_url" value={avatarUrl} />

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label htmlFor="first_name" className="block text-sm font-medium text-foreground mb-1">
                                Nome
                            </label>
                            <input
                                type="text"
                                name="first_name"
                                id="first_name"
                                defaultValue={defaultFirstName}
                                className="block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                                placeholder="Seu primeiro nome"
                            />
                        </div>

                        <div>
                            <label htmlFor="last_name" className="block text-sm font-medium text-foreground mb-1">
                                Sobrenome
                            </label>
                            <input
                                type="text"
                                name="last_name"
                                id="last_name"
                                defaultValue={defaultLastName}
                                className="block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                                placeholder="Seu sobrenome"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-border" />

            {/* Seção de Preferências */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">Preferências</h3>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="currency" className="block text-sm font-medium text-foreground mb-1">
                            Moeda Principal
                        </label>
                        <select
                            id="currency"
                            name="currency"
                            defaultValue={profile?.currency || 'BRL'}
                            className="block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                        >
                            <option value="BRL">Real Brasileiro (BRL)</option>
                            <option value="USD">Dólar Americano (USD)</option>
                            <option value="EUR">Euro (EUR)</option>
                            <option value="GBP">Libra Esterlina (GBP)</option>
                        </select>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Esta será a moeda padrão para exibição de valores.
                        </p>
                    </div>
                </div>
            </div>

            <div className="border-t border-border" />

            {/* Seção de Aparência */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">Aparência</h3>
                <p className="text-sm text-muted-foreground">
                    Escolha como o LCTNET deve aparecer para você.
                </p>
                {!mounted ? (
                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-lg border-2 border-border flex flex-col items-center gap-2 w-24 animate-pulse">
                            <div className="h-6 w-6 bg-muted rounded" />
                            <div className="h-4 w-12 bg-muted rounded" />
                        </div>
                        <div className="p-4 rounded-lg border-2 border-border flex flex-col items-center gap-2 w-24 animate-pulse">
                            <div className="h-6 w-6 bg-muted rounded" />
                            <div className="h-4 w-12 bg-muted rounded" />
                        </div>
                        <div className="p-4 rounded-lg border-2 border-border flex flex-col items-center gap-2 w-24 animate-pulse">
                            <div className="h-6 w-6 bg-muted rounded" />
                            <div className="h-4 w-12 bg-muted rounded" />
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => setTheme('light')}
                            className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all w-24 ${theme === 'light'
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border hover:border-primary/50 text-muted-foreground'
                                }`}
                        >
                            <Sun className="h-6 w-6" />
                            <span className="text-sm font-medium">Claro</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setTheme('dark')}
                            className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all w-24 ${theme === 'dark'
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border hover:border-primary/50 text-muted-foreground'
                                }`}
                        >
                            <Moon className="h-6 w-6" />
                            <span className="text-sm font-medium">Escuro</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setTheme('system')}
                            className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all w-24 ${theme === 'system'
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border hover:border-primary/50 text-muted-foreground'
                                }`}
                        >
                            <Laptop className="h-6 w-6" />
                            <span className="text-sm font-medium">Sistema</span>
                        </button>
                    </div>
                )}
            </div>

            {state?.message && (
                <div className="p-4 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-sm">
                    {state.message}
                </div>
            )}

            {state?.error && (
                <div className="p-4 rounded-md bg-red-500/10 text-red-500 border border-red-500/20 text-sm">
                    {state.error}
                </div>
            )}

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 transition-colors"
                >
                    {isPending ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            </div>
        </form>
    )
}
