import { getAnalysisData } from '@/lib/analysis'
import { AnalysisView } from '@/components/analysis/analysis-view'

export default async function AnalysisPage() {
    const analysisData = await getAnalysisData(6) // Last 6 months

    return <AnalysisView data={analysisData} />
}
