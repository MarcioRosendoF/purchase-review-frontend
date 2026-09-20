import { useEffect, useState } from 'react'
import { ApiRequestError, listProducts } from '../api'
import ProductCard from '../components/ProductCard'
import type { Page, Product } from '../types'

function Products() {
  const [page, setPage] = useState(0)
  const [data, setData] = useState<Page<Product> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')

      try {
        const result = await listProducts(page)
        setData(result)
      } catch (err) {
        setError(err instanceof ApiRequestError ? err.message : 'Could not reach the API')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [page])

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-blue-600">Products</h1>

      {loading && <p className="mt-6 text-sm text-gray-600">Loading products...</p>}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {!loading && !error && data && (
        <>
          {data.empty ? (
            <p className="mt-6 text-sm text-gray-600">No products yet.</p>
          ) : (
            <div className="mt-6 flex flex-col gap-4">
              {data.content.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setPage((current) => current - 1)}
              disabled={data.first}
              className="rounded border border-gray-300 px-3 py-1 text-sm font-medium hover:bg-gray-100 disabled:opacity-50 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((current) => current + 1)}
              disabled={data.last}
              className="rounded border border-gray-300 px-3 py-1 text-sm font-medium hover:bg-gray-100 disabled:opacity-50 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  )
}

export default Products
