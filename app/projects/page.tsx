// app/projects/page.tsx
import ProjectCard from "@/components/project-card";

type Project = {
  title: string;
  Image?: string;
  description: string;
  tags: string[];
  href: string;
};

export default function ProjectsPage() {
  const projects: Project[] = [
    {
      title: "Sofware Developer Portfolio",
      Image: "/software-engineer.png",
      description: "Comming Soon",
      tags: [
        "Next.js",
        "Tailwind",
        "shadcn",
        "TypeScript",
        "React",
        "Node.js",
        "CSS",
        "Tailwind",
        "WebGL",
        "Python",
        "C#",
        "JavaScript",
        "ThreeJS",
      ],
      href: "/projects/portfolio",
    },
    {
      title: "VR | AR, 3D and Game Tools & Pipeline",
      Image: "/vr.png",
      description: "Comming Soon",
      tags: [
        "Pipeline",
        "Automation",
        "3D",
        "Scripting",
        "Unreal",
        "Blender",
        "Unity",
        "C++",
        "Python",
        "C#",
        "JavaScript",
        "ThreeJS",
        "WebGL",
      ],
      href: "/projects/tools",
    },
    {
      title: "Architectural Visualization",
      Image: "/3d-modeling.png",
      description: "Comming Soon",
      tags: ["XR", "Unreal", "WebGL"],
      href: "/projects/arch",
    },
    {
      title: "Cadd",
      Image: "/architecture.png",
      description: "Comming Soon",
      tags: ["AutoCAD", "Revit", "BIM", "Plugins", "C#", "Dynamo"],
      href: "/projects/Cadd",
    },
  ];

  return (
    <section className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-primary">
            Projects
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            A few highlighted builds — focused on clean UX and practical engineering.
          </p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((p) => (
          <ProjectCard key={p.href} {...p} />
        ))}
      </div>
    </section>
  );
}
