import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Headphones } from 'lucide-react'
import { useLatestProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import ProductGrid from '@/components/product/ProductGrid'
import { LoadingScreen } from '@/components/common'

const features = [
  { icon: Truck,        title: 'Free Shipping',    desc: 'On orders over $50' },
  { icon: RefreshCw,    title: 'Easy Returns',     desc: '30-day return policy' },
  { icon: ShieldCheck,  title: 'Secure Payment',   desc: 'SSL encrypted checkout' },
  { icon: Headphones,   title: '24/7 Support',     desc: 'Always here to help' },
]

export default function HomePage() {
  const { data: products, isLoading: productsLoading } = useLatestProducts()
  const { data: categories, isLoading: catsLoading } = useCategories()

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center">
          <span className="badge bg-white/20 text-white mb-4 px-3 py-1 text-sm">New arrivals every week ✨</span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-balance">
            Shop Smarter,<br />Live Better
          </h1>
          <p className="text-primary-100 text-lg mb-8 max-w-xl">
            Discover thousands of products across every category. Quality guaranteed, shipped fast.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/products" className="btn bg-white text-primary-700 hover:bg-primary-50 font-semibold px-6 py-3 text-base">
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/products?sale=true" className="btn bg-primary-800/50 text-white hover:bg-primary-800 border border-white/20 px-6 py-3 text-base">
              View Sale Items
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">{title}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {!catsLoading && categories && categories.length > 0 && (
        <section className="page-container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="card-hover flex flex-col items-center p-4 text-center hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-2xl mb-2 overflow-hidden">
                  {cat.imageUrl ? <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover rounded-full" /> : '🗂️'}
                </div>
                <span className="text-sm font-medium text-gray-700">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Latest Products */}
      <section className="page-container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title mb-0">New Arrivals</h2>
          <Link to="/products" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {productsLoading ? <LoadingScreen /> : (
          <ProductGrid products={products ?? []} cols={4} />
        )}
      </section>
    </div>
  )
}
