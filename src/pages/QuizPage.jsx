import { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { X } from "lucide-react"
import api from "../lib/api"
import { useAuth } from "../contexts/AuthContext"

export default function QuizPage() {
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState({ loading: true, error: null })
  const category = searchParams.get("category") || "science"
  const difficulty = searchParams.get("difficulty") || "easy"
  const difficultyLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const [timeLeft, setTimeLeft] = useState(60)
  const [showExitConfirm, setShowExitConfirm] = useState(false)

  const handleExitQuiz = () => {
    if (window.confirm("Are you sure you want to exit? Your progress will not be saved.")) {
      navigate("/quiz-select")
    }
  }

  useEffect(() => {
    const load = async () => {
      setStatus({ loading: true, error: null })
      try {
        const { data } = await api.get("/questions", {
          params: { category, difficulty },
        })
        setQuestions(data.slice(0, 10))
      } catch {
        setStatus({ loading: false, error: "Unable to load questions" })
        return
      }
      setStatus({ loading: false, error: null })
    }
    load()
  }, [category, difficulty])

  // Reset timer whenever the current question changes
  useEffect(() => {
    if (!questions.length) return

    setTimeLeft(60)
    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId)
          // Auto move to next question or finish quiz when timer hits zero.
          // Unanswered questions will be recorded with selectedIndex -1 in finishQuiz.
          if (current < questions.length - 1) {
            setCurrent((prevIndex) => prevIndex + 1)
          } else {
            finishQuiz()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(intervalId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, questions.length])

  const handleSelect = (index) => {
    const question = questions[current]
    if (!question) return

    // Lock options after first answer for this question
    if (typeof answers[current]?.selected === "number") {
      return
    }

    setAnswers((prev) => ({
      ...prev,
      [current]: {
        selected: index,
        isCorrect: index === question.correctAnswer,
      },
    }))
  }

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((prev) => prev + 1)
    } else {
      finishQuiz()
    }
  }

  const handlePrev = () => {
    setCurrent((prev) => Math.max(prev - 1, 0))
  }

  const score = useMemo(() => {
    return Object.values(answers).reduce((total, answer) => {
      if (answer?.isCorrect) {
        return total + 1
      }
      return total
    }, 0)
  }, [answers])

  const answeredCount = useMemo(() => Object.values(answers).filter(Boolean).length, [answers])
  const accuracy = questions.length ? Math.round((score / questions.length) * 100) : 0

  const finishQuiz = async () => {
    // Build detailed answer history for review page
    const answerHistory = questions.map((q, index) => {
      const state = answers[index]
      const selectedIndex = typeof state?.selected === "number" ? state.selected : -1
      const isCorrect = selectedIndex === q.correctAnswer

      return {
        id: q.id,
        questionText: q.question,
        options: q.options,
        correctAnswerIndex: q.correctAnswer,
        selectedIndex,
        isCorrect,
      }
    })

    const summary = {
      userId: user?.id ?? null,
      category,
      difficulty,
      score,
      total: questions.length,
      percentage: questions.length ? Math.round((score / questions.length) * 100) : 0,
      completedAt: new Date().toISOString(),
    }

    // Update user stats for dashboard if logged in
    if (user && updateUser) {
      const prevStats = user.stats ?? {
        totalQuizzes: 0,
        bestScore: 0,
        correctAnswers: 0,
        totalAnswers: 0,
      }
      const nextStats = {
        totalQuizzes: prevStats.totalQuizzes + 1,
        bestScore: Math.max(prevStats.bestScore ?? 0, summary.percentage),
        correctAnswers: prevStats.correctAnswers + summary.score,
        totalAnswers: prevStats.totalAnswers + summary.total,
      }

      try {
        await updateUser({ stats: nextStats })
      } catch {
        // non-blocking for quiz flow
      }
    }

    try {
      await api.post("/quizResults", summary)
    } catch {
      // non-blocking
    }
    navigate("/quiz-results", { state: { ...summary, answerHistory } })
  }

  if (status.loading) {
    return <p className="px-4 py-12 text-center text-text-muted">Loading quiz…</p>
  }

  if (status.error) {
    return <p className="px-4 py-12 text-center text-danger">{status.error}</p>
  }

  const question = questions[current]
  const currentState = answers[current]
  const showFeedback = typeof currentState?.selected === "number"
  const isCurrentCorrect = currentState?.isCorrect

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleExitQuiz}
          className="flex items-center gap-2 rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark px-4 py-2 text-sm text-text-muted dark:text-text-muted-dark hover:text-danger transition"
        >
          <X className="h-4 w-4" />
          Exit Quiz
        </button>
      </div>
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="rounded-3xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-8 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-text-muted">Quiz in progress</p>
              <h1 className="text-3xl font-bold capitalize">
                {category} · {difficulty}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="rounded-full bg-white/10 px-4 py-1 text-sm">
                Question {current + 1}/{questions.length}
              </p>
              <p
                className={`rounded-full px-4 py-1 text-sm font-semibold ${
                  timeLeft <= 10 ? "bg-danger/20 text-danger" : "bg-accent/20 text-accent"
                }`}
              >
                Time left: {timeLeft}s
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <p className="text-sm uppercase text-text-muted">{difficultyLabel} Difficulty</p>
              <p className="mt-2 text-2xl font-semibold">{question?.question}</p>
            </div>
            <div className="space-y-4">
              {question?.options?.map((option, index) => {
                const isSelected = currentState?.selected === index
                const isCorrectOption = question.correctAnswer === index
                const optionLetter = String.fromCharCode(65 + index)

                let optionClasses = "border-border/60 text-text-muted"
                if (showFeedback && isCorrectOption) {
                  optionClasses = "border-success/60 bg-success/10 text-white"
                } else if (isSelected) {
                  optionClasses = currentState?.isCorrect
                    ? "border-success/60 bg-success/10 text-white"
                    : "border-danger/60 bg-danger/10 text-white"
                }

                return (
                  <button
                    key={option}
                    onClick={() => handleSelect(index)}
                    className={`flex w-full items-center rounded-2xl border px-5 py-4 text-left transition ${optionClasses}`}
                  >
                    <span
                      className={`mr-4 flex h-10 w-10 items-center justify-center rounded-full border ${
                        isSelected ? "border-white/60" : "border-border/60"
                      } font-semibold`}
                    >
                      {optionLetter}
                    </span>
                    <span className="text-base font-semibold">{option}</span>
                  </button>
                )
              })}
            </div>
            {showFeedback && (
              <div
                className={`rounded-2xl border px-4 py-3 text-sm ${
                  isCurrentCorrect ? "border-success/70 text-success" : "border-danger/70 text-danger"
                }`}
              >
                {isCurrentCorrect
                  ? "Correct answer! Keep the streak going."
                  : `Incorrect. Correct answer: ${question.options[question.correctAnswer]}`}
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap justify-between gap-3">
            <button
              onClick={handlePrev}
              disabled={current === 0}
              className="rounded-2xl border border-border/60 px-6 py-3 text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white"
            >
              {current === questions.length - 1 ? "Finish quiz" : "Next"}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-dark rounded-3xl p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-text-muted">Live score</p>
            <h2 className="mt-2 text-3xl font-bold">{score}/{questions.length}</h2>
            <p className="text-text-muted">Accuracy {accuracy}%</p>
            <div className="mt-6 grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <p className="text-2xl font-bold text-success">{score}</p>
                <p className="text-text-muted">Correct</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-danger">{answeredCount - score}</p>
                <p className="text-text-muted">Incorrect</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{answeredCount}</p>
                <p className="text-text-muted">Answered</p>
              </div>
            </div>
          </div>

          <div className="glass-dark rounded-3xl p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-text-muted">Question navigator</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {questions.map((_, index) => {
                const state = answers[index]
                const isCurrent = index === current
                const answered = typeof state?.selected === "number"
                const correct = state?.isCorrect

                let btnClasses = "border-border/40 text-text-muted"
                if (isCurrent) {
                  btnClasses = "bg-primary text-white border-primary"
                } else if (answered && correct) {
                  btnClasses = "border-success/70 text-success"
                } else if (answered && !correct) {
                  btnClasses = "border-danger/70 text-danger"
                }

                return (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition ${btnClasses}`}
                  >
                    {index + 1}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

