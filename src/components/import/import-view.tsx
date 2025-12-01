'use client'

import { useState } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { parseCSV, importTransactions } from '@/app/(dashboard)/import/actions'
import { TransactionPreview } from './transaction-preview'
import { CategoryMapper } from './category-mapper'

interface Category {
    id: string
    name: string
    type: 'income' | 'expense'
    icon: string | null
}

interface ParsedTransaction {
    date: string
    description: string
    amount: number
    type: 'income' | 'expense'
}

interface ImportViewProps {
    categories: Category[]
}

export function ImportView({ categories }: ImportViewProps) {
    const [step, setStep] = useState<'upload' | 'preview' | 'mapping' | 'success'>('upload')
    const [file, setFile] = useState<File | null>(null)
    const [transactions, setTransactions] = useState<ParsedTransaction[]>([])
    const [categoryMappings, setCategoryMappings] = useState<Record<string, string>>({})
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [importedCount, setImportedCount] = useState(0)

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
            setError(null)
        }
    }

    const handleUpload = async () => {
        if (!file) return

        setIsProcessing(true)
        setError(null)

        try {
            const content = await file.text()
            const result = await parseCSV(content)

            if (result.error) {
                setError(result.error)
                setIsProcessing(false)
                return
            }

            if (result.transactions.length === 0) {
                setError('Nenhuma transação válida encontrada no arquivo')
                setIsProcessing(false)
                return
            }

            setTransactions(result.transactions)
            setStep('preview')
        } catch (err) {
            setError('Erro ao ler arquivo')
        }

        setIsProcessing(false)
    }

    const handleContinueToMapping = () => {
        setStep('mapping')
    }

    const handleImport = async () => {
        setIsProcessing(true)
        setError(null)

        const result = await importTransactions(transactions, categoryMappings)

        if (result.error) {
            setError(result.error)
            setIsProcessing(false)
            return
        }

        setImportedCount(result.count || 0)
        setStep('success')
        setIsProcessing(false)
    }

    const handleReset = () => {
        setStep('upload')
        setFile(null)
        setTransactions([])
        setCategoryMappings({})
        setError(null)
        setImportedCount(0)
    }

    const downloadTemplate = () => {
        const template = 'Data,Descrição,Valor\n2024-01-15,Salário,5000.00\n2024-01-16,Supermercado,-250.50\n2024-01-17,Aluguel,-1200.00'
        const blob = new Blob([template], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'template_importacao.csv'
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Importar Transações
                    </span>
                </h2>
                <p className="text-muted-foreground">
                    Importe suas transações em lote a partir de arquivos CSV.
                </p>
            </div>

            {/* Upload Step */}
            {step === 'upload' && (
                <div className="space-y-6">
                    {/* Instructions */}
                    <div className="relative overflow-hidden rounded-2xl glass border border-cyan-500/20 p-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-transparent" />
                        <div className="relative space-y-4">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <FileText className="h-5 w-5 text-cyan-400" />
                                Formato do Arquivo CSV
                            </h3>
                            <div className="space-y-2 text-sm text-gray-300">
                                <p>O arquivo CSV deve conter as seguintes colunas (com cabeçalho):</p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li><strong>Data:</strong> formato YYYY-MM-DD (ex: 2024-01-15)</li>
                                    <li><strong>Descrição:</strong> descrição da transação</li>
                                    <li><strong>Valor:</strong> valor positivo para receitas, negativo para despesas</li>
                                </ul>
                                <div className="mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={downloadTemplate}
                                        className="border-cyan-500/30 hover:bg-cyan-500/10"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Baixar Modelo CSV
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Upload Area */}
                    <div className="relative overflow-hidden rounded-2xl glass border border-cyan-500/20 p-12">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-transparent" />
                        <div className="relative text-center space-y-6">
                            <div className="inline-flex p-6 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50">
                                <Upload className="h-16 w-16 text-white" />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold text-white">
                                    {file ? file.name : 'Selecione um arquivo CSV'}
                                </h3>
                                <p className="text-muted-foreground">
                                    {file ? `Tamanho: ${(file.size / 1024).toFixed(2)} KB` : 'Arraste e solte ou clique para selecionar'}
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <label className="cursor-pointer">
                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="border-cyan-500/30 hover:bg-cyan-500/10"
                                    >
                                        Selecionar Arquivo
                                    </Button>
                                </label>

                                {file && (
                                    <Button
                                        onClick={handleUpload}
                                        disabled={isProcessing}
                                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/50"
                                    >
                                        {isProcessing ? 'Processando...' : 'Processar Arquivo'}
                                    </Button>
                                )}
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Step */}
            {step === 'preview' && (
                <TransactionPreview
                    transactions={transactions}
                    onContinue={handleContinueToMapping}
                    onCancel={handleReset}
                />
            )}

            {/* Mapping Step */}
            {step === 'mapping' && (
                <CategoryMapper
                    transactions={transactions}
                    categories={categories}
                    mappings={categoryMappings}
                    onMappingsChange={setCategoryMappings}
                    onImport={handleImport}
                    onBack={() => setStep('preview')}
                    isProcessing={isProcessing}
                    error={error}
                />
            )}

            {/* Success Step */}
            {step === 'success' && (
                <div className="relative overflow-hidden rounded-2xl glass border border-green-500/20 p-12">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-transparent" />
                    <div className="relative text-center space-y-6">
                        <div className="inline-flex p-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/50">
                            <CheckCircle className="h-16 w-16 text-white" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-2xl font-semibold text-white">Importação Concluída!</h3>
                            <p className="text-muted-foreground">
                                {importedCount} {importedCount === 1 ? 'transação foi importada' : 'transações foram importadas'} com sucesso.
                            </p>
                        </div>

                        <div className="flex gap-3 justify-center">
                            <Button
                                onClick={handleReset}
                                variant="outline"
                                className="border-white/10 hover:bg-white/5"
                            >
                                Importar Mais
                            </Button>
                            <Button
                                onClick={() => window.location.href = '/dashboard'}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/50"
                            >
                                Ir para Dashboard
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
