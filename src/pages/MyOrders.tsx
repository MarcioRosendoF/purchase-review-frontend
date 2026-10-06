import { useEffect, useState } from 'react'
import { ApiRequestError, listMyOrders } from '../api'
import type { Order, Page } from '../types'

function MyOrders() {
  const [page, setPage] = useState(0)
  const [data, setData] = useState<Page<Order> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')

      try {
        const result = await listMyOrders(page)
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
      <h1 className="text-2xl font-semibold text-blue-600">My orders</h1>

      {loading && <p className="mt-6 text-sm text-gray-600">Loading orders...</p>}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {!loading && !error && data && (
        <>
          {data.empty ? (
            <p className="mt-6 text-sm text-gray-600">No orders yet.</p>
          ) : (
            <ul className="mt-6 flex flex-col gap-3">
              {data.content.map((order) => (
                <li key={order.id} className="rounded border border-gray-300 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900">{order.productName}</span>
                    <span className="text-gray-600">Quantity: {order.quantity}</span>
                  </div>

                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </li>
              ))}
            </ul>
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

export default MyOrders
