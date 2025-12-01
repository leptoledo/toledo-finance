'use client'

import { useActionState } from 'react'
import { login } from '../actions'
import Link from 'next/link'

const initialState = {
    error: '',
}

export default function LoginPage() {
    // @ts-ignore - useActionState types might be tricky with server actions returning different shapes
    const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        const result = await login(formData)
        if (result?.error) {
            return { error: result.error }
        }
        return { error: '' }
    }, initialState)

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-lg font-medium leading-6 text-foreground">Acesse sua conta</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Ou <Link href="/register" className="font-medium text-primary hover:text-primary/90">crie sua conta agora</Link>
                </p>
            </div>

            <form action={formAction} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground">
                        Endereço de email
                    </label>
                    <div className="mt-1">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-foreground">
                        Senha
                    </label>
                    <div className="mt-1">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                        />
                    </div>
                </div>

                {state?.error && (
                    <div className="text-sm text-destructive">
                        {state.error}
                    </div>
                )}

                <div>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? 'Entrando...' : 'Entrar'}
                    </button>
                </div>
            </form>
        </div>
    )
}
