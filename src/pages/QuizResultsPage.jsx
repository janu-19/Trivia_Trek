import { useEffect, useState } from "react"
import { useLocation, Link } from "react-router-dom"
import { Download, Share2, RefreshCw, Trophy } from "lucide-react"
import api from "../lib/api"

export default function QuizResultsPage() {
  const location = useLocation()
  const [results, setResults] = useState([])

  const summary = location.state
  const answerHistory = summary?.answerHistory ?? []

  useEffect(() => {
    const fetchResults = async () => {
      const { data } = await api.get("/quizResults", { params: { _sort: "completedAt", _order: "desc", _limit: 8 } })
      setResults(data)
    }
    fetchResults()
  }, [])

  const handleDownload = () => {
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "TriviaTrek Quiz Result",
          text: `I just scored ${summary?.percentage ?? 0}% on a TriviaTrek quiz!`,
          url: window.location.origin,
        })
      } catch {
      }
    } else {
      navigator.clipboard?.writeText(`I just scored ${summary?.percentage ?? 0}% on TriviaTrek!`)
      alert("Result copied to clipboard!")
    }
  }

  if (!summary) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-text-muted">No quiz summary found. Play a quiz to see your performance here.</p>
        <Link to="/quiz-select" className="mt-4 inline-flex rounded-2xl bg-primary px-6 py-3 font-semibold text-white">
          Go to quiz select
        </Link>
      </div>
    )
  }

  const incorrect = Math.max(summary.total - summary.score, 0)

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-12">
      <div className="glass-dark rounded-3xl p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 text-primary">
          <Trophy className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-4xl font-bold">Quiz Complete!</h1>
        <p className="text-text-muted capitalize">
          {summary.category} · {summary.difficulty} level
        </p>
        <div className="mx-auto mt-8 flex h-48 w-48 flex-col items-center justify-center rounded-full border-4 border-primary/40 bg-surface shadow-[0_10px_40px_rgba(15,23,42,0.7)]">
          <span className="text-5xl font-bold text-primary">{summary.percentage}%</span>
          <span className="text-sm text-text-muted">
            {summary.score}/{summary.total} Correct
          </span>
        </div>
        <p className="mt-6 text-lg font-semibold text-white">Keep Learning! You'll Get Better!</p>
        <div className="mt-8 grid gap-6 text-center md:grid-cols-3">
          <div>
            <p className="text-sm uppercase text-text-muted">Correct</p>
            <p className="text-3xl font-bold text-success">{summary.score}</p>
          </div>
          <div>
            <p className="text-sm uppercase text-text-muted">Incorrect</p>
            <p className="text-3xl font-bold text-danger">{incorrect}</p>
          </div>
          <div>
            <p className="text-sm uppercase text-text-muted">Accuracy</p>
            <p className="text-3xl font-bold text-white">{summary.percentage}%</p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-2xl border border-border/60 px-6 py-3 text-sm font-semibold text-white transition hover:border-primary"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-2xl border border-border/60 px-6 py-3 text-sm font-semibold text-white transition hover:border-primary"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
          <Link
            to={`/quiz?category=${summary.category}&difficulty=${summary.difficulty}`}
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            <RefreshCw className="h-4 w-4" />
            Retake Quiz
          </Link>
        </div>
        <Link to="/dashboard" className="mt-6 inline-block text-sm text-primary hover:underline">
          ← Return to dashboard
        </Link>
      </div>

      {answerHistory.length > 0 && (
        <div className="glass-dark rounded-3xl p-6">
          <h2 className="text-2xl font-semibold">Review your answers</h2>
          <p className="mt-1 text-sm text-text-muted">
            See which questions you got right and where you can improve.
          </p>
          <div className="mt-6 space-y-4 text-left text-sm">
            {answerHistory.map((item, index) => {
              const userAnswered = item.selectedIndex !== -1
              const userAnswer =
                userAnswered && item.options[item.selectedIndex]
                  ? item.options[item.selectedIndex]
                  : "No answer (timed out)"
              const correctAnswer = item.options[item.correctAnswerIndex]
              const isCorrect = item.isCorrect

              return (
                <div
                  key={item.id ?? index}
                  className="rounded-2xl border border-border/60 bg-surface px-4 py-4"
                >
                  <p className="text-xs uppercase tracking-[0.25em] text-text-muted">
                    Question {index + 1}
                  </p>
                  <p className="mt-1 text-base font-semibold text-text-primary">
                    {item.questionText}
                  </p>
                  <div className="mt-3 space-y-1">
                    <p className="flex items-center gap-2">
                      <span
                        className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                          isCorrect ? "bg-success text-background" : "bg-danger text-background"
                        }`}
                      >
                        {isCorrect ? "✔" : "✖"}
                      </span>
                      <span className="text-text-muted">
                        Your answer:{" "}
                        <span className="font-medium text-text-primary">{userAnswer}</span>
                      </span>
                    </p>
                    <p className="text-text-muted">
                      Correct answer:{" "}
                      <span className="font-medium text-success">{correctAnswer}</span>
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="glass-dark rounded-3xl p-6">
        <h2 className="text-2xl font-semibold">Recent community runs</h2>
        <div className="mt-4 divide-y divide-border/60">
          {results.map((result) => (
            <div key={result.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
              <p className="capitalize text-white">
                {result.category} · {result.difficulty}
              </p>
              <p className="text-text-muted">{new Date(result.completedAt).toLocaleDateString()}</p>
              <span className="rounded-full bg-white/10 px-4 py-1 font-semibold text-white">
                {result.score}/{result.total} ({result.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

