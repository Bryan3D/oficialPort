// components\projecard.tsx

import Image from "next/image";

type Project = {
  title: string;
  Image: string; // your data uses "Image"
  description: string;
  tags: string[];
  href: string;
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="relative rounded-2xl border bg-card p-6">
      <Image
        src={project.Image}
        alt={`${project.title} icon`}
        width={48}
        height={48}
        className="absolute right-4 top-4 h-20 w-20 object-contain"
      />

      <h3 className="text-lg font-semibold pr-24">{project.title}</h3>
      <p className="text-sm text-muted-foreground">{project.description}</p>
    </div>
  );
}
