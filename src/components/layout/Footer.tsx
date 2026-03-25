import { Link } from 'react-router-dom'
import { Package, Github, Twitter, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl mb-3">
              <Package className="w-6 h-6 text-primary-400" />
              ShopHub
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Your one-stop shop for quality products. Fast shipping, easy returns, and great prices.
            </p>
            <div className="flex gap-3 mt-4">
              {[Github, Twitter, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2 text-sm">
              {[['All Products', '/products'], ['New Arrivals', '/products?sort=latest'], ['Sale', '/products?sale=true']].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Account</h4>
            <ul className="space-y-2 text-sm">
              {[['My Account', '/profile'], ['Orders', '/orders'], ['Login', '/login'], ['Register', '/register']].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} ShopHub. All rights reserved.</p>
          <p>Built with React + Spring Boot</p>
        </div>
      </div>
    </footer>
  )
}
