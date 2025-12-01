'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Upload, Loader2, User } from 'lucide-react'

interface AvatarUploadProps {
    uid: string
    url: string | null
    onUpload: (url: string) => void
}

export function AvatarUpload({ uid, url, onUpload }: AvatarUploadProps) {
    const supabase = createClient()
    const [avatarUrl, setAvatarUrl] = useState<string | null>(url)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        if (url) setAvatarUrl(url)
    }, [url])

    async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
        try {
            setUploading(true)

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('Você deve selecionar uma imagem para fazer upload.')
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const filePath = `${uid}-${Math.random()}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)

            setAvatarUrl(data.publicUrl)
            onUpload(data.publicUrl)
        } catch (error) {
            alert('Erro ao fazer upload do avatar!')
            console.log(error)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border-2 border-border">
                <AvatarImage src={avatarUrl || ''} alt="Avatar" />
                <AvatarFallback className="bg-muted">
                    <User className="h-12 w-12 text-muted-foreground" />
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
                <Button variant="outline" type="button" className="relative" disabled={uploading}>
                    {uploading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Upload className="mr-2 h-4 w-4" />
                    )}
                    {uploading ? 'Enviando...' : 'Alterar foto'}
                    <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        accept="image/*"
                        onChange={uploadAvatar}
                        disabled={uploading}
                    />
                </Button>
                <p className="text-xs text-muted-foreground">
                    JPG, GIF ou PNG. Máx 2MB.
                </p>
            </div>
        </div>
    )
}
