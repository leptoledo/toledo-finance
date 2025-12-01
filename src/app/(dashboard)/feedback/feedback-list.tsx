'use client'

import { useEffect, useState } from 'react'
import { getFeedbacks } from './actions'
import { Clock, CheckCircle2, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface Feedback {
    id: string
    title: string
    description: string
    image_url: string | null
    status: 'pending' | 'in_progress' | 'resolved' | 'closed'
    priority: 'low' | 'medium' | 'high' | 'critical'
    created_at: string
}

const statusConfig = {
    pending: {
        label: 'Pendente',
        icon: Clock,
        color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
    },
    in_progress: {
        label: 'Em Análise',
        icon: Loader2,
        color: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    },
    resolved: {
        label: 'Resolvido',
        icon: CheckCircle2,
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    closed: {
        label: 'Fechado',
        icon: AlertCircle,
        color: 'text-gray-400 bg-gray-500/10 border-gray-500/20'
    }
}

const priorityConfig = {
    low: { label: 'Baixa', color: 'bg-blue-500' },
    medium: { label: 'Média', color: 'bg-yellow-500' },
    high: { label: 'Alta', color: 'bg-orange-500' },
    critical: { label: 'Crítica', color: 'bg-red-500' }
}

export function FeedbackList() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)

    useEffect(() => {
        loadFeedbacks()
    }, [])

    const loadFeedbacks = async () => {
        setLoading(true)
        const result = await getFeedbacks()
        if (result.data) {
            setFeedbacks(result.data)
        }
        setLoading(false)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        )
    }

    if (feedbacks.length === 0) {
        return (
            <div className="text-center py-12">
                <MessageSquareOff className="h-12 w-12 mx-auto mb-3 text-gray-500" />
                <p className="text-gray-400">Nenhum feedback enviado ainda</p>
                <p className="text-sm text-gray-500 mt-1">
                    Seus reports aparecerão aqui
                </p>
            </div>
        )
    }

    return (
        <>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {feedbacks.map((feedback) => {
                    const StatusIcon = statusConfig[feedback.status].icon
                    const priorityInfo = priorityConfig[feedback.priority]

                    return (
                        <div
                            key={feedback.id}
                            className="p-4 rounded-lg bg-gray-800/30 border border-white/5 hover:border-white/10 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-3 mb-2">
                                <h4 className="font-semibold text-white flex-1">{feedback.title}</h4>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${priorityInfo.color}`} title={priorityInfo.label} />
                                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs ${statusConfig[feedback.status].color}`}>
                                        <StatusIcon className="h-3 w-3" />
                                        <span>{statusConfig[feedback.status].label}</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                                {feedback.description}
                            </p>

                            {feedback.image_url && (
                                <button
                                    onClick={() => setSelectedImage(feedback.image_url)}
                                    className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors mb-2"
                                >
                                    <ImageIcon className="h-3 w-3" />
                                    Ver imagem anexada
                                </button>
                            )}

                            <p className="text-xs text-gray-500">
                                {new Date(feedback.created_at).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    )
                })}
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-4xl max-h-[90vh]">
                        <Image
                            src={selectedImage}
                            alt="Feedback image"
                            width={1200}
                            height={800}
                            className="rounded-lg object-contain max-h-[90vh]"
                        />
                    </div>
                </div>
            )}
        </>
    )
}

function MessageSquareOff({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <line x1="2" y1="2" x2="22" y2="22" />
        </svg>
    )
}
