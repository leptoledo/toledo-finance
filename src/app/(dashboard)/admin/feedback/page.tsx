import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getAllFeedbacks } from './actions'
import { AdminFeedbackList } from './admin-feedback-list'
import { Shield, MessageSquare } from 'lucide-react'

export default async function AdminFeedbackPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Verificar se é admin
    const adminEmails = ['leptoledo@hotmail.com', 'admin@financex.com'] // Adicione seu email aqui
    if (!adminEmails.includes(user.email || '')) {
        redirect('/dashboard')
    }

    const { data: feedbacks } = await getAllFeedbacks()

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-linear-to-br from-red-500 to-orange-600 shadow-lg shadow-red-500/50">
                    <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h3 className="text-3xl sm:text-4xl font-bold">
                        <span className="bg-linear-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                            Painel Admin - Feedbacks
                        </span>
                    </h3>
                    <p className="text-muted-foreground mt-1">
                        Gerencie todos os feedbacks enviados pelos usuários
                    </p>
                </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl glass border border-red-500/20">
                <div className="absolute inset-0 bg-linear-to-br from-red-500/5 via-orange-500/5 to-transparent" />
                <div className="relative p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <MessageSquare className="h-6 w-6 text-red-400" />
                        <h3 className="text-xl font-semibold text-white">
                            Todos os Feedbacks ({feedbacks?.length || 0})
                        </h3>
                    </div>
                    <AdminFeedbackList initialFeedbacks={feedbacks || []} />
                </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl glass border border-white/10 p-6">
                <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">📧 Notificações por Email</h4>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <p className="text-sm text-blue-400 mb-2">
                            <strong>Como receber notificações:</strong>
                        </p>
                        <ol className="text-sm text-gray-400 space-y-2 list-decimal list-inside">
                            <li>Configure seu email no arquivo <code className="bg-gray-800 px-2 py-1 rounded">actions.ts</code></li>
                            <li>Os feedbacks são salvos no Supabase em tempo real</li>
                            <li>Acesse esta página para visualizar todos os feedbacks</li>
                            <li>Você pode integrar com serviços como Resend ou SendGrid para emails automáticos</li>
                        </ol>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                        <p className="text-sm text-yellow-400 mb-2">
                            <strong>💡 Dica:</strong>
                        </p>
                        <p className="text-sm text-gray-400">
                            Configure webhooks do Supabase para receber notificações instantâneas quando um novo feedback for criado.
                            Acesse: Dashboard Supabase → Database → Webhooks
                        </p>
                    </div>

                    <div className="bg-gray-800/50 border border-white/10 rounded-lg p-4">
                        <p className="text-sm text-gray-300 mb-2">
                            <strong>📊 Acesso ao Banco de Dados:</strong>
                        </p>
                        <p className="text-sm text-gray-400">
                            Todos os feedbacks estão na tabela <code className="bg-gray-800 px-2 py-1 rounded">feedback</code> no Supabase.
                            Você pode acessá-los diretamente pelo painel do Supabase ou por esta interface.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
