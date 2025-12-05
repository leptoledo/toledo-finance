import { getBankById } from '@/lib/banks'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Link as LinkIcon, Bot, Smartphone, Globe, Building2, MoreHorizontal, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface ConnectBankConfirmPageProps {
    params: Promise<{
        bankId: string
    }>
}

export default async function ConnectBankConfirmPage({ params }: ConnectBankConfirmPageProps) {
    const { bankId } = await params
    const bank = getBankById(bankId)

    if (!bank) {
        notFound()
    }

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-background animate-fade-in relative">
            {/* Header */}
            <div className="relative pt-8 pb-20 px-4 text-center rounded-b-[2.5rem] overflow-hidden border-b border-border/50">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10" />

                <div className="relative z-10">
                    <div className="flex justify-center mb-6">
                        <div className="bg-background p-3 rounded-full shadow-lg ring-1 ring-border">
                            <LinkIcon className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold mb-2 tracking-tight">
                        <span className="gradient-text">Conectar com</span><br />
                        <span className="text-foreground">{bank.name}</span>
                    </h1>

                    <div className="flex justify-center mt-6 mb-2 relative">
                        {/* Robot and Bank Logo Connection */}
                        <div className="flex items-center justify-center space-x-[-10px]">
                            <div className="relative z-20 bg-linear-to-br from-indigo-600 to-purple-600 text-white p-3 rounded-2xl shadow-xl shadow-indigo-500/20 transform -rotate-6 border-4 border-background">
                                <Bot className="w-8 h-8" />
                            </div>
                            <div className="relative z-10 bg-background p-1 rounded-full shadow-lg border-4 border-background">
                                <Avatar className="h-12 w-12">
                                    <AvatarFallback style={{ backgroundColor: bank.color }} className="text-white text-sm font-bold">
                                        {bank.name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        </div>
                        {/* Connection Line Effect */}
                        <div className="absolute top-1/2 left-1/2 w-24 h-1 bg-primary/50 -translate-x-1/2 -translate-y-1/2 blur-sm rounded-full -z-10"></div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 container mx-auto max-w-lg -mt-12 z-20 px-4 pb-24">
                <Card className="glass shadow-xl rounded-2xl border-border/50 p-6">
                    <p className="text-foreground font-medium mb-8 leading-relaxed">
                        Para conectar sua conta {bank.name}, vou levá-lo com segurança ao aplicativo ou site deles para fazer login. Basta seguir as instruções na tela.
                    </p>

                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="mt-1">
                                <Smartphone className="w-6 h-6 text-primary" />
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Se o aplicativo {bank.name} estiver no seu telefone, tentarei conectar através dele.
                            </p>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="mt-1">
                                <Globe className="w-6 h-6 text-primary" />
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Se isso não for possível, o {bank.name} pedirá que você faça login no internet banking como costuma fazer.
                            </p>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="mt-1">
                                <Building2 className="w-6 h-6 text-primary" />
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Depois de fazer login, o {bank.name} pedirá que você escolha as contas que deseja conectar.
                            </p>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="mt-1">
                                <MoreHorizontal className="w-6 h-6 text-primary" />
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Depois de fazer isso, você será redirecionado de volta para mim.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Footer Action */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border/50 z-30">
                <div className="container mx-auto max-w-lg">
                    <Button className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-6 rounded-full text-lg shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                        Conectar agora <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
