import type { Product } from '@/types'
import ProductCard from './ProductCard'
import { LoadingScreen } from '@/components/common'

interface ProductGridProps {
  products: Product[]
  isLoading?: boolean
  cols?: 2 | 3 | 4
}

export default function ProductGrid({ products, isLoading, cols = 4 }: ProductGridProps) {
  if (isLoading) return <LoadingScreen />

  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }

  return (
    <div className={`grid ${gridCols[cols]} gap-4 md:gap-6`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
