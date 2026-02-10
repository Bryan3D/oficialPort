"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const root = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      // Elements
      const badge = gsap.utils.toArray(".hero-badge");
      const line2 = gsap.utils.toArray(".hero-line2");
      const desc = gsap.utils.toArray(".hero-desc");
      const cta = gsap.utils.toArray(".hero-cta");
      const meta = gsap.utils.toArray(".hero-meta");
      const photo = gsap.utils.toArray(".hero-photo");
      const floatCard = gsap.utils.toArray(".hero-float");
      const blobs = gsap.utils.toArray(".hero-blob");

      // Initial states
      gsap.set([badge, line2, desc, cta, meta], { autoAlpha: 0, y: 14 });
      gsap.set(photo, { autoAlpha: 0, y: 18, scale: 0.98 });
      gsap.set(floatCard, { autoAlpha: 0, y: 18, scale: 0.98 });
      gsap.set(".hero-word", { autoAlpha: 0, y: 18, rotateX: -30, transformOrigin: "50% 100%" });

      // Timeline with ScrollTrigger
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: root.current,
          start: "top 80%",
          once: true,
        },
      });

      tl.to(badge, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.05)
        // word-by-word reveal
        .to(
          ".hero-word",
          {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            duration: 0.6,
            stagger: 0.06,
          },
          0.10
        )
        .to(line2, { autoAlpha: 1, y: 0, duration: 0.55 }, 0.22)
        .to(desc, { autoAlpha: 1, y: 0, duration: 0.55 }, 0.30)
        .to(cta, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.38)
        .to(meta, { autoAlpha: 1, y: 0, duration: 0.45 }, 0.44)
        .to(photo, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7 }, 0.26)
        .to(floatCard, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55 }, 0.52);

      // Subtle floating loop on the small card
      gsap.to(".hero-float", {
        y: "-=8",
        duration: 2.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1.2,
      });

      // Gentle breathing on blobs
      gsap.to(blobs, {
        scale: 1.03,
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative overflow-hidden rounded-3xl border border-border bg-background px-6 py-14 sm:px-10 sm:py-20"
    >
      {/* soft “cloud” gradient layer */}
      <div className="pointer-events-none absolute inset-0">
        <div className="hero-blob absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-secondary/20 blur-3xl" />
        <div className="hero-blob absolute -bottom-28 right-10 h-[520px] w-[520px] rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="relative grid items-center gap-10 md:grid-cols-2">
        {/* Left */}
        <div className="space-y-6">
          <div className="hero-badge inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-secondary" />
            Available for opportunities
          </div>

          <h1 className="leading-[0.95] tracking-tight">
            {/* Word-by-word line */}
            <span className="block text-5xl font-semibold text-primary sm:text-6xl md:text-7xl">
              {"Hi I’m Bryan".split(" ").map((w, i) => (
                <span key={i} className="hero-word inline-block mr-3">
                  {w}
                </span>
              ))}
            </span>

            <span className="hero-line2 mt-2 block text-xl italic text-primary/90 sm:text-6xl md:text-5xl">
              Software Engineer
            </span>
          </h1>

          <p className="hero-desc max-w-xl text-sm text-muted-foreground sm:text-base">
            I build production-ready tools, real-time 3D workflows, and clean web
            experiences—bridging game dev, XR, and 25+ years of BIM/MEP industry
            experience.
          </p>

          <div className="hero-cta flex flex-wrap items-center gap-3">
            <Link
              href="/projects"
              className="rounded-full bg-secondary px-5 py-2 text-sm text-white transition-opacity hover:opacity-90"
            >
              View Projects
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-border bg-card px-5 py-2 text-sm text-primary hover:bg-background"
            >
              Get in touch
            </Link>
          </div>

          <div className="hero-meta text-xs text-muted-foreground">
            Orlando, FL <span className="mx-2 text-muted/40">·</span> Software Dev
            | XR | Game Dev | 3D Art | Real-time 3D | CADD
          </div>
        </div>

        {/* Right */}
        <div className="relative mx-auto w-full max-w-md">
          <div className="hero-photo relative aspect-[4/5] overflow-hidden rounded-3xl border border-border bg-card">
            
              <Image
                  src="/me_01.png"
                  alt="Bryan Quero"
                  fill
                  priority
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  />
          </div>

          <div className="hero-float absolute -bottom-5 left-6 rounded-2xl border border-border bg-background/80 px-4 py-3 text-xs text-muted-foreground backdrop-blur">
            Trusted by teams for tools, pipelines, and clean UX.
          </div>
        </div>
      </div>
    </section>
  );
}