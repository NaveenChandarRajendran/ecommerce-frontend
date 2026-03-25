import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, ChevronLeft } from 'lucide-react'
import { useProduct } from '@/hooks/useProducts'
import { useCart } from '@/hooks/useCart'
import { useAuthStore } from '@/store/authStore'
import { LoadingScreen, StarRating } from '@/components/common'
import { formatCurrency, discountPercent } from '@/utils'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: product, isLoading } = useProduct(Number(id))
  const { addItem, isAddingItem } = useCart()
  const { isAuthenticated } = useAuthStore()
  const [qty, setQty] = useState(1)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  if (isLoading) return <LoadingScreen />
  if (!product)  return <div className="page-container text-center py-20 text-gray-500">Product not found.</div>

  const hasDiscount = product.salePrice != null && product.salePrice < product.price
  const displayImage = selectedImage ?? product.imageUrl
  const allImages = [
    ...(product.imageUrl ? [product.imageUrl] : []),
    ...(product.images?.map(i => i.imageUrl) ?? []),
  ]

  return (
    <div className="page-container">
      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ChevronLeft className="w-4 h-4" /> Back to products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-3">
            {displayImage ? (
              <img src={displayImage} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-7xl">🛍️</div>
            )}
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {allImages.map((url, i) => (
                <button key={i} onClick={() => setSelectedImage(url)}
                  className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-colors ${selectedImage === url ? 'border-primary-500' : 'border-transparent'}`}
                >
                  <img src={url} alt={`Image ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {product.category && (
            <Link to={`/products?category=${product.category.id}`} className="text-sm text-primary-600 font-medium hover:underline">
              {product.category.name}
            </Link>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-3">{product.name}</h1>

          {product.reviewCount > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <StarRating rating={product.averageRating} size={16} />
              <span className="text-sm text-gray-500">{product.averageRating.toFixed(1)} ({product.reviewCount} reviews)</span>
            </div>
          )}

          <div className="flex items-end gap-3 mb-6">
            <span className={`text-3xl font-extrabold ${hasDiscount ? 'text-red-600' : 'text-gray-900'}`}>
              {formatCurrency(hasDiscount ? product.salePrice! : product.price)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-xl text-gray-400 line-through">{formatCurrency(product.price)}</span>
                <span className="badge bg-red-100 text-red-700 text-sm">-{discountPercent(product.price, product.salePrice!)}%</span>
              </>
            )}
          </div>

          {product.description && (
            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
          )}

          {/* Stock */}
          <p className={`text-sm font-medium mb-6 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `✓ In stock (${product.stock} available)` : '✗ Out of stock'}
          </p>

          {/* Quantity + Add to cart */}
          {isAuthenticated && product.stock > 0 && (
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 hover:bg-gray-100 transition-colors text-lg">−</button>
                <span className="w-10 text-center font-medium">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="w-10 h-10 hover:bg-gray-100 transition-colors text-lg">+</button>
              </div>
              <button
                onClick={() => addItem({ productId: product.id, quantity: qty })}
                disabled={isAddingItem}
                className="btn-primary flex-1 py-3 text-base"
              >
                <ShoppingCart className="w-5 h-5" />
                {isAddingItem ? 'Adding…' : 'Add to Cart'}
              </button>
            </div>
          )}

          {!isAuthenticated && (
            <Link to="/login" className="btn-primary w-full justify-center py-3 text-base">
              Login to Purchase
            </Link>
          )}

          {/* SKU */}
          {product.sku && (
            <p className="text-xs text-gray-400 mt-4">SKU: {product.sku}</p>
          )}
        </div>
      </div>
    </div>
  )
}
