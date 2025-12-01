import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { FeedbackForm } from './feedback-form'
import { FeedbackList } from './feedback-list'
import { MessageSquare, Send } from 'lucide-react'

export default async function FeedbackPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h3 className="text-3xl sm:text-4xl font-bold mb-2">
                    <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                        Feedback & Suporte
                    </span>
                </h3>
                <p className="text-muted-foreground">
                    Encontrou um erro? Conte-nos para que possamos melhorar sua experiência.
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Formulário de Novo Feedback */}
                <div className="relative overflow-hidden rounded-2xl glass border border-blue-500/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-transparent" />
                    <div className="relative p-6 sm:p-8">
                        <div className="flex items-start gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/50">
                                <Send className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Reportar Problema</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Descreva o erro e envie uma captura de tela se possível
                                </p>
                            </div>
                        </div>
                        <FeedbackForm />
                    </div>
                </div>

                {/* Lista de Feedbacks Enviados */}
                <div className="relative overflow-hidden rounded-2xl glass border border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 via-slate-500/5 to-transparent" />
                    <div className="relative p-6 sm:p-8">
                        <div className="flex items-start gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-gray-500 to-slate-600 shadow-lg shadow-gray-500/50">
                                <MessageSquare className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Seus Feedbacks</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Acompanhe o status dos seus reports
                                </p>
                            </div>
                        </div>
                        <FeedbackList />
                    </div>
                </div>
            </div>
        </div>
    )
}
