import { useEffect, useMemo, useState } from "react"
import api from "../lib/api"

export default function LeaderboardPage() {
  const [entries, setEntries] = useState([])

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const [{ data: results }, { data: users }] = await Promise.all([api.get("/quizResults"), api.get("/users")])
      const ranked = results.reduce((acc, result) => {
        const user = users.find((u) => u.id === result.userId)
        if (!user) return acc
        if (!acc[user.id]) {
          acc[user.id] = { user, runs: [] }
        }
        acc[user.id].runs.push(result)
        return acc
      }, {})
      const list = Object.values(ranked).map(({ user, runs }) => {
        const totalScore = runs.reduce((sum, run) => sum + run.percentage, 0)
        return {
          id: user.id,
          username: user.username,
          bestScore: Math.max(...runs.map((run) => run.percentage)),
          avgScore: Math.round(totalScore / runs.length),
          runs: runs.length,
        }
      })
      setEntries(list.sort((a, b) => b.avgScore - a.avgScore).slice(0, 10))
    }
    fetchLeaderboard()
  }, [])

  const highlight = useMemo(() => (entries.length > 0 ? entries[0] : null), [entries])

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-12">
      <div className="text-center">
        <p className="badge-pill inline-flex bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-text-muted">
          Leaderboard
        </p>
        <h1 className="mt-4 text-4xl font-bold">Top explorers this week</h1>
        <p className="text-text-muted">Climb the leaderboard by achieving high accuracy.</p>
      </div>

      {highlight && (
        <div className="glass-dark rounded-3xl p-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-text-muted">Top player</p>
          <h2 className="mt-3 text-3xl font-bold">{highlight.username}</h2>
          <p className="mt-2 text-text-muted">Average score {highlight.avgScore}% across {highlight.runs} quizzes</p>
        </div>
      )}

      <div className="glass-dark rounded-3xl">
        <div className="grid grid-cols-4 gap-4 border-b border-border/60 px-6 py-4 text-xs uppercase tracking-wide text-text-muted">
          <span>Rank</span>
          <span>Player</span>
          <span className="text-center">Avg. score</span>
          <span className="text-right">Runs</span>
        </div>
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className="grid grid-cols-4 items-center gap-4 border-b border-border/30 px-6 py-4 text-sm last:border-none"
          >
            <span className="text-text-muted">#{index + 1}</span>
            <span className="font-semibold">{entry.username}</span>
            <span className="text-center">{entry.avgScore}%</span>
            <span className="text-right text-text-muted">{entry.runs}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

