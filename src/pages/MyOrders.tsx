import { useEffect, useState } from 'react'
import { ApiRequestError, listMyOrders } from '../api'
import Pagination from '../components/Pagination'
import type { Order, Page } from '../types'

function MyOrders() {
  const [page, setPage] = useState(0)
  const [data, setData] = useState<Page<Order> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false
    document.title = 'My orders — Purchase Review'

    async function load() {
      setLoading(true)
      setError('')

      try {
        const result = await listMyOrders(page)
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
      <h1 className="text-2xl font-semibold text-blue-600">My orders</h1>

      {loading && <p className="mt-6 text-sm text-gray-600">Loading orders...</p>}

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}

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

          <Pagination page={page} first={data.first} last={data.last} onChange={setPage} />
        </>
      )}
    </main>
  )
}

export default MyOrders
