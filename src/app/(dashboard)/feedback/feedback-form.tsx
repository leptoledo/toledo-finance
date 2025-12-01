'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createFeedback } from './actions'
import { Upload, X, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'

export function FeedbackForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const formRef = useRef<HTMLFormElement>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                setMessage({ type: 'error', text: 'A imagem deve ter no máximo 2MB' })
                return
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                setMessage({ type: 'error', text: 'Por favor, selecione uma imagem válida' })
                return
            }

            setSelectedFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const removeImage = () => {
        setImagePreview(null)
        setSelectedFile(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setMessage(null)

        const formData = new FormData(e.currentTarget)

        // Add the selected file to formData if exists
        if (selectedFile) {
            formData.set('image', selectedFile)
        }

        const result = await createFeedback(formData)

        if (result.error) {
            setMessage({ type: 'error', text: result.error })
        } else {
            setMessage({ type: 'success', text: result.success || 'Feedback enviado com sucesso!' })
            formRef.current?.reset()
            removeImage()
        }

        setIsSubmitting(false)
    }

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="title" className="text-white">Título do Problema</Label>
                <Input
                    id="title"
                    name="title"
                    placeholder="Ex: Erro ao salvar transação"
                    required
                    className="bg-gray-800/50 border-white/10"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Descrição Detalhada</Label>
                <Textarea
                    id="description"
                    name="description"
                    placeholder="Descreva o erro em detalhes: o que você estava fazendo, o que esperava que acontecesse e o que realmente aconteceu..."
                    required
                    rows={6}
                    className="bg-gray-800/50 border-white/10 resize-none"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="priority" className="text-white">Prioridade</Label>
                <Select name="priority" defaultValue="medium" required>
                    <SelectTrigger className="bg-gray-800/50 border-white/10">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="low">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <span>Baixa - Problema menor</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="medium">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                <span>Média - Afeta funcionalidade</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="high">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-orange-500" />
                                <span>Alta - Problema importante</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="critical">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                <span>Crítica - Sistema não funciona</span>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label className="text-white">Imagem do Erro (Opcional)</Label>
                <div className="space-y-3">
                    {!imagePreview ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center cursor-pointer hover:border-white/20 transition-colors bg-gray-800/30"
                        >
                            <Upload className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                            <p className="text-sm text-gray-400 mb-1">
                                Clique para fazer upload ou arraste a imagem
                            </p>
                            <p className="text-xs text-gray-500">
                                PNG, JPG ou GIF (máx. 2MB)
                            </p>
                        </div>
                    ) : (
                        <div className="relative rounded-lg overflow-hidden border border-white/10">
                            <Image
                                src={imagePreview}
                                alt="Preview"
                                width={800}
                                height={400}
                                className="w-full h-auto max-h-64 object-contain bg-gray-900"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                            >
                                <X className="h-4 w-4 text-white" />
                            </button>
                        </div>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-lg border flex items-start gap-3 ${message.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}>
                    {message.type === 'success' ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                    ) : (
                        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm">{message.text}</p>
                </div>
            )}

            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-linear-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/50"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                    </>
                ) : (
                    'Enviar Feedback'
                )}
            </Button>
        </form>
    )
}
