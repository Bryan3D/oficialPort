export default function PortfolioProjectPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight text-primary">
        Portfolio (Next.js)
      </h1>

      <p className="max-w-2xl text-muted">
        Clean minimal portfolio with theme mode, responsive navbar, and project pages.
      </p>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold text-primary">Highlights</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li>• Tailwind v4 theme tokens (background/foreground/secondary)</li>
          <li>• next-themes toggle with clean minimal UI</li>
          <li>• Projects grid and routing</li>
        </ul>
      </div>
    </section>
  );
}