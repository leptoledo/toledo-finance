import { getPortfolio, listPortfolios, getPortfolioTransactions } from '@/app/(dashboard)/portfolio/actions'
import { PortfolioDetailsView } from '@/components/portfolio/portfolio-details-view'
import { notFound } from 'next/navigation'

interface Props {
    params: Promise<{ id: string }>
}

export default async function PortfolioDetailsPage({ params }: Props) {
    const { id } = await params
    const [portfolio, portfolios, transactions] = await Promise.all([
        getPortfolio(id),
        listPortfolios(),
        getPortfolioTransactions(id)
    ])

    if (!portfolio) {
        return (
            <div className="p-8 text-center text-gray-400">
                <h1 className="text-2xl font-bold text-white mb-2">Portfolio not found</h1>
                <p>The requested portfolio does not exist or the ID is invalid.</p>
            </div>
        )
    }

    return (
        <PortfolioDetailsView
            id={portfolio.id}
            initialName={portfolio.name}
            initialDescription={portfolio.description}
            portfolios={portfolios}
            initialTransactions={transactions}
        />
    )
}
