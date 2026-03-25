import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function RegisterPage() {
  const { register, isRegistering } = useAuth()
  const [showPwd, setShowPwd] = useState(false)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', phone: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    register(form)
  }

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="card w-full max-w-md p-8 animate-slide-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-600 font-bold text-xl mb-4">
            <Package className="w-6 h-6" /> ShopHub
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Start shopping today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">First name</label>
              <input type="text" required value={form.firstName} onChange={set('firstName')} className="input" placeholder="John" />
            </div>
            <div>
              <label className="label">Last name</label>
              <input type="text" required value={form.lastName} onChange={set('lastName')} className="input" placeholder="Doe" />
            </div>
          </div>

          <div>
            <label className="label">Email address</label>
            <input type="email" required value={form.email} onChange={set('email')} className="input" placeholder="you@example.com" />
          </div>

          <div>
            <label className="label">Password <span className="text-gray-400 font-normal">(min. 8 characters)</span></label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                required
                minLength={8}
                value={form.password}
                onChange={set('password')}
                className="input pr-10"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="label">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
            <input type="tel" value={form.phone} onChange={set('phone')} className="input" placeholder="+1 (555) 000-0000" />
          </div>

          <button type="submit" disabled={isRegistering} className="btn-primary w-full justify-center py-3">
            {isRegistering ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
