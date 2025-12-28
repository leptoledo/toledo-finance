'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface DropdownMenuProps {
    trigger: React.ReactNode
    children: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

const DropdownContext = React.createContext<{ close: () => void }>({ close: () => { } })

import { createPortal } from 'react-dom'

export function DropdownMenu({ trigger, children, open, onOpenChange }: DropdownMenuProps) {
    const [internalOpen, setInternalOpen] = React.useState(false)
    const isControlled = open !== undefined
    const isOpen = isControlled ? open : internalOpen

    // Refs
    const triggerRef = React.useRef<HTMLDivElement>(null)
    const menuRef = React.useRef<HTMLDivElement>(null)

    // Position state
    const [position, setPosition] = React.useState({ top: 0, right: 0 })

    const handleOpenChange = (newOpen: boolean) => {
        if (!isControlled) {
            setInternalOpen(newOpen)
        }
        onOpenChange?.(newOpen)
    }

    const close = () => handleOpenChange(false)

    // Update position when opening
    React.useLayoutEffect(() => {
        if (isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect()
            const scrollY = window.scrollY
            setPosition({
                top: rect.bottom + scrollY + 5, // 5px gap
                right: window.innerWidth - rect.right // align right
            })
        }
    }, [isOpen])

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            // Check if click is inside trigger
            if (triggerRef.current && triggerRef.current.contains(target)) {
                return
            }
            // Check if click is inside menu
            if (menuRef.current && menuRef.current.contains(target)) {
                return
            }
            // Check generic portals
            if (target.closest('[role="listbox"]') || target.closest('[role="option"]') || target.closest('[data-radix-select-viewport]')) {
                return
            }
            handleOpenChange(false)
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            window.addEventListener('resize', close) // Close on resize to avoid position issues
            window.addEventListener('scroll', close, true) // Close on scroll
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            window.removeEventListener('resize', close)
            window.removeEventListener('scroll', close, true)
        }
    }, [isOpen])

    return (
        <DropdownContext.Provider value={{ close }}>
            <div className="relative inline-block" ref={triggerRef}>
                <div onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleOpenChange(!isOpen)
                }}>
                    {trigger}
                </div>
                {isOpen && typeof document !== 'undefined' && createPortal(
                    <div
                        ref={menuRef}
                        style={{
                            top: position.top,
                            right: position.right,
                            position: 'absolute'
                        }}
                        className="min-w-56 w-auto rounded-xl border border-white/10 bg-[#0f111a] shadow-2xl shadow-purple-900/40 z-[9999] animate-in fade-in-0 zoom-in-95 overflow-hidden ring-1 ring-white/5"
                    >
                        <div className="py-1">
                            {children}
                        </div>
                    </div>,
                    document.body
                )}
            </div>
        </DropdownContext.Provider>
    )
}

interface DropdownMenuItemProps {
    onClick?: () => void
    children: React.ReactNode
    className?: string
    variant?: 'default' | 'destructive'
}

export function DropdownMenuItem({ onClick, children, className, variant = 'default' }: DropdownMenuItemProps) {
    const { close } = React.useContext(DropdownContext)

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        onClick?.()
        close()
    }

    return (
        <button
            onClick={handleClick}
            className={cn(
                'w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2',
                variant === 'default' && 'text-gray-300 hover:text-white hover:bg-white/5',
                variant === 'destructive' && 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10',
                className
            )}
        >
            {children}
        </button>
    )
}

export function DropdownMenuLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {children}
        </div>
    )
}

export function DropdownMenuSeparator() {
    return <div className="h-px bg-white/10 my-1" />
}
