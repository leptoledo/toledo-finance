import Link from 'next/link'

export default function AuthCodeError() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
            <h2 className="text-4xl font-bold">Erro de Autenticação</h2>
            <p className="mt-4 text-lg text-muted-foreground">Houve um problema ao verificar seu código de acesso.</p>
            <Link
                href="/login"
                className="mt-8 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
                Voltar para o Login
            </Link>
        </div>
    )
}
