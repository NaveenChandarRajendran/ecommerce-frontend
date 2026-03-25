import { useQuery } from '@tanstack/react-query'
import { Package, ShoppingBag, Tag, TrendingUp } from 'lucide-react'
import orderService from '@/services/orderService'
import productService from '@/services/productService'
import categoryService from '@/services/categoryService'
import { formatCurrency } from '@/utils'
import { LoadingScreen } from '@/components/common'

export default function AdminOverviewPage() {
  const { data: orders,     isLoading: oLoad } = useQuery({ queryKey: ['admin-orders'],     queryFn: () => orderService.getAllOrders(0, 100) })
  const { data: products,   isLoading: pLoad } = useQuery({ queryKey: ['admin-products'],   queryFn: () => productService.getAll({ size: 100 }) })
  const { data: categories, isLoading: cLoad } = useQuery({ queryKey: ['categories'],       queryFn: () => categoryService.getAll() })

  if (oLoad || pLoad || cLoad) return <LoadingScreen />

  const totalRevenue = orders?.content.filter(o => o.paymentStatus === 'PAID').reduce((s, o) => s + o.totalAmount, 0) ?? 0
  const pending = orders?.content.filter(o => o.status === 'PENDING').length ?? 0

  const stats = [
    { label: 'Total Products',   value: products?.totalElements ?? 0,  icon: Package,    color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Orders',     value: orders?.totalElements ?? 0,    icon: ShoppingBag, color: 'bg-green-50 text-green-600' },
    { label: 'Categories',       value: categories?.length ?? 0,       icon: Tag,        color: 'bg-purple-50 text-purple-600' },
    { label: 'Total Revenue',    value: formatCurrency(totalRevenue),   icon: TrendingUp,  color: 'bg-orange-50 text-orange-600' },
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-800">Recent Orders</h2>
          {pending > 0 && (
            <span className="badge-yellow">{pending} pending</span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="pb-3 pr-4">Order #</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Payment</th>
                <th className="pb-3">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders?.content.slice(0, 8).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-3 pr-4 font-mono text-xs text-gray-700">{order.orderNumber}</td>
                  <td className="py-3 pr-4">
                    <span className={`badge text-xs ${
                      order.status === 'DELIVERED' ? 'badge-green' :
                      order.status === 'CANCELLED' ? 'badge-red' : 'badge-yellow'
                    }`}>{order.status}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`badge text-xs ${
                      order.paymentStatus === 'PAID' ? 'badge-green' :
                      order.paymentStatus === 'FAILED' ? 'badge-red' : 'badge-yellow'
                    }`}>{order.paymentStatus}</span>
                  </td>
                  <td className="py-3 font-semibold">{formatCurrency(order.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
