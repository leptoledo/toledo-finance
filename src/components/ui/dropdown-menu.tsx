'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface DropdownMenuProps {
    trigger: React.ReactNode
    children: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function DropdownMenu({ trigger, children, open, onOpenChange }: DropdownMenuProps) {
    const [internalOpen, setInternalOpen] = React.useState(false)
    const isControlled = open !== undefined
    const isOpen = isControlled ? open : internalOpen
    const dropdownRef = React.useRef<HTMLDivElement>(null)

    const handleOpenChange = (newOpen: boolean) => {
        if (!isControlled) {
            setInternalOpen(newOpen)
        }
        onOpenChange?.(newOpen)
    }

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            if (dropdownRef.current && !dropdownRef.current.contains(target)) {
                // Prevent closing if clicking inside a Radix Select portal (which typically has role="listbox" or "option")
                if (target.closest('[role="listbox"]') || target.closest('[role="option"]') || target.closest('[data-radix-select-viewport]')) {
                    return
                }
                handleOpenChange(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <div onClick={() => handleOpenChange(!isOpen)}>
                {trigger}
            </div>
            {isOpen && (
                <div className="absolute right-0 mt-2 min-w-48 w-auto rounded-md border border-border bg-card shadow-lg z-100 animate-in fade-in-0 zoom-in-95">
                    <div className="py-1">
                        {children}
                    </div>
                </div>
            )}
        </div>
    )
}

interface DropdownMenuItemProps {
    onClick?: () => void
    children: React.ReactNode
    className?: string
    variant?: 'default' | 'destructive'
}

export function DropdownMenuItem({ onClick, children, className, variant = 'default' }: DropdownMenuItemProps) {
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        onClick?.()
    }

    return (
        <button
            onClick={handleClick}
            className={cn(
                'w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2',
                variant === 'default' && 'text-foreground hover:bg-muted',
                variant === 'destructive' && 'text-destructive hover:bg-destructive/10',
                className
            )}
        >
            {children}
        </button>
    )
}
