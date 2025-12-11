export default function StatCard({ label, value, icon: Icon, accent = "from-primary to-accent" }) {
  return (
    <div className="glass-dark flex flex-col gap-2 rounded-2xl p-5">
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${accent}`}>
        {Icon && <Icon className="h-6 w-6 text-white" />}
      </div>
      <p className="text-xs uppercase tracking-wide text-text-muted">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
}

