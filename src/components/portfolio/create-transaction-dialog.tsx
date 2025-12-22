'use client'

import { useState, useMemo, useEffect } from 'react'
import { TickerSearch } from './ticker-search'
import { SymbolSearchModal } from './symbol-search-modal'
import { Search } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Calendar, Plus, X } from 'lucide-react'
import { addTransaction, updateTransaction, getAssetQuotes } from '@/app/(dashboard)/portfolio/actions'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface TransactionData {
    id: string
    ticker: string
    type: 'buy' | 'sell' | 'dividend' | 'split'
    quantity: number
    price: number
    date: string
    fees: number
    notes?: string
}

interface CreateTransactionDialogProps {
    isOpen: boolean
    onClose: () => void
    portfolioId: string
    initialData?: TransactionData | null
}

type TransactionType = 'buy' | 'sell' | 'dividend' | 'split'

export function CreateTransactionDialog({ isOpen, onClose, portfolioId, initialData }: CreateTransactionDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    // State for controlled inputs to calculate total
    const [type, setType] = useState<TransactionType>(initialData?.type || 'buy')
    const [quantity, setQuantity] = useState<string>(initialData?.quantity?.toString() || '')
    const [price, setPrice] = useState<string>(initialData?.price?.toString() || '')
    const [fees, setFees] = useState<string>(initialData?.fees?.toString() || '')
    const [notes, setNotes] = useState<string>(initialData?.notes || '')
    const [date, setDate] = useState<string>(initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0])

    // Key to reset TickerSearch
    const [formKey, setFormKey] = useState(0)

    // New Symbol Search State
    const [ticker, setTicker] = useState<string>(initialData?.ticker || '')
    const [isSymbolSearchOpen, setIsSymbolSearchOpen] = useState(false)

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setType(initialData.type)
                setQuantity(initialData.quantity.toString())
                setPrice(initialData.price.toString())
                setFees(initialData.fees.toString())
                setNotes(initialData.notes || '')
                setDate(new Date(initialData.date).toISOString().split('T')[0])
                setTicker(initialData.ticker)
            } else {
                // Reset form to default when opening fresh
                setType('buy')
                setQuantity('')
                setPrice('')
                setFees('')
                setNotes('')
                setDate(new Date().toISOString().split('T')[0])
                setTicker('')
                setFormKey(prev => prev + 1)
            }
        }
    }, [initialData, isOpen])

    const total = useMemo(() => {
        const qty = parseFloat(quantity) || 0
        const prc = parseFloat(price) || 0
        const fee = parseFloat(fees) || 0

        if (type === 'split') return 0

        // For display: Total value involved (gross)
        // Or Net? usually "Total" on a receipt means what you pay/receive.
        // Buy: (Qty * Price) + Fees
        // Sell: (Qty * Price) - Fees ? Or still just total value?
        // The image shows "Total" 0. 
        // Let's show the impact on cash.

        const base = qty * prc
        return base // Simple gross value is often less confusing, but let's do (Qty*Price)
    }, [quantity, price, fees, type])

    const handleSubmit = async (e?: React.FormEvent, closeAfter = true) => {
        if (e) e.preventDefault()

        if (!ticker) return // Should be required

        setIsSubmitting(true)
        try {
            const payload = {
                ticker,
                type,
                quantity: parseFloat(quantity),
                price: type === 'split' ? 0 : parseFloat(price),
                date,
                fees: type === 'split' ? 0 : (parseFloat(fees) || 0),
                notes
            }

            if (initialData) { // Edit mode
                await updateTransaction(initialData.id, portfolioId, payload)
            } else { // Create mode
                await addTransaction({
                    portfolioId,
                    ...payload
                })
            }

            if (closeAfter) {
                onClose()
            } else {
                // Reset form for "Add more"
                setQuantity('')
                setPrice('')
                setFees('')
                setNotes('')
                setFormKey(prev => prev + 1) // Reset ticker search
                // Keep Date and Type as they likely repeat
            }
            router.refresh()
        } catch (error) {
            console.error('Failed to save', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const isEditing = !!initialData

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px] bg-[#121214] border-white/10 text-white p-0 gap-0 shadow-2xl">
                <DialogHeader className="px-6 py-4 flex flex-row items-center justify-between border-b border-white/5 space-y-0">
                    <DialogTitle className="text-lg font-medium text-white">
                        {isEditing ? 'Editar Transação' : 'Nova Transação'}
                    </DialogTitle>
                    {/* Close button is provided by DialogPrimitive usually, but image shows a clear X */}
                </DialogHeader>

                <form
                    onSubmit={(e) => handleSubmit(e, true)}
                    className="p-6 space-y-6"
                >
                    {/* Row 1: Type Segmented Control */}
                    <div className="space-y-2">
                        <Label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Tipo de Operação</Label>
                        <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
                            {(['buy', 'sell', 'dividend', 'split'] as const).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setType(t)}
                                    className={cn(
                                        "flex-1 py-1.5 text-sm font-medium rounded-md transition-all duration-200 capitalize",
                                        type === t && t === 'buy' && "bg-emerald-500/10 text-emerald-400 shadow-sm border border-emerald-500/20",
                                        type === t && t === 'sell' && "bg-red-500/10 text-red-400 shadow-sm border border-red-500/20",
                                        type === t && t === 'dividend' && "bg-blue-500/10 text-blue-400 shadow-sm border border-blue-500/20",
                                        type === t && t === 'split' && "bg-purple-500/10 text-purple-400 shadow-sm border border-purple-500/20",
                                        type !== t && "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                                    )}
                                >
                                    {t === 'buy' ? 'Compra' : t === 'sell' ? 'Venda' : t === 'dividend' ? 'Dividendo' : 'Split'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Row 2: Symbol */}
                    <div className="space-y-2">
                        <Label htmlFor="ticker" className="text-gray-400 text-sm">Ativo</Label>
                        <div className="relative" onClick={() => setIsSymbolSearchOpen(true)}>
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                            <Input
                                value={ticker}
                                readOnly
                                placeholder="Selecione um ativo..."
                                className="pl-9 bg-black/40 border-white/10 h-11 text-gray-200 cursor-pointer focus:border-purple-500/50 hover:bg-white/5 transition-colors"
                            />
                            {/* Hidden input for FormData */}
                            <input type="hidden" name="ticker" value={ticker} />
                        </div>
                        <SymbolSearchModal
                            isOpen={isSymbolSearchOpen}
                            onClose={() => setIsSymbolSearchOpen(false)}
                            onSelect={async (val) => {
                                setTicker(val)
                                setIsSymbolSearchOpen(false)

                                // Auto-fetch price
                                try {
                                    const quotes = await getAssetQuotes([val])
                                    if (quotes && quotes[val]) {
                                        setPrice(quotes[val].toString())
                                    }
                                } catch (err) {
                                    console.error('Failed to auto-fetch price', err)
                                }
                            }}
                        />
                    </div>


                    {/* Row 3: Date and Price */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date" className="text-gray-400 text-sm">Data</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                <Input
                                    id="date"
                                    name="date"
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="pl-9 bg-black/20 border-white/10 h-11 text-gray-200 focus:border-white/20 focus:ring-0 scheme-dark"
                                    required
                                />
                            </div>
                        </div>
                        {type !== 'split' && (
                            <div className="space-y-2">
                                <Label htmlFor="price" className="text-gray-400 text-sm">
                                    {type === 'dividend' ? 'Valor Total Recebido' : 'Preço Unitário'}
                                </Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="bg-black/20 border-white/10 h-11 text-gray-200 focus:border-white/20 focus:ring-0"
                                    required
                                />
                            </div>
                        )}
                        {type === 'split' && <div className="hidden"><input name="price" value="0" readOnly /></div>}
                    </div>

                    {/* Row 4: Quantity and Fees */}
                    <div className="grid grid-cols-2 gap-4">
                        {type === 'dividend' ? (
                            <div className="hidden">
                                <Input name="quantity" value="1" readOnly />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Label htmlFor="quantity" className="text-gray-400 text-sm">
                                    {type === 'split' ? 'Fator (Ex: 2)' : 'Quantidade'}
                                </Label>
                                <Input
                                    id="quantity"
                                    name="quantity"
                                    type="number"
                                    step="any"
                                    placeholder={type === 'split' ? "2" : "0"}
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className="bg-black/20 border-white/10 h-11 text-gray-200 focus:border-white/20 focus:ring-0"
                                    required
                                />
                            </div>
                        )}

                        {/* Placeholder for layout when quantity is hidden */}
                        {type === 'dividend' && <div className="hidden md:block"></div>}

                        {type !== 'split' && (
                            <div className="space-y-2">
                                <Label htmlFor="fees" className="text-gray-400 text-sm">
                                    {type === 'dividend' ? 'Impostos/Taxas' : 'Corretagem/Taxas'}
                                </Label>
                                <Input
                                    id="fees"
                                    name="fees"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={fees}
                                    onChange={(e) => setFees(e.target.value)}
                                    className="bg-black/20 border-white/10 h-11 text-gray-200 focus:border-white/20 focus:ring-0"
                                />
                            </div>
                        )}
                        {type === 'split' && <div className="hidden"><input name="fees" value="0" readOnly /></div>}
                    </div>

                    {/* Row 5: Notes */}
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label htmlFor="notes" className="text-gray-400 text-sm">Notas</Label>
                            <span className="text-xs text-gray-600">{notes.length}/128</span>
                        </div>
                        <Textarea
                            id="notes"
                            name="notes"
                            placeholder="Comentários adicionais..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value.slice(0, 128))}
                            className="bg-black/20 border-white/10 resize-none min-h-[80px] text-gray-300 focus:border-white/20 focus:ring-0"
                        />
                    </div>

                    {/* Footer Section inside Form to submit */}
                    <div className="pt-2 mt-4 space-y-4">
                        {/* Total Display */}
                        {type !== 'split' && (
                            <div className="mb-4">
                                <Label className="text-gray-500 text-xs uppercase block mb-1">Total Estimado</Label>
                                <div className="text-2xl font-semibold text-white">
                                    {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 pt-4 border-t border-white/10">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={onClose}
                                className="flex-1 text-gray-400 hover:text-white hover:bg-white/5"
                            >
                                Cancelar
                            </Button>
                            {!isEditing && (
                                <Button
                                    type="button"
                                    onClick={(e) => handleSubmit(e as any, false)}
                                    className="flex-1 bg-white/5 hover:bg-white/10 text-gray-200 border border-white/5"
                                    disabled={isSubmitting}
                                >
                                    Salvar e add+
                                </Button>
                            )}
                            <Button
                                type="submit"
                                className={cn(
                                    "flex-1 min-w-[100px]",
                                    type === 'buy' ? "bg-emerald-600 hover:bg-emerald-700" :
                                        type === 'sell' ? "bg-red-600 hover:bg-red-700" :
                                            "bg-purple-600 hover:bg-purple-700"
                                )}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar'}
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog >
    )
}
