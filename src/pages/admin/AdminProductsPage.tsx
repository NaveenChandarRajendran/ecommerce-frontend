import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import productService from '@/services/productService'
import categoryService from '@/services/categoryService'
import type { Product, ProductRequest } from '@/types'
import { formatCurrency } from '@/utils'
import { Spinner, Pagination } from '@/components/common'

const emptyForm: ProductRequest = {
  name: '', description: '', price: 0, salePrice: undefined,
  stock: 0, imageUrl: '', sku: '', active: true, categoryId: 0,
}

export default function AdminProductsPage() {
  const queryClient = useQueryClient()
  const [page, setPage]       = useState(0)
  const [search, setSearch]   = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm]       = useState<ProductRequest>(emptyForm)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products-list', page],
    queryFn: () => productService.getAll({ page, size: 15 }),
  })
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: categoryService.getAll })

  const createMutation = useMutation({
    mutationFn: productService.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-products-list'] }); closeModal(); toast.success('Product created') },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Failed'),
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductRequest }) => productService.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-products-list'] }); closeModal(); toast.success('Product updated') },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Failed'),
  })
  const deleteMutation = useMutation({
    mutationFn: productService.delete,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-products-list'] }); toast.success('Product deleted') },
  })

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true) }
  const openEdit   = (p: Product) => {
    setEditing(p)
    setForm({ name: p.name, description: p.description ?? '', price: p.price, salePrice: p.salePrice,
              stock: p.stock, imageUrl: p.imageUrl ?? '', sku: p.sku ?? '', active: p.active, categoryId: p.category?.id ?? 0 })
    setShowModal(true)
  }
  const closeModal = () => { setShowModal(false); setEditing(null); setForm(emptyForm) }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) updateMutation.mutate({ id: editing.id, data: form })
    else createMutation.mutate(form)
  }

  const filtered = (data?.content ?? []).filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button onClick={openCreate} className="btn-primary gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…" className="input pl-9" />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                  {['Image', 'Name', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                        {product.imageUrl
                          ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-lg">🛍️</div>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800 max-w-[180px] truncate">{product.name}</p>
                      {product.sku && <p className="text-xs text-gray-400 font-mono">SKU: {product.sku}</p>}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{product.category?.name ?? '—'}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold">{formatCurrency(product.salePrice ?? product.price)}</p>
                      {product.salePrice && <p className="text-xs text-gray-400 line-through">{formatCurrency(product.price)}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={product.stock === 0 ? 'text-red-600 font-semibold' : 'text-gray-700'}>{product.stock}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={product.active ? 'badge-green' : 'badge-red'}>{product.active ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(product)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { if (confirm('Delete this product?')) deleteMutation.mutate(product.id) }}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {data && <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-bold text-lg">{editing ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="label">Name *</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input" placeholder="Product name" />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input h-20 resize-none" placeholder="Product description" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Price *</label>
                  <input required type="number" step="0.01" min="0.01" value={form.price || ''} onChange={e => setForm({...form, price: Number(e.target.value)})} className="input" placeholder="0.00" />
                </div>
                <div>
                  <label className="label">Sale Price</label>
                  <input type="number" step="0.01" min="0" value={form.salePrice || ''} onChange={e => setForm({...form, salePrice: e.target.value ? Number(e.target.value) : undefined})} className="input" placeholder="0.00" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Stock *</label>
                  <input required type="number" min="0" value={form.stock || ''} onChange={e => setForm({...form, stock: Number(e.target.value)})} className="input" />
                </div>
                <div>
                  <label className="label">SKU</label>
                  <input value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} className="input" placeholder="SKU-001" />
                </div>
              </div>
              <div>
                <label className="label">Category *</label>
                <select required value={form.categoryId || ''} onChange={e => setForm({...form, categoryId: Number(e.target.value)})} className="input">
                  <option value="">Select category…</option>
                  {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Image URL</label>
                <input value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} className="input" placeholder="https://…" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="active" checked={form.active} onChange={e => setForm({...form, active: e.target.checked})} className="rounded" />
                <label htmlFor="active" className="text-sm text-gray-700">Active (visible in store)</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="btn-primary flex-1">
                  {createMutation.isPending || updateMutation.isPending ? <Spinner size="sm" /> : editing ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
