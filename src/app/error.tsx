'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-primary mb-4">500</h1>
          <h2 className="text-2xl font-semibold text-text mb-2">Something went wrong!</h2>
          <p className="text-muted">
            {error.message || 'An unexpected error occurred'}
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full btn-primary py-3"
          >
            Try again
          </button>
          <Link
            href="/"
            className="block w-full btn-secondary py-3"
          >
            Go to homepage
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left bg-gray-50 p-4 rounded-lg">
            <summary className="cursor-pointer text-sm font-medium text-text mb-2">
              Error Details (Development Only)
            </summary>
            <pre className="text-xs text-red-600 overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}

