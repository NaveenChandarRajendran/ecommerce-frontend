import { cn } from '@/utils'

// ── Spinner ───────────────────────────────────────────────────────────────────
interface SpinnerProps { size?: 'sm' | 'md' | 'lg'; className?: string }
export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeMap = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className={cn('animate-spin rounded-full border-2 border-gray-200 border-t-primary-600', sizeMap[size], className)} />
  )
}

// ── Loading Screen ────────────────────────────────────────────────────────────
export function LoadingScreen() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}

// ── Empty State ───────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && <div className="text-gray-300 mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-500 mb-4 max-w-sm">{description}</p>}
      {action}
    </div>
  )
}

// ── Pagination ────────────────────────────────────────────────────────────────
interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}
export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i)

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        className="btn-secondary py-1.5 px-3 text-sm disabled:opacity-40"
      >
        Previous
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={cn(
            'w-9 h-9 rounded-lg text-sm font-medium transition-colors',
            p === page
              ? 'bg-primary-600 text-white'
              : 'text-gray-600 hover:bg-gray-100',
          )}
        >
          {p + 1}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
        className="btn-secondary py-1.5 px-3 text-sm disabled:opacity-40"
      >
        Next
      </button>
    </div>
  )
}

// ── Star Rating ───────────────────────────────────────────────────────────────
interface StarRatingProps { rating: number; max?: number; size?: number }
export function StarRating({ rating, max = 5, size = 16 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating)
        const partial = !filled && i < rating
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="none">
            <defs>
              {partial && (
                <linearGradient id={`grad-${i}`} x1="0" x2="1" y1="0" y2="0">
                  <stop offset={`${(rating % 1) * 100}%`} stopColor="#f59e0b" />
                  <stop offset={`${(rating % 1) * 100}%`} stopColor="#d1d5db" />
                </linearGradient>
              )}
            </defs>
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={filled ? '#f59e0b' : partial ? `url(#grad-${i})` : '#d1d5db'}
            />
          </svg>
        )
      })}
    </div>
  )
}
