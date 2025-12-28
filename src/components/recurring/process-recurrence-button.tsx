'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, PlayCircle } from 'lucide-react'
import { processRecurringTransactions } from '@/app/(dashboard)/recurring-actions'
import { useToast } from '@/components/ui/toast'
import { useRouter } from 'next/navigation'

export function ProcessRecurrenceButton() {
    const [isPending, startTransition] = useTransition()
    const { showToast } = useToast()
    const router = useRouter()

    const handleProcess = () => {
        startTransition(async () => {
            const result = await processRecurringTransactions()
            if (result?.success) {
                const count = result.count
                if (count > 0) {
                    showToast(`${count} recorrência${count > 1 ? 's' : ''} processada${count > 1 ? 's' : ''} com sucesso!`, 'success')
                } else {
                    showToast('Nenhuma recorrência pendente para processar.', 'info')
                }
                router.refresh()
            } else {
                showToast(`Erro: ${result?.error || 'Erro desconhecido'}`, 'error')
            }
        })
    }

    return (
        <Button
            onClick={handleProcess}
            disabled={isPending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
            {isPending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                </>
            ) : (
                <>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Processar Agora
                </>
            )}
        </Button>
    )
}
