"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./mode-toggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
] as const;

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Brand */}
        <Link href="/" className="text-sm font-semibold tracking-tight text-primary">
          Bryan Quero
        </Link>

        {/* Links */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => {
              const active = pathname === l.href;

              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={[
                    "relative rounded-md px-3 py-2 text-sm transition-colors",
                    active ? "text-primary" : "text-muted hover:text-primary",
                  ].join(" ")}
                >
                  {l.label}

                  {/* Active underline */}
                  <span
                    className={[
                      "pointer-events-none absolute left-3 right-3 -bottom-[1px] h-[2px] rounded-full transition-opacity",
                      active ? "bg-secondary opacity-100" : "bg-secondary opacity-0",
                    ].join(" ")}
                  />
                </Link>
              );
            })}
          </div>

          {/* Theme toggle */}
          <ModeToggle />

          {/* Mobile: simple Contact shortcut */}
          <Link
            href="/contact"
            className="md:hidden text-secondary transition-opacity hover:opacity-80 text-sm px-2"
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}