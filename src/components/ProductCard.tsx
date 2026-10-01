import { Link } from 'react-router-dom'
import type { Product } from '../types'

const priceFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="block rounded border border-gray-300 p-4 hover:bg-gray-50 focus:ring-2 focus:ring-blue-600 focus:outline-none"
    >
      <h2 className="font-semibold text-gray-900">{product.name}</h2>
      {product.description && <p className="mt-1 text-sm text-gray-600">{product.description}</p>}
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="font-medium text-gray-900">{priceFormatter.format(product.price)}</span>
        <span className="text-gray-600">
          {product.reviewCount === 0
            ? 'No reviews yet'
            : `${product.averageRating.toFixed(1)} (${product.reviewCount} ${product.reviewCount === 1 ? 'review' : 'reviews'})`}
        </span>
      </div>
    </Link>
  )
}

export default ProductCard
