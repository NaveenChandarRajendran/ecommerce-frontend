import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { LayoutDashboard, Package, Tag, ShoppingBag, LogOut } from 'lucide-react'
import { cn } from '@/utils'
import { useAuth } from '@/hooks/useAuth'
import AdminProductsPage  from './AdminProductsPage'
import AdminOrdersPage    from './AdminOrdersPage'
import AdminCategoriesPage from './AdminCategoriesPage'
import AdminOverviewPage  from './AdminOverviewPage'

const links = [
  { to: '/admin',            label: 'Overview',   icon: LayoutDashboard, end: true },
  { to: '/admin/products',   label: 'Products',   icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Tag },
  { to: '/admin/orders',     label: 'Orders',     icon: ShoppingBag },
]

export default function AdminDashboard() {
  const { logout, user } = useAuth()

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 text-gray-300 flex flex-col py-6 flex-shrink-0">
        <div className="px-4 mb-6">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Admin Panel</p>
          <p className="text-sm font-semibold text-white truncate">{user?.firstName} {user?.lastName}</p>
        </div>

        <nav className="flex-1 px-2 space-y-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white')
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-2 mt-4">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-left text-sm text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 bg-gray-50 overflow-auto">
        <Routes>
          <Route index        element={<AdminOverviewPage />} />
          <Route path="products"   element={<AdminProductsPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="orders"     element={<AdminOrdersPage />} />
          <Route path="*"          element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  )
}
