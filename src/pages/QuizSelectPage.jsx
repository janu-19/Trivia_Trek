import { useEffect, useMemo, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { ArrowRight, Target, TrendingUp, Award } from "lucide-react"
import api from "../lib/api"

export default function QuizSelectPage() {
  const [questions, setQuestions] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [difficulty, setDifficulty] = useState(searchParams.get("difficulty") || "easy")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "science")

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data } = await api.get("/questions")
      setQuestions(data)
    }
    fetchQuestions()
  }, [])

  const categories = useMemo(() => {
    const grouped = questions.reduce((acc, question) => {
      if (!acc[question.category]) {
        acc[question.category] = 0
      }
      acc[question.category] += 1
      return acc
    }, {})
    return Object.entries(grouped).map(([name, count]) => ({ name, count }))
  }, [questions])

  const difficultyLevels = [
    { level: "easy", label: "Easy", icon: "🟢", desc: "Perfect for beginners", points: "1x" },
    { level: "medium", label: "Medium", icon: "🟡", desc: "Challenge yourself", points: "2x" },
    { level: "hard", label: "Hard", icon: "🔴", desc: "Expert level", points: "3x" },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 dark:bg-primary/20 px-4 py-2 text-sm mb-4">
          <Target className="h-4 w-4 text-primary" />
          <span className="text-text-primary dark:text-text-primary-dark">Choose Your Challenge</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary dark:text-text-primary-dark mb-4">
          Select Your Quiz
        </h1>
        <p className="text-text-muted dark:text-text-muted-dark text-lg">
          Test your knowledge across {categories.length} categories
        </p>
      </div>

      {/* Difficulty Selection */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark mb-4">Difficulty Level</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {difficultyLevels.map((diff) => (
            <button
              key={diff.level}
              onClick={() => setDifficulty(diff.level)}
              className={`rounded-2xl border-2 p-6 text-left transition ${
                difficulty === diff.level
                  ? "border-primary bg-primary/10 dark:bg-primary/20 shadow-lg"
                  : "border-border dark:border-border-dark bg-surface dark:bg-surface-dark hover:border-primary/50"
              }`}
            >
              <div className="text-3xl mb-2">{diff.icon}</div>
              <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-1">
                {diff.label}
              </h3>
              <p className="text-sm text-text-muted dark:text-text-muted-dark mb-2">{diff.desc}</p>
              <p className="text-xs text-primary font-medium">Points: {diff.points}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark mb-4">Categories</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const quizUrl = `/quiz?category=${encodeURIComponent(cat.name)}&difficulty=${encodeURIComponent(difficulty)}`
            return (
              <Link
                key={cat.name}
                to={quizUrl}
                className="group rounded-2xl border-2 border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-6 transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark capitalize">
                    {cat.name.replace("-", " ")}
                  </h3>
                  <ArrowRight className="h-5 w-5 text-text-muted dark:text-text-muted-dark group-hover:text-primary group-hover:translate-x-1 transition" />
                </div>
                <p className="text-sm text-text-muted dark:text-text-muted-dark">
                  {cat.count} question{cat.count !== 1 ? "s" : ""} available
                </p>
                <div className="mt-4 flex items-center gap-2 text-primary text-sm font-medium">
                  Start Quiz <TrendingUp className="h-4 w-4" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Quick Start CTA */}
      {selectedCategory && (
        <div className="rounded-2xl border-2 border-primary bg-primary/5 dark:bg-primary/10 p-6 text-center">
          <Award className="h-8 w-8 text-primary mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark mb-2">
            Ready to Start?
          </h3>
          <p className="text-text-muted dark:text-text-muted-dark mb-4">
            10 questions from <span className="font-semibold capitalize">{selectedCategory.replace("-", " ")}</span> at{" "}
            <span className="font-semibold capitalize">{difficulty}</span> level
          </p>
          <Link
            to={`/quiz?category=${encodeURIComponent(selectedCategory)}&difficulty=${encodeURIComponent(difficulty)}`}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3 font-semibold text-white transition hover:bg-primary-dark shadow-lg"
          >
            Start Quiz Now <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      )}
    </div>
  )
}
