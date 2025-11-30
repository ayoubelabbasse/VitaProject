import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-text mb-2">Page Not Found</h2>
          <p className="text-muted">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full btn-primary py-3"
          >
            Go to homepage
          </Link>
          <Link
            href="/products"
            className="block w-full btn-secondary py-3"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  )
}

