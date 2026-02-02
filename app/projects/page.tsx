import ProjectCard from "@/components/project-card";

export default function ProjectsPage() {
  const projects = [
    {
      title: "Portfolio (Next.js)",
      description: "Clean minimal portfolio with themes, responsive navbar, and project pages.",
      tags: ["Next.js", "Tailwind", "shadcn"],
      href: "/projects/portfolio",
    },
    {
      title: "Tools & Pipeline",
      description: "Automation helpers and workflow tools for 3D / real-time production.",
      tags: ["Pipeline", "Automation", "3D"],
      href: "/projects/tools",
    },
    {
      title: "XR / Interactive",
      description: "Prototypes and demos for immersive or interactive experiences.",
      tags: ["XR", "Unreal", "WebGL"],
      href: "/projects/xr",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-primary">Projects</h1>
          <p className="mt-2 max-w-2xl text-muted">
            A few highlighted builds — focused on clean UX and practical engineering.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((p) => (
          <ProjectCard key={p.title} {...p} />
        ))}
      </div>
    </section>
  );
}