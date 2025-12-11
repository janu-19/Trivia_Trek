import { Link, useNavigate } from "react-router-dom"
import { Brain, ChevronRight, Trophy, Users, Zap, ArrowRight } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

const categories = [
  { name: "Science", emoji: "🔬", slug: "science" },
  { name: "Sports", emoji: "⚽", slug: "sports" },
  { name: "Movies", emoji: "🎬", slug: "movies" },
  { name: "History", emoji: "📜", slug: "history" },
  { name: "Geography", emoji: "🌍", slug: "geography" },
  { name: "Technology", emoji: "💻", slug: "tech" },
  { name: "General Knowledge", emoji: "🧠", slug: "general knowledge" },
]

export default function HomePage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleStartNow = () => {
    if (user) {
      navigate("/quiz-select")
    } else {
      navigate("/login")
    }
  }

  return (
    <div className="space-y-20">
      {/* Hero Section - Improved */}
      <section className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 pt-14 md:flex-row md:items-center">
        <div className="relative z-10 space-y-6 md:flex-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 dark:bg-primary/20 px-4 py-2 text-sm">
            <span className="text-primary">✨</span>
            <span className="text-text-primary dark:text-text-primary-dark">200+ Curated Questions</span>
          </div>
          <h1 className="text-balance text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
            Master Knowledge with <span className="text-primary">TriviaTrek</span>
          </h1>
          <p className="text-lg text-text-muted dark:text-text-muted-dark max-w-xl">
            Challenge yourself across diverse categories. Track progress, build streaks, and compete on the leaderboard.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleStartNow}
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 font-semibold text-white transition hover:bg-primary-dark shadow-lg hover:shadow-xl"
            >
              {user ? "Start Playing" : "Get Started"} <ChevronRight className="h-5 w-5" />
            </button>
            <Link
              to="/quiz-select"
              className="inline-flex items-center rounded-2xl border-2 border-border dark:border-border-dark px-8 py-4 font-semibold text-text-primary dark:text-text-primary-dark transition hover:border-primary hover:text-primary"
            >
              Browse Quizzes
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-6">
            {[
              { label: "Questions", value: "1K+" },
              { label: "Players", value: "50K+" },
              { label: "Categories", value: "8" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-4 text-center">
                <p className="text-3xl font-bold text-text-primary dark:text-text-primary-dark">{item.value}</p>
                <p className="text-xs text-text-muted dark:text-text-muted-dark">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 md:flex-1">
          <div className="grid gap-4">
            <div className="rounded-3xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-primary/10 dark:bg-primary/20 p-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">Lightning Fast</h3>
                  <p className="text-sm text-text-muted dark:text-text-muted-dark">60-second questions keep you on your toes</p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-success/10 dark:bg-success/20 p-4">
                  <Trophy className="h-6 w-6 text-success" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">Earn Badges</h3>
                  <p className="text-sm text-text-muted dark:text-text-muted-dark">Unlock achievements as you progress</p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-accent/10 dark:bg-accent/20 p-4">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">Global Competition</h3>
                  <p className="text-sm text-text-muted dark:text-text-muted-dark">Climb the leaderboard ranks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary dark:text-text-primary-dark">Explore Categories</h2>
          <p className="mt-3 text-text-muted dark:text-text-muted-dark">Choose your challenge</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/quiz-select?category=${encodeURIComponent(cat.slug)}`}
              className="group rounded-3xl border-2 border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-6 transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
            >
              <div className="text-4xl transition group-hover:scale-110">{cat.emoji}</div>
              <p className="mt-4 text-lg font-semibold text-text-primary dark:text-text-primary-dark">{cat.name}</p>
              <p className="text-sm text-text-muted dark:text-text-muted-dark flex items-center gap-1 mt-2">
                Start quiz <ArrowRight className="h-4 w-4" />
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-4xl px-4 text-center">
        <div className="rounded-3xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-10 shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 mb-6">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-text-primary dark:text-text-primary-dark">Ready to begin?</h2>
          <p className="mt-3 text-text-muted dark:text-text-muted-dark">
            Join thousands of trivia adventurers and start your journey today.
          </p>
          <button
            onClick={handleStartNow}
            className="mt-8 inline-flex items-center justify-center rounded-2xl bg-primary px-10 py-4 text-lg font-semibold text-white transition hover:bg-primary-dark shadow-lg hover:shadow-xl"
          >
            {user ? "Start Playing" : "Get Started"} <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  )
}
