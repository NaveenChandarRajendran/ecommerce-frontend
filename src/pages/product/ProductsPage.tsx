import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { useProducts, useProductSearch, useProductsByCategory } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import ProductGrid from '@/components/product/ProductGrid'
import { Pagination, EmptyState } from '@/components/common'
import { Package } from 'lucide-react'

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(0)

  const keyword    = searchParams.get('search')    ?? ''
  const categoryId = Number(searchParams.get('category') ?? 0)
  const sort       = searchParams.get('sort') ?? 'createdAt'

  const { data: categories } = useCategories()

  const productsQuery     = useProducts({ page, sortBy: sort })
  const searchQuery       = useProductSearch(keyword, page)
  const categoryQuery     = useProductsByCategory(categoryId, page)

  const activeQuery = keyword ? searchQuery : categoryId ? categoryQuery : productsQuery
  const { data, isLoading } = activeQuery

  useEffect(() => { setPage(0) }, [keyword, categoryId])

  const setCategory = (id: number) => {
    setSearchParams(id ? { category: String(id) } : {})
  }

  return (
    <div className="page-container">
      <div className="flex flex-col md:flex-row gap-8">

        {/* Sidebar filters */}
        <aside className="w-full md:w-56 flex-shrink-0">
          <div className="card p-4 sticky top-20">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </h3>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</p>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setCategory(0)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${!categoryId ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    All Categories
                  </button>
                </li>
                {categories?.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => setCategory(cat.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${categoryId === cat.id ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {keyword ? `Results for "${keyword}"` : categoryId ? (categories?.find(c => c.id === categoryId)?.name ?? 'Products') : 'All Products'}
              </h1>
              {data && <p className="text-sm text-gray-500 mt-1">{data.totalElements} products</p>}
            </div>
          </div>

          {data?.content.length === 0 ? (
            <EmptyState
              icon={<Package className="w-16 h-16" />}
              title="No products found"
              description={keyword ? `No results for "${keyword}". Try a different search term.` : 'No products available in this category.'}
            />
          ) : (
            <>
              <ProductGrid products={data?.content ?? []} isLoading={isLoading} cols={3} />
              {data && (
                <Pagination
                  page={page}
                  totalPages={data.totalPages}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
