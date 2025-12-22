'use client'

import { Modal } from './modal'
import { Button } from './button'
import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'warning' | 'info'
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'danger'
}: ConfirmDialogProps) {
    const handleConfirm = () => {
        onConfirm()
        onClose()
    }

    const variantStyles = {
        danger: {
            icon: 'text-red-500',
            button: 'bg-red-500 hover:bg-red-600 text-white'
        },
        warning: {
            icon: 'text-yellow-500',
            button: 'bg-yellow-500 hover:bg-yellow-600 text-white'
        },
        info: {
            icon: 'text-blue-500',
            button: 'bg-blue-500 hover:bg-blue-600 text-white'
        }
    }

    const styles = variantStyles[variant]

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="">
            <div className="space-y-6">
                {/* Icon and Title */}
                <div className="flex items-start gap-4">
                    <div className={`shrink-0 w-12 h-12 rounded-full bg-${variant === 'danger' ? 'red' : variant === 'warning' ? 'yellow' : 'blue'}-500/10 flex items-center justify-center`}>
                        <AlertTriangle className={`h-6 w-6 ${styles.icon}`} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">
                            {title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        className="border border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        type="button"
                        onClick={handleConfirm}
                        className={`${styles.button} shadow-lg shadow-red-900/20`}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
