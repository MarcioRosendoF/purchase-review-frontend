import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth'
import RequireAuth from './components/RequireAuth'
import Login from './pages/Login'
import MyOrders from './pages/MyOrders'
import ProductDetail from './pages/ProductDetail'
import Products from './pages/Products'
import Register from './pages/Register'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<RequireAuth />}>
            <Route path="/" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/orders/my" element={<MyOrders />} />
          </Route>
          <Route
            path="*"
            element={
              <main className="mx-auto max-w-2xl px-4 py-10">
                <h1 className="text-2xl font-semibold text-blue-600">Page not found</h1>
                <Link to="/" className="mt-2 inline-block text-sm text-blue-600 hover:underline">
                  Back to products
                </Link>
              </main>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
