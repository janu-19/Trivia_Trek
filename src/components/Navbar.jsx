import { Link, NavLink } from "react-router-dom"
import { Brain, Moon, Sun } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useTheme } from "../contexts/ThemeContext"

const navItems = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard", private: true },
  { to: "/quiz-select", label: "Play" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/profile", label: "Profile", private: true },
  { to: "/admin", label: "Admin", private: true, adminOnly: true },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-30 border-b border-border dark:border-border-dark bg-background dark:bg-background-dark/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-text-primary dark:text-text-primary-dark">TriviaTrek</span>
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium">
          {navItems
            .filter((item) => {
              if (item.private && !user) return false
              if (item.adminOnly && user?.role !== "admin") return false
              return true
            })
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `transition-colors ${isActive ? "text-primary" : "text-text-muted dark:text-text-muted-dark hover:text-text-primary dark:hover:text-text-primary-dark"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
        </div>

        <div className="flex items-center gap-3 text-sm font-semibold">
          <button
            onClick={toggleTheme}
            className="rounded-xl border border-border dark:border-border-dark px-3 py-2 text-text-muted dark:text-text-muted-dark transition hover:border-primary hover:text-primary"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          {user ? (
            <>
              <span className="hidden sm:inline text-text-muted dark:text-text-muted-dark">Hi, {user.username}</span>
              <button
                onClick={logout}
                className="rounded-xl border border-border dark:border-border-dark px-4 py-2 text-text-muted dark:text-text-muted-dark transition hover:border-primary hover:text-primary"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-text-muted dark:text-text-muted-dark transition hover:text-primary">
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-xl bg-primary px-4 py-2 text-white transition hover:bg-primary-dark"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
