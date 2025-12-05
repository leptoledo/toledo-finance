import { POPULAR_BANKS, ALL_BANKS, Bank } from '@/lib/banks'
import Link from 'next/link'
import { Link as LinkIcon, Bot } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function ConnectBankPage() {
    // Group banks by letter
    const groupedBanks = ALL_BANKS.reduce((acc, bank) => {
        const letter = bank.name[0].toUpperCase()
        if (!acc[letter]) acc[letter] = []
        acc[letter].push(bank)
        return acc
    }, {} as Record<string, Bank[]>)

    const letters = Object.keys(groupedBanks).sort()

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-background animate-fade-in">
            {/* Header */}
            <div className="relative pt-8 pb-16 px-4 text-center rounded-b-[2.5rem] overflow-hidden border-b border-border/50">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10" />

                <div className="relative z-10">
                    <div className="flex justify-center mb-6">
                        <div className="bg-background p-3 rounded-full shadow-lg ring-1 ring-border">
                            <LinkIcon className="w-6 h-6 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold mb-2 tracking-tight">
                        <span className="gradient-text">Escolha um banco</span><br />
                        <span className="text-foreground">para conectar</span>
                    </h1>

                    <div className="flex justify-center mt-6 mb-2">
                        <div className="relative">
                            <div className="bg-linear-to-br from-indigo-600 to-purple-600 text-white p-4 rounded-2xl shadow-xl shadow-indigo-500/20 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                                <Bot className="w-12 h-12" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-pink-500 text-white p-1.5 rounded-full border-2 border-background">
                                <div className="w-3 h-3 bg-white rounded-full" />
                            </div>
                        </div>
                    </div>

                    <p className="text-sm font-medium text-muted-foreground mt-6 max-w-xs mx-auto leading-relaxed">
                        Eu irei redirecionar você automaticamente para o seu banco para aprovar a conexão e trarei você de volta com segurança.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden relative container mx-auto max-w-2xl -mt-8 z-20 px-4 pb-4">
                <Card className="h-full glass shadow-xl rounded-2xl border-border/50 flex flex-row overflow-hidden">
                    {/* Bank List */}
                    <div className="flex-1 overflow-y-auto p-0 scroll-smooth custom-scrollbar" id="bank-list">
                        {/* Popular Banks */}
                        <div className="p-4 pb-2">
                            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Bancos Populares</h2>
                            <div className="space-y-1">
                                {POPULAR_BANKS.map(bank => (
                                    <Link href={`/connect-bank/${bank.id}`} key={bank.id} className="flex items-center p-3 hover:bg-secondary/50 rounded-xl transition-all duration-200 group border border-transparent hover:border-border/50">
                                        <Avatar className="h-10 w-10 mr-4 ring-2 ring-background shadow-sm">
                                            <AvatarFallback style={{ backgroundColor: bank.color }} className="text-white text-xs font-bold">
                                                {bank.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{bank.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Alphabetical List */}
                        {letters.map(letter => (
                            <div key={letter} id={`section-${letter}`} className="scroll-mt-4">
                                <div className="sticky top-0 bg-background/80 backdrop-blur-md px-6 py-2 border-y border-border/50 z-10">
                                    <h2 className="text-xs font-bold text-primary">{letter}</h2>
                                </div>
                                <div className="p-4 pt-2 space-y-1">
                                    {groupedBanks[letter].map(bank => (
                                        <Link href={`/connect-bank/${bank.id}`} key={bank.id} className="flex items-center p-3 hover:bg-secondary/50 rounded-xl transition-all duration-200 group border border-transparent hover:border-border/50">
                                            <Avatar className="h-10 w-10 mr-4 ring-2 ring-background shadow-sm">
                                                <AvatarFallback style={{ backgroundColor: bank.color }} className="text-white text-xs font-bold">
                                                    {bank.name.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium text-muted-foreground group-hover:text-primary transition-colors">{bank.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Alphabet Index */}
                    <div className="w-10 flex flex-col items-center justify-center py-4 bg-secondary/30 text-[10px] font-bold text-muted-foreground select-none border-l border-border/50">
                        {letters.map(letter => (
                            <a key={letter} href={`#section-${letter}`} className="block w-full text-center py-0.5 hover:text-primary hover:bg-primary/10 transition-colors">
                                {letter}
                            </a>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )
}
