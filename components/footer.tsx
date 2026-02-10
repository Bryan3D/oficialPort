"use client";

import Link from "next/link";
import { Github, Linkedin } from "lucide-react";

function Dot() {
  return <span className="hidden sm:inline text-muted/40">·</span>;
}

export default function Footer() {
  const date = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between">
        {/* Left */}
        <div className="text-sm text-foreground/70">
          <span className="text-foreground">Bryan Quero</span>
          <span className="mx-2 text-foreground/30">·</span>
          {date}
        </div>

        {/* Right */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          {/* Back to top */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-muted hover:text-primary transition-colors"
          >
            Back to top
          </button>

          <Dot />

          {/* Resume */}
          <a
            href="/Bryan_Alec_Quero_2-10-26.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-primary transition-colors"
          >
            Resume
          </a>

          <Dot />

          {/* GitHub (icon-only on mobile, icon+text on desktop) */}
          <a
            href="https://github.com/Bryan3D"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors"
            aria-label="GitHub"
            title="GitHub"
          >
            <Github className="h-4 w-4 opacity-80" />
            <span className="hidden sm:inline">GitHub</span>
          </a>

          <Dot />

          {/* LinkedIn (icon-only on mobile, icon+text on desktop) */}
          <a
            href="https://www.linkedin.com/in/bryanquero/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <Linkedin className="h-4 w-4 opacity-80" />
            <span className="hidden sm:inline">LinkedIn</span>
          </a>

          <Dot />

          {/* Contact (accent) */}
          <Link
            href="/contact"
            className="text-secondary hover:opacity-80 transition-opacity"
          >
            Contact
          </Link>
        </div>
      </div>

      {/* extra subtle bottom fade line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent opacity-70" />
    </footer>
  );
}
