import { useQuery } from '@tanstack/react-query'
import productService, { type ProductQueryParams } from '@/services/productService'

export function useProducts(params: ProductQueryParams = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getAll(params),
  })
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getById(id),
    enabled: !!id,
  })
}

export function useLatestProducts() {
  return useQuery({
    queryKey: ['products', 'latest'],
    queryFn: () => productService.getLatest(),
  })
}

export function useProductSearch(keyword: string, page = 0) {
  return useQuery({
    queryKey: ['products', 'search', keyword, page],
    queryFn: () => productService.search(keyword, page),
    enabled: keyword.length > 1,
  })
}

export function useProductsByCategory(categoryId: number, page = 0) {
  return useQuery({
    queryKey: ['products', 'category', categoryId, page],
    queryFn: () => productService.getByCategory(categoryId, page),
    enabled: !!categoryId,
  })
}
