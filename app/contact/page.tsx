export default function ContactPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight text-primary">Contact</h1>

      <p className="max-w-2xl text-muted">
        Want to collaborate or hire me? Send a message and I’ll get back to you.
      </p>

      <div className="rounded-xl border border-border bg-card p-6">
        <form className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm text-primary" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none"
              placeholder="Your name"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-primary" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none"
              placeholder="you@email.com"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-primary" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              className="min-h-[120px] rounded-md border border-border bg-background p-3 text-sm outline-none"
              placeholder="Tell me about your project..."
            />
          </div>

          <button
            type="button"
            className="rounded-md bg-secondary px-4 py-2 text-sm text-white"
          >
            Send (hook up later)
          </button>

          <p className="text-xs text-muted">
            Tip: Later we can connect this to email (Resend), Formspree, or a custom API route.
          </p>
        </form>
      </div>
    </section>
  );
}