import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <main className="flex flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-linear-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
          LCTNET
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl">
          Assuma o controle da sua vida financeira. Gerencie contas, rastreie despesas e alcance seus objetivos com nossa plataforma intuitiva e poderosa.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/register"
            className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all"
          >
            Começar Agora
          </Link>
          <Link href="/login" className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors">
            Já tenho conta <span aria-hidden="true">→</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
