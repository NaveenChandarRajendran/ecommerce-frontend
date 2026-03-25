import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import categoryService from '@/services/categoryService'
import type { Category, CategoryRequest } from '@/types'
import { Spinner } from '@/components/common'

const emptyForm: CategoryRequest = { name: '', description: '', imageUrl: '' }

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]     = useState<Category | null>(null)
  const [form, setForm]           = useState<CategoryRequest>(emptyForm)

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  })

  const createMutation = useMutation({
    mutationFn: categoryService.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); close(); toast.success('Category created') },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Failed'),
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryRequest }) => categoryService.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); close(); toast.success('Category updated') },
  })
  const deleteMutation = useMutation({
    mutationFn: categoryService.delete,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); toast.success('Category deleted') },
    onError: () => toast.error('Cannot delete category with products'),
  })

  const close = () => { setShowModal(false); setEditing(null); setForm(emptyForm) }
  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true) }
  const openEdit   = (c: Category) => { setEditing(c); setForm({ name: c.name, description: c.description ?? '', imageUrl: c.imageUrl ?? '' }); setShowModal(true) }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) updateMutation.mutate({ id: editing.id, data: form })
    else createMutation.mutate(form)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <button onClick={openCreate} className="btn-primary gap-2">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(categories ?? []).map((cat) => (
            <div key={cat.id} className="card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                {cat.imageUrl
                  ? <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                  : <span className="text-xl">🗂️</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{cat.name}</p>
                {cat.description && <p className="text-xs text-gray-500 truncate">{cat.description}</p>}
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => openEdit(cat)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { if (confirm('Delete this category?')) deleteMutation.mutate(cat.id) }}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-bold text-lg">{editing ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={close} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="label">Name *</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input" placeholder="Category name" />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input h-20 resize-none" placeholder="Description…" />
              </div>
              <div>
                <label className="label">Image URL</label>
                <input value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} className="input" placeholder="https://…" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={close} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="btn-primary flex-1">
                  {createMutation.isPending || updateMutation.isPending ? <Spinner size="sm" /> : editing ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
