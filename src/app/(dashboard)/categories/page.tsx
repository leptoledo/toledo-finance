import { getCategories } from './actions'
import { CategoriesView } from '@/components/categories/categories-view'

export default async function CategoriesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedSearchParams = await searchParams
    const page = Number(resolvedSearchParams.page) || 1
    const { data: categories, count } = await getCategories(undefined, page, 10)

    return (
        <CategoriesView
            categories={categories || []}
            totalCount={count || 0}
            currentPage={page}
        />
    )
}
