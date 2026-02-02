import Link from "next/link";

export type ProjectCardProps = {
  title: string;
  description: string;
  tags?: string[];
  href?: string; // internal link (recommended)
};

export default function ProjectCard({ title, description, tags = [], href }: ProjectCardProps) {
  const content = (
    <div className="rounded-xl border border-border bg-card p-6 transition-colors hover:bg-background">
      <h3 className="text-base font-semibold text-primary">{title}</h3>
      <p className="mt-2 text-sm text-muted">{description}</p>

      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-border px-3 py-1 text-xs text-muted"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}