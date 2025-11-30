'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Login failed. Please check your credentials.')
        setIsLoading(false)
        return
      }

      // Check if response has data
      if (!data.success) {
        setError(data.error || 'Login failed')
        setIsLoading(false)
        return
      }

      // Redirect based on role
      if (data.user.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      
      <main className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-bg border border-border rounded-lg shadow-soft p-8">
            <h1 className="text-3xl font-bold text-text mb-2">Welcome Back</h1>
            <p className="text-muted mb-8">Sign in to your account to continue</p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-bg text-text placeholder:text-muted"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-bg text-text placeholder:text-muted"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-text transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-text">Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:text-primary-600 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-bg text-muted">Or continue with</span>
              </div>
            </div>

            {/* Social Login Placeholders */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                type="button"
                className="flex items-center justify-center px-4 py-3 border border-border rounded-lg hover:border-primary hover:text-primary transition-colors duration-200"
              >
                <span className="text-sm font-medium">Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center px-4 py-3 border border-border rounded-lg hover:border-primary hover:text-primary transition-colors duration-200"
              >
                <span className="text-sm font-medium">Facebook</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-muted">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="text-primary hover:text-primary-600 font-medium transition-colors"
              >
                Create account
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  )
}
