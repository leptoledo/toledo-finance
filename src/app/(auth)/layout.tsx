'use client'

import { Sparkles, Quote } from 'lucide-react'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
            {/* Lado Esquerdo - Formulário */}
            <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-background">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="mb-10">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/50">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold gradient-text">LCTNET</span>
                        </div>
                    </div>

                    {children}

                    <div className="mt-10">
                        <p className="text-center text-xs text-muted-foreground">
                            Ao continuar, você concorda com nossos{' '}
                            <a href="#" className="underline hover:text-primary">Termos de Serviço</a>{' '}
                            e{' '}
                            <a href="#" className="underline hover:text-primary">Política de Privacidade</a>.
                        </p>
                    </div>
                </div>
            </div>

            {/* Lado Direito - Destaque (Visível apenas em desktop) */}
            <div className="relative hidden w-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                <div className="absolute inset-0 bg-zinc-900" />

                {/* Background com gradiente sutil e efeitos */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-background to-background" />
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />

                <div className="relative z-20 flex items-center text-lg font-medium">
                    <Sparkles className="mr-2 h-6 w-6" />
                    LCTNET Finance
                </div>

                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <div className="mb-4 rounded-full bg-white/10 p-3 w-fit backdrop-blur-sm">
                            <Quote className="h-6 w-6 text-indigo-400" />
                        </div>
                        <p className="text-lg leading-relaxed text-gray-300">
                            &ldquo;Esta plataforma revolucionou a maneira como gerencio minhas finanças pessoais.
                            A interface é intuitiva, os relatórios são detalhados e o controle de metas me ajudou a economizar 30% a mais este ano.&rdquo;
                        </p>
                        <footer className="text-sm font-medium text-gray-400 mt-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                    LT
                                </div>
                                <div>
                                    <div className="text-white">Leandro Toledo</div>
                                    <div className="text-xs">Desenvolvedor Full Stack</div>
                                </div>
                            </div>
                        </footer>
                    </blockquote>
                </div>
            </div>
        </div>
    )
}
