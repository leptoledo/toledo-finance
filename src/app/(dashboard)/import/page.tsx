import { getCategories } from './actions'
import { ImportView } from '@/components/import/import-view'

export default async function ImportPage() {
    const categories = await getCategories()

    return <ImportView categories={categories} />
}
