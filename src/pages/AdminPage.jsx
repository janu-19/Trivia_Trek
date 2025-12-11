import { useCallback, useEffect, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import api from "../lib/api"
import { useAuth } from "../contexts/AuthContext"

const initialForm = {
  category: "science",
  difficulty: "easy",
  question: "",
  options: ["", "", "", ""],
  correctAnswer: 0,
}

function AdminContent() {
  const [questions, setQuestions] = useState([])
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const { user } = useAuth()

  const refreshQuestions = useCallback(async () => {
    const { data } = await api.get("/questions")
    // Show all questions, newest first
    setQuestions(data.slice().reverse())
  }, [])

  useEffect(() => {
    let active = true
    const fetchInitial = async () => {
      const { data } = await api.get("/questions")
      if (active) {
        setQuestions(data.slice().reverse())
      }
    }
    fetchInitial()
    return () => {
      active = false
    }
  }, [])

  const handleFormChange = (event, index) => {
    if (typeof index === "number") {
      const nextOptions = [...form.options]
      nextOptions[index] = event.target.value
      setForm((prev) => ({ ...prev, options: nextOptions }))
    } else {
      const { name, value } = event.target
      setForm((prev) => ({
        ...prev,
        [name]: name === "correctAnswer" ? Number(value) : value,
      }))
    }
  }

  const validateForm = () => {
    if (!form.question.trim()) {
      return "Question text is required."
    }
    if (!Array.isArray(form.options) || form.options.length < 4) {
      return "Please provide 4 options."
    }
    const trimmedOptions = form.options.map((opt) => opt.trim())
    if (trimmedOptions.some((opt) => !opt)) {
      return "All options must be filled in."
    }
    if (
      typeof form.correctAnswer !== "number" ||
      Number.isNaN(form.correctAnswer) ||
      form.correctAnswer < 0 ||
      form.correctAnswer >= trimmedOptions.length
    ) {
      return "Correct answer index must be between 0 and 3."
    }

    return null
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus(null)

    if (!user) {
      setStatus("You must be logged in to manage questions.")
      return
    }

    const validationError = validateForm()
    if (validationError) {
      setStatus(validationError)
      return
    }

    try {
      if (editingId) {
        const existing = questions.find((q) => q.id === editingId)
        // Only allow editing own questions if author info is present
        if (existing?.authorId && existing.authorId !== user.id) {
          setStatus("You can only edit questions you created.")
          return
        }

        await api.put(`/questions/${editingId}`, {
          ...form,
          authorId: existing?.authorId ?? user.id,
          authorName: existing?.authorName ?? user.username,
        })
        setStatus("Question updated!")
      } else {
        await api.post("/questions", {
          ...form,
          authorId: user.id,
          authorName: user.username,
        })
        setStatus("Question saved!")
      }
      setForm(initialForm)
      setEditingId(null)
      refreshQuestions()
    } catch {
      setStatus(editingId ? "Unable to update question" : "Unable to save question")
    }
  }

  const handleEdit = (question) => {
    setForm({
      category: question.category,
      difficulty: question.difficulty,
      question: question.question,
      options: question.options ?? ["", "", "", ""],
      correctAnswer:
        typeof question.correctAnswer === "number" ? question.correctAnswer : 0,
    })
    setEditingId(question.id)
    setStatus(null)
  }

  const handleCancelEdit = () => {
    setForm(initialForm)
    setEditingId(null)
    setStatus(null)
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this question?")
    if (!confirmed) return

    setStatus(null)
    try {
      const existing = questions.find((q) => q.id === id)
      if (existing?.authorId && existing.authorId !== user?.id) {
        setStatus("You can only delete questions you created.")
        return
      }

      await api.delete(`/questions/${id}`)
      setStatus("Question deleted.")
      refreshQuestions()
      if (editingId === id) {
        setForm(initialForm)
        setEditingId(null)
      }
    } catch {
      setStatus("Unable to delete question")
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-12">
      <div className="text-center">
        <p className="badge-pill inline-flex bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-text-muted">
          Admin panel
        </p>
        <h1 className="mt-4 text-4xl font-bold">Manage question bank</h1>
      </div>

      <form onSubmit={handleSubmit} className="glass-dark rounded-3xl p-8 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">
            {editingId ? "Edit question" : "Add new question"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-xs rounded-2xl border border-border/60 px-3 py-1 text-text-muted hover:border-primary hover:text-white"
            >
              Cancel edit
            </button>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase text-text-muted">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleFormChange}
              className="mt-1 w-full rounded-2xl border border-border/60 bg-surface px-4 py-3 text-sm capitalize"
            >
              {["science", "history", "geography", "tech", "sports", "movies", "general knowledge"].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase text-text-muted">Difficulty</label>
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleFormChange}
              className="mt-1 w-full rounded-2xl border border-border/60 bg-surface px-4 py-3 text-sm capitalize"
            >
              {["easy", "medium", "hard"].map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs uppercase text-text-muted">Question</label>
          <textarea
            name="question"
            value={form.question}
            onChange={handleFormChange}
            required
            className="mt-1 w-full rounded-2xl border border-border/60 bg-transparent px-4 py-3 text-sm"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {form.options.map((option, index) => (
            <input
              key={index}
              value={option}
              onChange={(event) => handleFormChange(event, index)}
              placeholder={`Option ${index + 1}`}
              className="rounded-2xl border border-border/60 bg-transparent px-4 py-3 text-sm"
            />
          ))}
        </div>
        <div>
          <label className="text-xs uppercase text-text-muted">Correct answer index (0-3)</label>
          <input
            type="number"
            min="0"
            max="3"
            name="correctAnswer"
            value={form.correctAnswer}
            onChange={handleFormChange}
            className="mt-1 w-24 rounded-2xl border border-border/60 bg-transparent px-4 py-2 text-sm"
          />
        </div>
        {status && <p className="text-sm text-primary">{status}</p>}
        <button type="submit" className="w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-white">
          {editingId ? "Update question" : "Save question"}
        </button>
      </form>

      <div className="glass-dark rounded-3xl p-6">
        <h2 className="text-2xl font-semibold">Question bank</h2>
        <p className="mt-1 text-sm text-text-muted">
          Edit or delete questions. Showing up to the 20 most recent entries.
        </p>
        <div className="mt-4 space-y-4 text-sm">
          {questions.map((question) => (
            <div key={question.id} className="rounded-2xl border border-border/40 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{question.question}</p>
                  <p className="text-text-muted">
                    {question.category} · {question.difficulty}
                  </p>
                  <p className="text-xs text-text-muted">
                    Author:{" "}
                    <span className="font-medium">
                      {question.authorName ?? "System"}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(question)}
                    className="rounded-2xl border border-border/60 px-3 py-1 text-xs font-medium text-text-muted hover:border-primary hover:text-white"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(question.id)}
                    className="rounded-2xl border border-danger/60 px-3 py-1 text-xs font-medium text-danger hover:bg-danger/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {questions.length === 0 && (
            <p className="py-4 text-center text-text-muted">No questions found. Add your first one above.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />
  }

  return <AdminContent />
}
