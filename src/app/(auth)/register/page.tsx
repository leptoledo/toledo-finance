'use client'

import { useActionState } from 'react'
import { signup } from '../actions'
import Link from 'next/link'
import { ArrowRight, Mail, Lock, User, Phone, Globe } from 'lucide-react'

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
            <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                    Crie sua conta
                </h1>
                <p className="text-sm text-muted-foreground">
                    Preencha os dados abaixo para começar
                </p>
            </div>

            <form action={formAction} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label htmlFor="firstName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Nome
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-2.5 text-muted-foreground">
                                <User className="h-4 w-4" />
                            </div>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                placeholder="João"
                                autoComplete="given-name"
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="lastName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Sobrenome
                        </label>
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            placeholder="Silva"
                            autoComplete="family-name"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Email
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-2.5 text-muted-foreground">
                            <Mail className="h-4 w-4" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="seu@email.com"
                            autoComplete="email"
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Telefone
                    </label>
                    <div className="flex rounded-md shadow-sm">
                        <div className="relative flex items-stretch focus-within:z-10">
                            <select
                                id="countryCode"
                                name="countryCode"
                                className="flex h-10 w-[110px] rounded-l-md border border-r-0 border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                        <div className="relative w-full">
                            <div className="absolute left-3 top-2.5 text-muted-foreground">
                                <Phone className="h-4 w-4" />
                            </div>
                            <input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                autoComplete="tel"
                                className="flex h-10 w-full rounded-r-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="(11) 99999-9999"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="currency" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Moeda Principal
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-2.5 text-muted-foreground">
                            <Globe className="h-4 w-4" />
                        </div>
                        <select
                            id="currency"
                            name="currency"
                            defaultValue="BRL"
                            className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="BRL">Real Brasileiro (BRL)</option>
                            <option value="USD">Dólar Americano (USD)</option>
                            <option value="EUR">Euro (EUR)</option>
                            <option value="GBP">Libra Esterlina (GBP)</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Senha
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-2.5 text-muted-foreground">
                            <Lock className="h-4 w-4" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Mínimo 6 caracteres"
                            autoComplete="new-password"
                            required
                            minLength={6}
                            className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                </div>

                {state?.error && (
                    <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-destructive shrink-0" />
                        {state.error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-10 group"
                >
                    {isPending ? (
                        <span className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Criando conta...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            Criar conta
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                    )}
                </button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Já tem uma conta?
                    </span>
                </div>
            </div>

            <div className="text-center">
                <Link
                    href="/login"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 w-full"
                >
                    Fazer login
                </Link>
            </div>
        </div>
    )
}
