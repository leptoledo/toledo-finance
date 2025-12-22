'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
    className?: string
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className={cn(
                "relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0f111a] p-6 shadow-2xl shadow-purple-900/20 ring-1 ring-white/5 animate-in fade-in zoom-in-95 duration-200 overflow-hidden",
                className
            )}>
                {/* Subtle gradient accent at the top */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50" />

                <div className="flex items-start justify-between absolute right-4 top-4 z-10">
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {title && (
                    <div className="mb-4 pr-8">
                        <h2 className="text-xl font-semibold text-white">{title}</h2>
                    </div>
                )}
                {children}
            </div>
        </div>
    )
}
