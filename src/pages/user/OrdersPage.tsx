import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ChevronRight } from 'lucide-react'
import { useOrders } from '@/hooks/useOrders'
import { LoadingScreen, EmptyState, Pagination } from '@/components/common'
import { formatCurrency, formatDate, getOrderStatusBadgeClass } from '@/utils'

export default function OrdersPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading } = useOrders(page)

  if (isLoading) return <LoadingScreen />

  return (
    <div className="page-container max-w-3xl">
      <h1 className="section-title">My Orders</h1>

      {!data || data.content.length === 0 ? (
        <EmptyState
          icon={<Package className="w-16 h-16" />}
          title="No orders yet"
          description="When you place orders, they'll show up here."
          action={<Link to="/products" className="btn-primary">Start Shopping</Link>}
        />
      ) : (
        <>
          <div className="space-y-4">
            {data.content.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="card-hover p-5 flex items-center justify-between hover:border-primary-200"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-gray-900 text-sm">{order.orderNumber}</span>
                    <span className={getOrderStatusBadgeClass(order.status)}>{order.status}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDate(order.createdAt)} · {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-900">{formatCurrency(order.totalAmount)}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
          <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
