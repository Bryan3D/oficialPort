"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function AboutPage() {
  const root = useRef<HTMLElement | null>(null);

  const title = "A Deep Dive into My Life's Experiences and Lessons Learned";

  useLayoutEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      // --- Ambient blob motion (idle)
      gsap.fromTo(
        ".about-float",
        { xPercent: -30 },
        {
          xPercent: 30,
          duration: 6,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        }
      );

      // helper: build title lines by rendered wrapping
      const buildTitleLines = () => {
        const words = gsap.utils.toArray<HTMLElement>(".about-word");

        // reset title words
        gsap.killTweensOf(words);
        gsap.set(words, { autoAlpha: 0, y: 18, rotateX: -35 });

        const lines = new Map<number, HTMLElement[]>();
        words.forEach((w) => {
          const top = w.offsetTop;
          if (!lines.has(top)) lines.set(top, []);
          lines.get(top)!.push(w);
        });

        const orderedLines = Array.from(lines.entries())
          .sort((a, b) => a[0] - b[0])
          .map(([, lineWords]) => lineWords);

        return { words, orderedLines };
      };

      const playIntro = () => {
        const { orderedLines } = buildTitleLines();

        // reset other elements
        gsap.set(".about-kicker", { autoAlpha: 0, y: 10 });
        gsap.set(".about-left", { autoAlpha: 0, y: 12 });
        gsap.set(".about-right", { autoAlpha: 0, y: 12 });
        gsap.set(".about-image", { autoAlpha: 0, y: 18, scale: 0.985 });
        gsap.set(".about-copy p", { autoAlpha: 0, y: 12 });

        const tl = gsap.timeline({ delay: 0.1 });

        // left / right fade in
        tl.to(
          ".about-left",
          { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" },
          0
        );
        tl.to(
          ".about-right",
          { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" },
          0.08
        );

        // kicker
        tl.to(
          ".about-kicker",
          { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" },
          0.05
        );

        // title lines
        orderedLines.forEach((lineWords, idx) => {
          tl.to(
            lineWords,
            {
              autoAlpha: 1,
              y: 0,
              rotateX: 0,
              duration: 0.55,
              ease: "power3.out",
              stagger: 0.05,
            },
            idx === 0 ? 0.18 : ">-=0.25"
          );
        });

        // image
        tl.to(
          ".about-image",
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
          },
          ">-=0.25"
        );

        // paragraphs
        tl.to(
          ".about-copy p",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
            stagger: 0.12,
          },
          ">-=0.2"
        );

        return tl;
      };

      // play once
      let introTl = playIntro();

      // rebuild on resize (title wrapping changes)
      const onResize = () => {
        introTl.kill();
        introTl = playIntro();
      };

      window.addEventListener("resize", onResize);

      // Image hover micro-interaction (card lift)
      const img = root.current.querySelector(".about-image") as HTMLElement | null;

      const onEnter = () => {
        if (!img) return;
        gsap.to(img, { y: -6, scale: 1.01, duration: 0.25, ease: "power2.out" });
      };

      const onLeave = () => {
        if (!img) return;
        gsap.to(img, { y: 0, scale: 1, duration: 0.25, ease: "power2.out" });
      };

      img?.addEventListener("mouseenter", onEnter);
      img?.addEventListener("mouseleave", onLeave);

      return () => {
        window.removeEventListener("resize", onResize);
        img?.removeEventListener("mouseenter", onEnter);
        img?.removeEventListener("mouseleave", onLeave);
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative mx-auto max-w-6xl overflow-hidden px-4 py-10"
    >
      {/* moving ambient blob */}
      <div className="pointer-events-none absolute inset-0">
        <div className="about-float absolute top-10 left-1/2 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-secondary/20 blur-3xl" />
      </div>

      <div className="relative grid gap-10 md:grid-cols-2 md:items-start">
        {/* LEFT COLUMN */}
        <div className="about-left space-y-4">
          <p className="about-kicker text-xs text-muted-foreground">(About Me)</p>

          <h1 className="max-w-md text-4xl font-semibold leading-tight tracking-tight text-primary sm:text-5xl">
            {title.split(" ").map((word, i, arr) => (
              <span
                key={i}
                className="about-word inline-block will-change-transform"
                style={{ transformPerspective: 800 }}
                aria-hidden="true"
              >
                {word}
                {i !== arr.length - 1 ? "\u00A0" : ""}
              </span>
            ))}
            <span className="sr-only">{title}</span>
          </h1>
        </div>

        {/* RIGHT COLUMN */}
        <div className="about-right space-y-4">
          {/* ✅ PREMIUM Image card (border + glow + ring + sweep + grain) */}
          <div className="about-image group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-card">
            {/* glow layer */}
            <div className="pointer-events-none absolute -inset-10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
              <div className="absolute inset-0 rounded-[28px] bg-secondary/25" />
            </div>

            {/* subtle inner highlight ring */}
            <div className="pointer-events-none absolute inset-0 opacity-0 ring-1 ring-secondary/30 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100" />

            {/* glossy sweep */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
              <div className="absolute -left-1/3 top-0 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-140%] group-hover:translate-x-[380%] transition-transform duration-700 ease-out" />
            </div>

            {/* 🎞️ film grain (CSS-only, no image asset) */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
              <div className="absolute inset-0 mix-blend-overlay opacity-[0.18] [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.06),rgba(255,255,255,0.06)_1px,rgba(0,0,0,0.06)_1px,rgba(0,0,0,0.06)_2px)]" />
              <div className="absolute inset-0 mix-blend-overlay opacity-[0.10] [background-image:repeating-linear-gradient(90deg,rgba(255,255,255,0.04),rgba(255,255,255,0.04)_1px,rgba(0,0,0,0.04)_1px,rgba(0,0,0,0.04)_3px)]" />
            </div>

            {/* subtle vignette (always on, very light) */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-black/15 via-transparent to-black/10 opacity-30" />
              <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]" />
            </div>

            <Image
              src="/me_03.png"
              alt="Bryan Quero"
              fill
              priority
              className="
                object-cover
                will-change-[filter]
                transition-[filter] duration-300
                
                group-hover:blur-0 group-hover:brightness-100 group-hover:contrast-100 group-hover:saturate-110
                group-focus-within:blur-0 group-focus-within:brightness-100 group-focus-within:contrast-100 group-focus-within:saturate-110
              "
            />
          </div>

          {/* Paragraphs */}
          <div className="about-copy space-y-3 text-sm leading-6 text-muted-foreground">
            <p>
              Hello, I’m Bryan Quero — a{" "}
              <strong>Software Developer with 5+ years of professional experience</strong>{" "}
              and over{" "}
              <strong>15 years working in real-time production environments</strong>. I
              specialize in building internal tools, scalable systems, and automation
              pipelines for games, XR, and AEC/BIM workflows. My background spans
              engine-based and web-based development, with a strong focus on system
              design, performance optimization, and solving complex production
              problems.
            </p>

            <p>
              Over the years, I’ve worked across Unreal Engine, XR prototypes, web
              applications, and production pipelines. I enjoy turning complex
              requirements into reliable, maintainable software that feels intuitive
              to use and scales with growing teams.
            </p>

            <p>
              If you’re building something and need strong engineering paired with
              clean, thoughtful UX, I’m always open to collaborating.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}