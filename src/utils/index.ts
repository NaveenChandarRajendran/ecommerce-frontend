import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { OrderStatus } from '@/types'

// ── Tailwind class merger ─────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Currency ──────────────────────────────────────────────────────────────────
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

// ── Date ──────────────────────────────────────────────────────────────────────
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  }).format(new Date(dateString))
}

export function formatDateTime(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(dateString))
}

// ── Order status ──────────────────────────────────────────────────────────────
export function getOrderStatusBadgeClass(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    PENDING:    'badge-yellow',
    CONFIRMED:  'badge-blue',
    PROCESSING: 'badge-blue',
    SHIPPED:    'badge-blue',
    DELIVERED:  'badge-green',
    CANCELLED:  'badge-red',
    REFUNDED:   'badge-gray',
  }
  return map[status] ?? 'badge-gray'
}

// ── Truncate ──────────────────────────────────────────────────────────────────
export function truncate(text: string, maxLength = 100): string {
  return text.length <= maxLength ? text : text.slice(0, maxLength) + '…'
}

// ── Discount percentage ───────────────────────────────────────────────────────
export function discountPercent(original: number, sale: number): number {
  return Math.round(((original - sale) / original) * 100)
}

// ── Slugify ───────────────────────────────────────────────────────────────────
export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
}

// ── Rating stars ─────────────────────────────────────────────────────────────
export function getRatingLabel(rating: number): string {
  if (rating >= 4.5) return 'Excellent'
  if (rating >= 4)   return 'Very Good'
  if (rating >= 3)   return 'Good'
  if (rating >= 2)   return 'Fair'
  return 'Poor'
}
