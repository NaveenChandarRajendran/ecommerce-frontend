import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

// Public pages
import HomePage             from '@/pages/HomePage'
import LoginPage            from '@/pages/auth/LoginPage'
import RegisterPage         from '@/pages/auth/RegisterPage'
import ProductsPage         from '@/pages/product/ProductsPage'
import ProductDetailPage    from '@/pages/product/ProductDetailPage'

// Protected pages
import OrdersPage           from '@/pages/user/OrdersPage'
import OrderDetailPage      from '@/pages/user/OrderDetailPage'
import CheckoutPage         from '@/pages/checkout/CheckoutPage'

// Lazy-loaded Admin pages (to reduce initial bundle)
import { lazy, Suspense } from 'react'
import { LoadingScreen } from '@/components/common'

const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public */}
        <Route index element={<HomePage />} />
        <Route path="products"    element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="login"       element={<LoginPage />} />
        <Route path="register"    element={<RegisterPage />} />

        {/* Protected – any authenticated user */}
        <Route element={<ProtectedRoute />}>
          <Route path="orders"      element={<OrdersPage />} />
          <Route path="orders/:id"  element={<OrderDetailPage />} />
          <Route path="checkout"    element={<CheckoutPage />} />
        </Route>

        {/* Admin only */}
        <Route element={<ProtectedRoute requireAdmin />}>
          <Route path="admin/*" element={
            <Suspense fallback={<LoadingScreen />}>
              <AdminDashboard />
            </Suspense>
          } />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
