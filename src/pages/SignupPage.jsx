import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const initialState = { username: "", email: "", password: "" }

export default function SignupPage() {
  const [form, setForm] = useState(initialState)
  const [message, setMessage] = useState(null)
  const { signup, isLoading } = useAuth()
  const navigate = useNavigate()

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage(null)
    try {
      await signup(form)
      navigate("/dashboard")
    } catch (err) {
      setMessage(err.message || "Unable to sign up")
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-16 md:grid-cols-2">
      <div>
        <p className="badge-pill inline-flex bg-white/5 px-4 py-1 text-sm text-text-muted">Create account</p>
        <h1 className="mt-4 text-4xl font-bold leading-tight">Level up your learning adventure</h1>
        <p className="mt-4 text-text-muted">
          Track progress, save results, and join the global leaderboard. TriviaTrek helps you stay motivated.
        </p>
        <ul className="mt-6 space-y-3 text-text-muted">
          {["Personalized dashboard", "Progress tracking", "Exclusive badges"].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="text-primary">•</span> {item}
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={handleSubmit} className="glass-dark rounded-3xl p-8">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-text-muted">Username</label>
            <input
              name="username"
              required
              value={form.username}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-border/60 bg-transparent px-4 py-3 text-white outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-sm text-text-muted">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-border/60 bg-transparent px-4 py-3 text-white outline-none focus:border-primary"
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
            />
          </div>
        </div>
        {message && <p className="mt-4 text-sm text-danger">{message}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 w-full rounded-2xl bg-primary py-3 font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
        >
          {isLoading ? "Creating account..." : "Sign up"}
        </button>
        <p className="mt-4 text-center text-sm text-text-muted">
          Already with us?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  )
}

