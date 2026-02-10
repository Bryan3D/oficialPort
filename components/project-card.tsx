// components/project-card.tsx
import Image from "next/image";
import Link from "next/link";

type ProjectCardProps = {
  title: string;
  Image?: string;
  description: string;
  tags: string[];
  href: string;
};

export default function ProjectCard({
  title,
  Image: img,
  description,
  tags,
  href,
}: ProjectCardProps) {
  const uniqueTags = Array.from(new Set(tags));

  return (
  <Link
    href={href}
    className="group block rounded-2xl border bg-card p-6 transition hover:bg-accent/20"
  >
    <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
      {/* LEFT SIDE (text + tags) */}
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {uniqueTags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-border/60 bg-background/30 px-3 py-1 text-xs text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE (image badge) */}
      {img ? (
        <div className="justify-self-end md:pt-1">
          <div className="relative rounded-2xl border border-border/60 bg-background/30 p-3 shadow-sm backdrop-blur">
            {/* glow */}
            <div className="pointer-events-none absolute -inset-6 opacity-0 blur-2xl transition group-hover:opacity-100">
              <div className="h-full w-full rounded-full bg-primary/20" />
            </div>

            {/* inner highlight */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10" />

            <Image
              src={img}
              alt=""
              width={96}
              height={96}
              className="relative z-10 h-20 w-20 object-contain opacity-90 transition group-hover:opacity-100"
            />
          </div>
        </div>
      ) : null}
    </div>
  </Link>
);

}
