import { useEffect, useState } from "react"
import { Activity, Award, BookOpenCheck, Flame } from "lucide-react"
import StatCard from "../components/StatCard"
import api from "../lib/api"
import { useAuth } from "../contexts/AuthContext"

export default function DashboardPage() {
  const { user } = useAuth()
  const [recentResults, setRecentResults] = useState([])
  const [badges, setBadges] = useState([])

  useEffect(() => {
    const loadData = async () => {
      const [{ data: results }, { data: allBadges }] = await Promise.all([
        api.get("/quizResults", { params: { userId: user?.id, _sort: "completedAt", _order: "desc", _limit: 5 } }),
        api.get("/badges"),
      ])
      setRecentResults(results)
      setBadges(allBadges.filter((badge) => user?.badges?.includes(badge.id)))
    }
    if (user?.id) {
      loadData()
    }
  }, [user])

  const stats = [
    { label: "Quizzes completed", value: user?.stats?.totalQuizzes ?? 0, icon: Activity },
    { label: "Best score", value: `${user?.stats?.bestScore ?? 0}%`, icon: Flame, accent: "from-accent to-primary" },
    { label: "Correct answers", value: user?.stats?.correctAnswers ?? 0, icon: BookOpenCheck, accent: "from-success to-primary" },
    {
      label: "Accuracy",
      value: `${Math.round(((user?.stats?.correctAnswers ?? 0) / Math.max(user?.stats?.totalAnswers ?? 1, 1)) * 100)}%`,
      icon: Award,
      accent: "from-warning to-accent",
    },
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-text-muted">Welcome back</p>
        <h1 className="text-4xl font-bold">Hey {user?.username}, keep the streak alive!</h1>
        <p className="text-text-muted">Continue your learning journey and unlock new badges.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </div>

      <div className="glass-dark rounded-3xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Recent results</h2>
            <p className="text-sm text-text-muted">Latest five quizzes you completed</p>
          </div>
          <a href="/quiz-results" className="text-sm text-primary">
            View all
          </a>
        </div>
        <div className="mt-6 divide-y divide-border/50">
          {recentResults.length === 0 && (
            <p className="py-6 text-center text-sm text-text-muted">No quizzes played yet. Start your first now!</p>
          )}
          {recentResults.map((result) => (
            <div key={result.id} className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm">
              <div>
                <p className="font-semibold capitalize text-white">
                  {result.category} · {result.difficulty}
                </p>
                <p className="text-text-muted">{new Date(result.completedAt).toLocaleDateString()}</p>
              </div>
              <span className="rounded-full bg-white/10 px-4 py-1 font-semibold text-white">
                {result.score}/{result.total} ({result.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-dark rounded-3xl p-6">
        <h2 className="text-2xl font-semibold">Unlocked badges</h2>
        <p className="text-sm text-text-muted">Collect them all by exploring new categories.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {badges.length === 0 && <p className="text-sm text-text-muted">No badges yet. Complete your first quiz!</p>}
          {badges.map((badge) => (
            <div key={badge.id} className="rounded-2xl border border-border/60 p-4">
              <div className="text-3xl">{badge.icon}</div>
              <p className="mt-3 font-semibold">{badge.name}</p>
              <p className="text-sm text-text-muted">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

