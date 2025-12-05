'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { IncomeSummary } from './income-summary'
import { IncomeTable } from './income-table'
import { AddIncomeDialog } from './add-income-dialog'

interface IncomeViewProps {
    summary: { total: number }
    transactions: any[]
    totalCount: number
    totalAmount?: number
    currentPage: number
    options: {
        categories: any[]
        accounts: any[]
    }
    currency?: string
}

export function IncomeView({ summary, transactions, totalCount, totalAmount, currentPage, options, currency }: IncomeViewProps) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                        <span className="bg-linear-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                            Gestão de Receitas
                        </span>
                    </h2>
                    <p className="text-muted-foreground">
                        Visualize, adicione e edite suas fontes de receita.
                    </p>
                </div>
                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/50 w-full sm:w-auto transition-all hover-lift"
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Receita
                </Button>
            </div>

            <IncomeSummary total={summary.total} currency={currency} />

            <IncomeTable
                transactions={transactions}
                totalCount={totalCount}
                totalAmount={totalAmount}
                currentPage={currentPage}
                currency={currency}
                options={options}
            />

            <AddIncomeDialog
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                categories={options.categories}
                accounts={options.accounts}
                currency={currency}
            />
        </div>
    )
}
