'use client'

import Link from "next/link"
import { Sparkles } from "lucide-react"

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-background/95">
      {/* Background decorativo com gradiente */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background" />

      {/* Efeitos de luz */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <main className="relative z-10 flex flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8 max-w-4xl">
        {/* Logo com ícone */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/50">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Título com gradiente */}
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8">
          <span className="gradient-text">LCTNET</span>
        </h1>

        {/* Descrição */}
        <p className="text-lg sm:text-xl leading-relaxed text-gray-400 max-w-2xl mb-12">
          Assuma o controle da sua vida financeira.
          <br />
          Gerencie contas, rastreie despesas e alcance seus objetivos com nossa plataforma intuitiva e poderosa.
        </p>

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            href="/register"
            className="group relative w-full sm:w-auto px-8 py-4 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/50 hover:shadow-indigo-500/70 transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10">Começar Agora</span>
            <div className="absolute inset-0 rounded-xl bg-linear-to-r from-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          <Link
            href="/login"
            className="group w-full sm:w-auto px-8 py-4 text-white font-semibold hover:text-indigo-400 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Já tenho conta
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Features em destaque (opcional) */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl">
          <div className="p-6 rounded-xl glass border border-white/10 hover:border-indigo-500/30 transition-all duration-300">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="text-white font-semibold mb-2">Controle Total</h3>
            <p className="text-sm text-gray-400">Gerencie todas as suas finanças em um só lugar</p>
          </div>

          <div className="p-6 rounded-xl glass border border-white/10 hover:border-purple-500/30 transition-all duration-300">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-white font-semibold mb-2">Análises Detalhadas</h3>
            <p className="text-sm text-gray-400">Visualize seus gastos com gráficos intuitivos</p>
          </div>

          <div className="p-6 rounded-xl glass border border-white/10 hover:border-pink-500/30 transition-all duration-300">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-white font-semibold mb-2">Metas Inteligentes</h3>
            <p className="text-sm text-gray-400">Alcance seus objetivos financeiros</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-12 py-4 text-center text-sm text-gray-500">
        <p>© 2025 LCTNET. Suas finanças sob controle.</p>
      </footer>
    </div>
  )
}
