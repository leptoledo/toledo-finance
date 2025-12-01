import { getCategories } from './actions'
import { CategoriesView } from '@/components/categories/categories-view'

export default async function CategoriesPage() {
    const { data: categories } = await getCategories()

    return (
        <CategoriesView categories={categories || []} />
    )
}
