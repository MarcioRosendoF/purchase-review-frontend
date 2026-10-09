import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Render error:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="mx-auto max-w-2xl px-4 py-10">
          <h1 className="text-2xl font-semibold text-blue-600">Something went wrong</h1>
          <p className="mt-2 text-sm text-gray-600">This screen failed to render.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          >
            Reload
          </button>
        </main>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
