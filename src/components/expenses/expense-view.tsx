'use client'

import { useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ExpenseSummary } from './expense-summary'
import { ExpenseTable } from './expense-table'
import { AddExpenseDialog } from './add-expense-dialog'

interface ExpenseViewProps {
    initialTransactions: any[]
    totalCount: number
    currentPage: number
    totalAmount?: number
    summary: {
        total: number
    }
    options: {
        categories: any[]
        accounts: any[]
    }
    currency?: string
}

export function ExpenseView({ initialTransactions, totalCount, currentPage, totalAmount, summary, options, currency = 'BRL' }: ExpenseViewProps) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                        <span className="bg-linear-to-r from-red-400 to-rose-500 bg-clip-text text-transparent">
                            Gestão de Despesas
                        </span>
                    </h1>
                    <p className="text-muted-foreground">Registre e categorize seus gastos mensais.</p>
                </div>
                <Button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="w-full sm:w-auto bg-linear-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg shadow-red-500/50 transition-all hover-lift"
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Despesa
                </Button>
            </div>

            <ExpenseSummary total={summary.total} currency={currency} />

            <ExpenseTable
                transactions={initialTransactions}
                totalCount={totalCount}
                currentPage={currentPage}
                currency={currency}
                options={options}
                totalAmount={totalAmount}
            />

            <AddExpenseDialog
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                categories={options.categories}
                accounts={options.accounts}
                currency={currency}
            />
        </div>
    )
}
