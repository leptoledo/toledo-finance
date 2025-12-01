'use client'

import { useState } from 'react'
import { updateFeedbackStatus } from './actions'
import { Clock, CheckCircle2, AlertCircle, Loader2, Image as ImageIcon, User } from 'lucide-react'
import Image from 'next/image'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Feedback {
    id: string
    title: string
    description: string
    image_url: string | null
    status: 'pending' | 'in_progress' | 'resolved' | 'closed'
    priority: 'low' | 'medium' | 'high' | 'critical'
    created_at: string
    profiles: {
        first_name: string | null
        last_name: string | null
        full_name: string | null
    } | null
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

export function AdminFeedbackList({ initialFeedbacks }: { initialFeedbacks: Feedback[] }) {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>(initialFeedbacks)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [updatingId, setUpdatingId] = useState<string | null>(null)

    const handleStatusChange = async (feedbackId: string, newStatus: string) => {
        setUpdatingId(feedbackId)
        const result = await updateFeedbackStatus(feedbackId, newStatus)

        if (!result.error) {
            setFeedbacks(feedbacks.map(f =>
                f.id === feedbackId
                    ? { ...f, status: newStatus as Feedback['status'] }
                    : f
            ))
        }

        setUpdatingId(null)
    }

    const getUserName = (feedback: Feedback) => {
        if (feedback.profiles?.first_name && feedback.profiles?.last_name) {
            return `${feedback.profiles.first_name} ${feedback.profiles.last_name}`
        }
        if (feedback.profiles?.full_name) {
            return feedback.profiles.full_name
        }
        return 'Usuário'
    }

    if (feedbacks.length === 0) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-500" />
                <p className="text-gray-400">Nenhum feedback recebido ainda</p>
            </div>
        )
    }

    return (
        <>
            <div className="space-y-4">
                {feedbacks.map((feedback) => {
                    const StatusIcon = statusConfig[feedback.status].icon
                    const priorityInfo = priorityConfig[feedback.priority]

                    return (
                        <div
                            key={feedback.id}
                            className="p-6 rounded-lg bg-gray-800/30 border border-white/5 hover:border-white/10 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`w-3 h-3 rounded-full ${priorityInfo.color}`} title={priorityInfo.label} />
                                        <h4 className="font-semibold text-white text-lg">{feedback.title}</h4>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                                        <User className="h-4 w-4" />
                                        <span>{getUserName(feedback)}</span>
                                        <span>•</span>
                                        <span>
                                            {new Date(feedback.created_at).toLocaleDateString('pt-BR', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Select
                                        value={feedback.status}
                                        onValueChange={(value) => handleStatusChange(feedback.id, value)}
                                        disabled={updatingId === feedback.id}
                                    >
                                        <SelectTrigger className="w-[160px] bg-gray-800/50 border-white/10">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-yellow-400" />
                                                    <span>Pendente</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="in_progress">
                                                <div className="flex items-center gap-2">
                                                    <Loader2 className="h-4 w-4 text-blue-400" />
                                                    <span>Em Análise</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="resolved">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                                    <span>Resolvido</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="closed">
                                                <div className="flex items-center gap-2">
                                                    <AlertCircle className="h-4 w-4 text-gray-400" />
                                                    <span>Fechado</span>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <p className="text-sm text-gray-300 mb-4 whitespace-pre-wrap">
                                {feedback.description}
                            </p>

                            {feedback.image_url && (
                                <button
                                    onClick={() => setSelectedImage(feedback.image_url)}
                                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    <ImageIcon className="h-4 w-4" />
                                    Ver captura de tela
                                </button>
                            )}
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
                            alt="Feedback screenshot"
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
