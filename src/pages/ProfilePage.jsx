import { useEffect, useState } from "react"
import { Calendar, Mail, Medal, User } from "lucide-react"
import api from "../lib/api"
import { useAuth } from "../contexts/AuthContext"
import ProtectedRoute from "../components/ProtectedRoute"

function ProfileContent() {
  const { user } = useAuth()
  const [badgeDetails, setBadgeDetails] = useState([])

  useEffect(() => {
    const loadBadges = async () => {
      const { data } = await api.get("/badges")
      setBadgeDetails(data.filter((badge) => user?.badges?.includes(badge.id)))
    }
    loadBadges()
  }, [user])

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-12">
      <div className="glass-dark rounded-3xl p-8">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/30 text-3xl">
            <User className="h-10 w-10 text-primary" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-text-muted">Explorer profile</p>
            <h1 className="text-4xl font-bold">{user?.username}</h1>
            <p className="text-text-muted">{user?.email}</p>
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border/40 p-4 text-sm text-text-muted">
            <Mail className="mb-2 h-5 w-5 text-primary" />
            {user?.email}
          </div>
          <div className="rounded-2xl border border-border/40 p-4 text-sm text-text-muted">
            <Calendar className="mb-2 h-5 w-5 text-primary" />
            Joined {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : "Not provided"}
          </div>
        </div>
      </div>

      <div className="glass-dark rounded-3xl p-8">
        <h2 className="text-2xl font-semibold">Badges</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {badgeDetails.length === 0 && <p className="text-text-muted">No badges earned yet.</p>}
          {badgeDetails.map((badge) => (
            <div key={badge.id} className="rounded-2xl border border-border/50 p-4">
              <div className="text-3xl">{badge.icon}</div>
              <p className="mt-2 font-semibold">{badge.name}</p>
              <p className="text-sm text-text-muted">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}

