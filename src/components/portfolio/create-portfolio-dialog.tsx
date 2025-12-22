'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Upload, Smile, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CreatePortfolioDialogProps {
    isOpen: boolean
    onClose: () => void
    mode?: 'manual' | 'upload'
}


import { useRouter } from 'next/navigation'
import { createPortfolio } from '@/app/(dashboard)/portfolio/actions'

// ...

export function CreatePortfolioDialog({ isOpen, onClose, mode = 'manual' }: CreatePortfolioDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [benchmark, setBenchmark] = useState('IBOV')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        setIsSubmitting(true)

        try {
            const { id } = await createPortfolio(formData)
            onClose()
            router.push(`/portfolio/${id}`)
        } catch (error) {
            console.error('Failed to create portfolio', error)
            // Handle error (show toast, etc)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] glass border-purple-500/20 text-white p-0 overflow-hidden gap-0">
                <DialogHeader className="p-6 border-b border-white/10">
                    <DialogTitle className="text-xl font-semibold">Criar portfolio</DialogTitle>
                </DialogHeader>

                <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                    {/* File Upload Area - Only show if mode is 'upload' */}
                    {mode === 'upload' && (
                        <div className="border border-dashed border-white/20 rounded-xl p-6 flex flex-col items-center justify-center gap-4 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                            <div className="h-12 w-12 rounded-full bg-linear-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Upload className="h-6 w-6 text-purple-400" />
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-sm font-medium">Arraste e solte o arquivo, ou procure</p>
                                <p className="text-xs text-muted-foreground">CSV, XLSX, tamanho máx. 25MB</p>
                            </div>
                            <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/10">
                                Procurar
                            </Button>
                        </div>
                    )}

                    <form id="create-portfolio-form" onSubmit={handleSubmit} className="space-y-6">
                        {/* Portfolio Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome do Portfolio</Label>
                            <div className="relative">
                                <Smile className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Meu portfolio"
                                    className="pl-9 bg-gray-900/50 border-white/10 focus:border-purple-500/50"
                                    required
                                />
                            </div>
                        </div>

                        {/* Currency & Risk-free rate */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Moeda</Label>
                                <Select name="currency" defaultValue="BRL">
                                    <SelectTrigger className="bg-gray-900/50 border-white/10">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="BRL">BRL</SelectItem>
                                        <SelectItem value="USD">USD</SelectItem>
                                        <SelectItem value="EUR">EUR</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    Taxa Livre de Risco
                                </Label>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        name="risk_free_rate"
                                        defaultValue="10"
                                        className="bg-gray-900/50 border-white/10 pr-8"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                                </div>
                            </div>
                        </div>

                        {/* Benchmark */}
                        <div className="space-y-3">
                            <Label>Benchmark</Label>
                            <Select name="benchmark" value={benchmark} onValueChange={setBenchmark}>
                                <SelectTrigger className="bg-gray-900/50 border-white/10">
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white">
                                            {benchmark.charAt(0)}
                                        </div>
                                        <SelectValue />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="IBOV">IBOV</SelectItem>
                                    <SelectItem value="SPX">SPX</SelectItem>
                                    <SelectItem value="NAS100">NAS100</SelectItem>
                                    <SelectItem value="CDI">CDI</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex gap-2">
                                {['IBOV', 'SPX', 'NAS100', 'CDI'].map(tag => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => setBenchmark(tag)}
                                        className={cn(
                                            "px-3 py-1 rounded-full text-xs font-medium transition-colors border border-white/10",
                                            tag === benchmark
                                                ? "bg-white text-black border-white"
                                                : "bg-transparent text-gray-400 hover:text-white hover:border-white/30"
                                        )}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Checkbox */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="auto-adjust"
                                name="auto_adjust"
                                className="h-4 w-4 rounded border-gray-600 bg-gray-900 text-purple-600 focus:ring-purple-500 focus:ring-offset-gray-900"
                                defaultChecked
                            />
                            <Label htmlFor="auto-adjust" className="font-normal cursor-pointer">Ajustar automaticamente para desdobramentos</Label>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <Label>Descrição</Label>
                                <span>0/1200</span>
                            </div>
                            <Textarea
                                name="description"
                                placeholder="Alguns comentários sobre este portfolio..."
                                className="bg-gray-900/50 border-white/10 resize-none min-h-[100px]"
                            />
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-black/20">
                    <Button variant="outline" type="button" onClick={onClose} className="border-white/10 hover:bg-white/5 hover:text-white text-gray-400">
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        form="create-portfolio-form"
                        disabled={isSubmitting}
                        className="bg-purple-600 hover:bg-purple-700 text-white min-w-[100px]"
                    >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Criar'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
