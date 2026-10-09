import { useEffect } from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
  useEffect(() => {
    document.title = 'Page not found — Purchase Review'
  }, [])

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-blue-600">Page not found</h1>
      <Link to="/" className="mt-2 inline-block text-sm text-blue-600 hover:underline">
        Back to products
      </Link>
    </main>
  )
}

export default NotFound
