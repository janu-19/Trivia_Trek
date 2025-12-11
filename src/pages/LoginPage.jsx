import { useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const initialState = { email: "", password: "" }

export default function LoginPage() {
  const [form, setForm] = useState(initialState)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoading } = useAuth()

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage(null)
    try {
      await login(form)
      const from = location.state?.from
      const redirectTo = from ? `${from.pathname}${from.search || ""}` : "/dashboard"
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setMessage(err.message || "Unable to login")
    }
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-12 px-4 py-16 lg:flex-row">
      <div className="flex-1">
        <p className="badge-pill inline-flex bg-white/5 px-4 py-1 text-sm text-text-muted">Welcome back</p>
        <h1 className="mt-4 text-4xl font-bold">Sign in to continue your journey</h1>
        <p className="mt-4 text-text-muted">
          Track your progress, unlock badges, and compete with the community. Keep leveling up!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-dark flex-1 rounded-3xl p-8 shadow-2xl">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-text-muted">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-border/60 bg-transparent px-4 py-3 text-white outline-none focus:border-primary"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm text-text-muted">Password</label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-border/60 bg-transparent px-4 py-3 text-white outline-none focus:border-primary"
              placeholder="••••••••"
            />
          </div>
        </div>
        {message && <p className="mt-4 text-sm text-danger">{message}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 w-full rounded-2xl bg-primary py-3 font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
        >
          {isLoading ? "Signing in..." : "Continue"}
        </button>
        <p className="mt-4 text-center text-sm text-text-muted">
          No account yet?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Create one now
          </Link>
        </p>
      </form>
    </div>
  )
}

