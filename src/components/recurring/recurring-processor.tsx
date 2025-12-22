'use client'

import { useEffect } from 'react'
import { processRecurringTransactions } from '@/app/(dashboard)/recurring-actions'

export function RecurringProcessor() {
    useEffect(() => {
        const checkRecurring = async () => {
            try {
                // Silently process recurring transactions
                await processRecurringTransactions()
            } catch (error) {
                console.error('Failed to process recurring transactions', error)
            }
        }

        checkRecurring()
    }, [])

    return null
}
