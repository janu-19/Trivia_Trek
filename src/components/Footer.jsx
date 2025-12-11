export default function Footer() {
  return (
    <footer className="border-t border-border/30 bg-surface/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-text-muted md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-white">TriviaTrek</p>
          <p className="text-xs text-text-muted/80">© {new Date().getFullYear()} TriviaTrek. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {["About", "Blog", "Support", "Privacy"].map((item) => (
            <a key={item} href="#" className="transition hover:text-white">
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

