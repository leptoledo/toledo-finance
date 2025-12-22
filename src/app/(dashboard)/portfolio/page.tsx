import { PortfolioView } from './portfolio-view'
import { getGlobalPortfolioSummary } from './actions'

export default async function PortfolioPage() {
    const { portfolios, global, analytics } = await getGlobalPortfolioSummary()

    return <PortfolioView initialPortfolios={portfolios} globalStats={global} analytics={analytics} />
}
