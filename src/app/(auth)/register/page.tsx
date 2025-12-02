'use client'

import { useActionState } from 'react'
import { signup } from '../actions'
import Link from 'next/link'

const initialState = {
    error: '',
}

export default function RegisterPage() {
    // @ts-ignore
    const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        const result = await signup(formData)
        if (result?.error) {
            return { error: result.error }
        }
        return { error: '' }
    }, initialState)

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-lg font-medium leading-6 text-foreground">Crie sua conta</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Já tem uma conta? <Link href="/login" className="font-medium text-primary hover:text-primary/90">Entrar</Link>
                </p>
            </div>

            <form action={formAction} className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-foreground">
                            Nome
                        </label>
                        <div className="mt-1">
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                autoComplete="given-name"
                                required
                                className="block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-foreground">
                            Sobrenome
                        </label>
                        <div className="mt-1">
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                autoComplete="family-name"
                                className="block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

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
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                        Telefone
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <div className="relative flex items-stretch focus-within:z-10">
                            <select
                                id="countryCode"
                                name="countryCode"
                                className="block w-[110px] rounded-l-md border border-r-0 border-input bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                                defaultValue="+55"
                                onChange={(e) => {
                                    const phoneInput = document.getElementById('phoneNumber') as HTMLInputElement
                                    if (phoneInput) {
                                        switch (e.target.value) {
                                            case '+55': phoneInput.placeholder = '(11) 99999-9999'; break;
                                            case '+1': phoneInput.placeholder = '(555) 123-4567'; break;
                                            case '+351': phoneInput.placeholder = '912 345 678'; break;
                                            case '+44': phoneInput.placeholder = '07700 900077'; break;
                                            default: phoneInput.placeholder = '99999-9999';
                                        }
                                    }
                                }}
                            >
                                <option value="+55">🇧🇷 +55</option>
                                <option value="+1">🇺🇸 +1</option>
                                <option value="+351">🇵🇹 +351</option>
                                <option value="+44">🇬🇧 +44</option>
                                <option value="+34">🇪🇸 +34</option>
                                <option value="+33">🇫🇷 +33</option>
                                <option value="+49">🇩🇪 +49</option>
                                <option value="+39">🇮🇹 +39</option>
                                <option value="+54">🇦🇷 +54</option>
                            </select>
                        </div>
                        <input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            autoComplete="tel"
                            className="block w-full rounded-r-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                            placeholder="(11) 99999-9999"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-foreground">
                        Moeda Principal
                    </label>
                    <div className="mt-1">
                        <select
                            id="currency"
                            name="currency"
                            defaultValue="BRL"
                            className="block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                        >
                            <option value="BRL">Real Brasileiro (BRL)</option>
                            <option value="USD">Dólar Americano (USD)</option>
                            <option value="EUR">Euro (EUR)</option>
                            <option value="GBP">Libra Esterlina (GBP)</option>
                        </select>
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
                            autoComplete="new-password"
                            required
                            minLength={6}
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
                        {isPending ? 'Criando conta...' : 'Criar conta'}
                    </button>
                </div>
            </form>
        </div>
    )
}
