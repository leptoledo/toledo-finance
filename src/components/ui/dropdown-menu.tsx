'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface DropdownMenuProps {
    trigger: React.ReactNode
    children: React.ReactNode
}

export function DropdownMenu({ trigger, children }: DropdownMenuProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const dropdownRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
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
            <div onClick={() => setIsOpen(!isOpen)}>
                {trigger}
            </div>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md border border-border bg-card shadow-lg z-[100] animate-in fade-in-0 zoom-in-95">
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
