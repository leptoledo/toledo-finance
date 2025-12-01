'use client'

import { useActionState } from 'react'
import { updateProfile } from './actions'

const initialState = {
    message: '',
    error: '',
}

export function SettingsForm({ profile }: { profile: any }) {
    // @ts-ignore
    const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        const result = await updateProfile(formData)
        if (result?.error) {
            return { error: result.error, message: '' }
        }
        return { message: result.success, error: '' }
    }, initialState)

    return (
        <form action={formAction}>
            <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="currency" className="block text-sm font-medium text-foreground">
                        Moeda Principal
                    </label>
                    <select
                        id="currency"
                        name="currency"
                        defaultValue={profile?.currency || 'BRL'}
                        className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
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

            {state?.message && (
                <div className="mt-4 text-sm text-green-600">
                    {state.message}
                </div>
            )}

            {state?.error && (
                <div className="mt-4 text-sm text-destructive">
                    {state.error}
                </div>
            )}

            <div className="mt-6 flex justify-end">
                <button
                    type="submit"
                    disabled={isPending}
                    className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                >
                    {isPending ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            </div>
        </form>
    )
}
