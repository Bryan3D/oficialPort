// app/projects/tools/page.tsx
import Image from "next/image";
import ToolsCarousel from "./_components/ToolsCarousel";

export default function ToolsProjectPage() {
  return (
    <section className="relative space-y-6 overflow-hidden rounded-2xl">
      {/* FULL PAGE/SECTION BG (behind everything) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src="/images/GameVR2.svg"
          alt=""
          fill
          priority
          className="object-cover opacity-[0.9] mix-blend-soft-light"
        />
        <div className="absolute inset-0 bg-background/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background" />
      </div>

      <h1 className="text-3xl font-semibold tracking-tight text-primary uppercase">
        VR|AR, 3D and Game Tools & Pipeline
      </h1>

     

      {/* GLASS RECTANGLE ON TOP */}
      <div className="relative z-10 rounded-xl border border-border bg-card/10 backdrop-blur p-6 min-h-[720px] mt-30">
        <ToolsCarousel />
      </div>
    </section>
  );
}
