import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiRequestError } from '../api'
import { useAuth } from '../auth'

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/
const MIN_PASSWORD_LENGTH = 6

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!name.trim()) {
      setError('Name is required.')
      return
    }
    if (!EMAIL_PATTERN.test(email)) {
      setError('Enter a valid email address.')
      return
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError('Password must be at least 6 characters.')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      await register(name.trim(), email, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not reach the API')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-semibold text-blue-600">Purchase Review</h1>
      <p className="mt-1 text-sm text-gray-600">Create an account to buy and review products.</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Name
          <input
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Email
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Password
          <input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </label>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
    </main>
  )
}

export default Register
