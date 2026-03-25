import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import type { Product } from '@/types'
import { formatCurrency, discountPercent, cn } from '@/utils'
import { useCart } from '@/hooks/useCart'
import { useAuthStore } from '@/store/authStore'
import { StarRating } from '@/components/common'

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { addItem, isAddingItem } = useCart()
  const { isAuthenticated } = useAuthStore()

  const hasDiscount = product.salePrice != null && product.salePrice < product.price
  const discount    = hasDiscount ? discountPercent(product.price, product.salePrice!) : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isAuthenticated) return
    addItem({ productId: product.id, quantity: 1 })
  }

  return (
    <Link
      to={`/products/${product.id}`}
      className={cn('card-hover group flex flex-col overflow-hidden', className)}
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl">🛍️</div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {hasDiscount && (
            <span className="badge bg-red-500 text-white">-{discount}%</span>
          )}
          {product.stock === 0 && (
            <span className="badge bg-gray-900 text-white">Out of stock</span>
          )}
        </div>

        {/* Quick add */}
        {isAuthenticated && product.stock > 0 && (
          <button
            onClick={handleAddToCart}
            disabled={isAddingItem}
            className="absolute bottom-2 right-2 bg-white text-primary-600 hover:bg-primary-600 hover:text-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-50"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        {product.category && (
          <span className="text-xs text-primary-600 font-medium mb-1">{product.category.name}</span>
        )}
        <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        {product.reviewCount > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            <StarRating rating={product.averageRating} size={13} />
            <span className="text-xs text-gray-500">({product.reviewCount})</span>
          </div>
        )}

        {/* Price */}
        <div className="mt-auto flex items-center gap-2">
          <span className={cn('font-bold text-base', hasDiscount ? 'text-red-600' : 'text-gray-900')}>
            {formatCurrency(hasDiscount ? product.salePrice! : product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">{formatCurrency(product.price)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
