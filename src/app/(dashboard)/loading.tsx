import { Loader2 } from 'lucide-react'

export default function Loading() {
    return (
        <div className="flex h-full w-full items-center justify-center p-8">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="h-12 w-12 rounded-full border-4 border-muted/20 border-t-primary animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="h-6 w-6 text-primary animate-pulse" />
                    </div>
                </div>
                <p className="text-muted-foreground animate-pulse">Carregando...</p>
            </div>
        </div>
    )
}
