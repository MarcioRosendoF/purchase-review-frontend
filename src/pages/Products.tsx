import { useEffect, useState } from 'react'
import { ApiRequestError, listProducts } from '../api'
import Pagination from '../components/Pagination'
import ProductCard from '../components/ProductCard'
import type { Page, Product } from '../types'

function Products() {
  const [page, setPage] = useState(0)
  const [data, setData] = useState<Page<Product> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function load() {
      setLoading(true)
      setError('')

      try {
        const result = await listProducts(page)
        if (ignore) return
        setData(result)
      } catch (err) {
        if (ignore) return
        setError(err instanceof ApiRequestError ? err.message : 'Could not reach the API')
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [page])

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-blue-600">Products</h1>

      {loading && <p className="mt-6 text-sm text-gray-600">Loading products...</p>}

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}

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

          <Pagination page={page} first={data.first} last={data.last} onChange={setPage} />
        </>
      )}
    </main>
  )
}

export default Products
