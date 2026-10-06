import { Link } from 'react-router-dom'
import { useAuth } from '../auth'

function NavBar() {
  const { user, logout } = useAuth()

  if (!user) {
    return null
  }

  return (
    <header className="border-b border-gray-200">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-blue-600">Purchase Review</span>
          <nav className="flex items-center gap-4 text-sm font-medium text-gray-700">
            <Link to="/" className="hover:text-blue-600">
              Products
            </Link>
            <Link to="/orders/my" className="hover:text-blue-600">
              My orders
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">{user.email}</span>
          <button
            type="button"
            onClick={logout}
            className="rounded border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}

export default NavBar
