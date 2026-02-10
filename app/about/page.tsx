// app/about/page.tsx
"use client";

import "./about.css";

import Image from "next/image";
import { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollToPlugin from "gsap/ScrollToPlugin";

import SkillsHubCloud from "./_components/SkillsHubCloud";

import {
  Sparkles,
  Users,
  Workflow,
  ShieldCheck,
  BadgeCheck,
  Layers,
  ArrowRight,
  Mountain,
  Ship,
  GraduationCap,
  Building2,
  PuzzleIcon,
  Cog,
} from "lucide-react";

type NavItem = { id: string; label: string };

export default function AboutPage() {
  const root = useRef<HTMLElement | null>(null);

  const title = "I Build the Systems Production Teams Depend On";
  const subtitle =
    "Software Developer · Technical Artist · BIM Manager - tools, pipelines, and coordination leadership across real-time and AEC/BIM.";

  const navItems: NavItem[] = useMemo(
    () => [
      { id: "top", label: "Top" },
      { id: "deliverables", label: "Deliverables" },
      { id: "journey", label: "Journey" },
      { id: "credits", label: "Credits" },
      { id: "leadership", label: "Leadership" },
      { id: "badges", label: "Badges" }, // ✅ Added
      { id: "cta", label: "Contact" },
    ],
    []
  );

  const chips = [
    "Unreal Engine",
    "Tools & Pipelines",
    "Automation Systems",
    "XR/VR",
    "BIM Management",
    "Coordination Leadership",
    "Performance & Optimization",
  ];

  const particles = useMemo(
    () => [
      { Icon: Sparkles, top: "9%", left: "10%", size: 18, depth: 0.25 },
      { Icon: Workflow, top: "18%", left: "78%", size: 18, depth: 0.35 },
      { Icon: Layers, top: "34%", left: "12%", size: 20, depth: 0.45 },
      { Icon: ShieldCheck, top: "46%", left: "88%", size: 18, depth: 0.35 },
      { Icon: BadgeCheck, top: "58%", left: "72%", size: 20, depth: 0.55 },
      { Icon: Users, top: "66%", left: "18%", size: 18, depth: 0.4 },
      { Icon: Cog, top: "78%", left: "86%", size: 20, depth: 0.6 },
      { Icon: Ship, top: "86%", left: "34%", size: 20, depth: 0.5 },
    ],
    []
  );

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    let resizeCall: gsap.core.Tween | null = null;

    const ctx = gsap.context(() => {
      // --- Ambient blob motion
      if (!prefersReduced) {
        gsap.fromTo(
          ".about-float",
          { xPercent: -30, yPercent: -10 },
          {
            xPercent: 30,
            yPercent: 10,
            duration: 7,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          }
        );
      }

      // --- Scroll progress bar
      if (!prefersReduced) {
        gsap.to(".about-progress", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.35,
          },
        });
      } else {
        gsap.set(".about-progress", { scaleX: 1 });
      }

      // --- Background parallax layers
      if (!prefersReduced) {
        const mk = (sel: string, y: number) =>
          gsap.to(sel, {
            yPercent: y,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          });

        mk(".about-bg--far", 18);
        mk(".about-bg--mid", 28);
        mk(".about-bg--near", 40);
        mk(".about-dots", 22);
      }

      // --- Badge icon cycle
      const badgeIcons = gsap.utils.toArray<HTMLElement>(".about-badge-icon");
      gsap.set(badgeIcons, { autoAlpha: 0, scale: 0.85 });
      if (badgeIcons[0]) gsap.set(badgeIcons[0], { autoAlpha: 1, scale: 1 });

      let badgeTl: gsap.core.Timeline | null = null;
      if (!prefersReduced && badgeIcons.length > 1) {
        badgeTl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 });
        for (let i = 0; i < badgeIcons.length; i++) {
          const current = badgeIcons[i];
          const next = badgeIcons[(i + 1) % badgeIcons.length];
          badgeTl
            .to({}, { duration: 1.1 })
            .to(current, { autoAlpha: 0, scale: 0.9, duration: 0.22, ease: "power2.out" }, ">")
            .to(next, { autoAlpha: 1, scale: 1, duration: 0.28, ease: "power2.out" }, "<");
        }
      }

      // --- Floating particles (idle + scroll + mouse)
      let onParticleMove: ((e: MouseEvent) => void) | null = null;

      if (!prefersReduced) {
        const particleEls = gsap.utils.toArray<HTMLElement>(".about-particle");

        particleEls.forEach((p, idx) => {
          const d = Number(p.dataset.depth ?? "0.4");

          gsap.fromTo(
            p,
            { x: (idx % 2 === 0 ? -1 : 1) * 6, y: (idx % 3 === 0 ? -1 : 1) * 8 },
            {
              x: (idx % 2 === 0 ? 1 : -1) * 6,
              y: (idx % 3 === 0 ? 1 : -1) * 10,
              duration: 3.6 + idx * 0.25,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            }
          );

          gsap.to(p, {
            y: 240 * d,
            x: -90 * d,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 1 },
          });
        });

        onParticleMove = (e: MouseEvent) => {
          const x = (e.clientX / window.innerWidth - 0.5) * 2;
          const y = (e.clientY / window.innerHeight - 0.5) * 2;

          particleEls.forEach((p) => {
            const d = Number(p.dataset.depth ?? "0.4");
            gsap.to(p, {
              x: `+=${x * 6 * d}`,
              y: `+=${y * 5 * d}`,
              duration: 0.7,
              ease: "power2.out",
              overwrite: true,
            });
          });
        };

        window.addEventListener("mousemove", onParticleMove);
      }

      // --- Title line wrap helper
      const buildTitleLines = () => {
        const words = gsap.utils.toArray<HTMLElement>(".about-word");
        gsap.killTweensOf(words);

        gsap.set(words, {
          autoAlpha: 0,
          y: 18,
          rotateX: -35,
          transformOrigin: "50% 50%",
          transformStyle: "preserve-3d",
        });

        const lines = new Map<number, HTMLElement[]>();
        words.forEach((w) => {
          const top = w.offsetTop;
          if (!lines.has(top)) lines.set(top, []);
          lines.get(top)!.push(w);
        });

        const orderedLines = Array.from(lines.entries())
          .sort((a, b) => a[0] - b[0])
          .map(([, lineWords]) => lineWords);

        return { orderedLines };
      };

      // --- Intro animation (hero only)
      const playIntro = () => {
        const { orderedLines } = buildTitleLines();

        gsap.set(".about-kicker", { autoAlpha: 0, y: 10 });
        gsap.set(".about-subtitle", { autoAlpha: 0, y: 10 });
        gsap.set(".about-left", { autoAlpha: 0, y: 12 });
        gsap.set(".about-right", { autoAlpha: 0, y: 12 });

        gsap.set(".about-stat", { autoAlpha: 0, y: 10 });
        gsap.set(".about-skills", { autoAlpha: 0, y: 12 });
        gsap.set(".about-image", { autoAlpha: 0, y: 18, scale: 0.985 });

        gsap.set(".about-chip", { autoAlpha: 0, y: 10 });
        gsap.set(".about-callout", { autoAlpha: 0, y: 12 });
        gsap.set(".about-callout-pill", { autoAlpha: 0, y: 8 });

        // NOTE: reveals are handled by ScrollTrigger scrubReveal

        const tl = gsap.timeline({ delay: 0.06 });

        tl.to(".about-left", {
          autoAlpha: 1,
          y: 0,
          duration: prefersReduced ? 0.01 : 0.55,
          ease: "power2.out",
        });

        tl.to(
          ".about-right",
          {
            autoAlpha: 1,
            y: 0,
            duration: prefersReduced ? 0.01 : 0.55,
            ease: "power2.out",
          },
          0.06
        );

        tl.to(
          ".about-kicker",
          { autoAlpha: 1, y: 0, duration: prefersReduced ? 0.01 : 0.35, ease: "power2.out" },
          0.03
        );

        tl.to(
          ".about-subtitle",
          { autoAlpha: 1, y: 0, duration: prefersReduced ? 0.01 : 0.35, ease: "power2.out" },
          0.1
        );

        orderedLines.forEach((lineWords, idx) => {
          tl.to(
            lineWords,
            {
              autoAlpha: 1,
              y: 0,
              rotateX: 0,
              duration: prefersReduced ? 0.01 : 0.55,
              ease: "power3.out",
              stagger: prefersReduced ? 0 : 0.05,
            },
            idx === 0 ? 0.18 : ">-=0.25"
          );
        });

        tl.to(
          ".about-stat",
          {
            autoAlpha: 1,
            y: 0,
            duration: prefersReduced ? 0.01 : 0.45,
            ease: "power2.out",
            stagger: prefersReduced ? 0 : 0.08,
          },
          ">-=0.22"
        );

        tl.to(
          ".about-skills",
          { autoAlpha: 1, y: 0, duration: prefersReduced ? 0.01 : 0.55, ease: "power2.out" },
          ">-=0.25"
        );

        tl.to(
          ".about-image",
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: prefersReduced ? 0.01 : 0.7,
            ease: "power3.out",
          },
          ">-=0.25"
        );

        tl.to(
          ".about-chip",
          {
            autoAlpha: 1,
            y: 0,
            duration: prefersReduced ? 0.01 : 0.45,
            ease: "power2.out",
            stagger: prefersReduced ? 0 : 0.06,
          },
          ">-=0.35"
        );

        tl.to(
          ".about-callout",
          { autoAlpha: 1, y: 0, duration: prefersReduced ? 0.01 : 0.5, ease: "power2.out" },
          ">-=0.15"
        );

        tl.to(
          ".about-callout-pill",
          {
            autoAlpha: 1,
            y: 0,
            duration: prefersReduced ? 0.01 : 0.45,
            ease: "power2.out",
            stagger: prefersReduced ? 0 : 0.06,
          },
          ">-=0.25"
        );

        return tl;
      };

      let introTl = playIntro();

      // --- Hero image parallax
      if (!prefersReduced) {
        gsap.to(".about-image", {
          y: -22,
          rotate: -0.6,
          ease: "none",
          scrollTrigger: { trigger: ".about-image", start: "top 90%", end: "bottom 10%", scrub: 1 },
        });

        gsap.to(".about-image img", {
          scale: 1.06,
          ease: "none",
          scrollTrigger: { trigger: ".about-image", start: "top 90%", end: "bottom 10%", scrub: 1 },
        });
      }

      // --- Section reveals
      const scrubReveal = (section: string, items?: string) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "top 45%",
            scrub: prefersReduced ? false : 1,
          },
        });

        tl.to(section, {
          autoAlpha: 1,
          y: 0,
          duration: prefersReduced ? 0.01 : 1,
          ease: "power2.out",
        });

        if (items) {
          tl.to(
            items,
            {
              autoAlpha: 1,
              y: 0,
              duration: prefersReduced ? 0.01 : 1,
              ease: "power2.out",
              stagger: prefersReduced ? 0 : 0.08,
            },
            prefersReduced ? 0 : 0.1
          );
        }
      };

      scrubReveal("#deliverables", "#deliverables .about-reveal-item");
      scrubReveal("#journey", "#journey .about-reveal-item");
      scrubReveal("#credits", "#credits .about-reveal-item");
      scrubReveal("#leadership", "#leadership .about-reveal-item");
      scrubReveal("#badges", "#badges .about-reveal-item"); // ✅ Added
      scrubReveal("#cta");

      // --- Section nav
      const navButtons = gsap.utils.toArray<HTMLButtonElement>(".about-nav-btn");

      const setActive = (id: string) => {
        navButtons.forEach((btn) => {
          const match = btn.dataset.target === id;
          btn.classList.toggle("is-active", match);
          btn.setAttribute("aria-current", match ? "true" : "false");
        });
      };

      const onNavClick = (e: Event) => {
        const btn = e.currentTarget as HTMLButtonElement | null;
        const targetId = btn?.dataset.target;
        if (!targetId) return;

        const targetEl = el.querySelector(`#${CSS.escape(targetId)}`) as HTMLElement | null;
        if (!targetEl) return;

        if (history?.replaceState) history.replaceState(null, "", `#${targetId}`);

        if (prefersReduced) {
          targetEl.scrollIntoView({ behavior: "auto", block: "start" });
          return;
        }

        gsap.to(window, {
          duration: 0.9,
          ease: "power2.out",
          scrollTo: { y: targetEl, offsetY: 110 },
        });
      };

      navButtons.forEach((btn) => btn.addEventListener("click", onNavClick));

      const sections: { id: string; trigger: string }[] = [
        { id: "top", trigger: "#top" },
        { id: "deliverables", trigger: "#deliverables" },
        { id: "journey", trigger: "#journey" },
        { id: "credits", trigger: "#credits" },
        { id: "leadership", trigger: "#leadership" },
        { id: "badges", trigger: "#badges" }, // ✅ Added
        { id: "cta", trigger: "#cta" },
      ];

      const activeTriggers = sections.map(({ id, trigger }) =>
        ScrollTrigger.create({
          trigger,
          start: "top 35%",
          end: "bottom 35%",
          onEnter: () => setActive(id),
          onEnterBack: () => setActive(id),
        })
      );

      setActive("top");

      // --- Resize rebuild
      const onResize = () => {
        resizeCall?.kill();
        resizeCall = gsap.delayedCall(0.15, () => {
          introTl.kill();
          introTl = playIntro();
          ScrollTrigger.refresh();
        });
      };
      window.addEventListener("resize", onResize);

      // Ensure triggers measure correctly after first layout
      gsap.delayedCall(0.05, () => ScrollTrigger.refresh());

      return () => {
        window.removeEventListener("resize", onResize);
        resizeCall?.kill();
        introTl.kill();
        badgeTl?.kill();

        navButtons.forEach((btn) => btn.removeEventListener("click", onNavClick));
        activeTriggers.forEach((t) => t.kill());

        if (onParticleMove) window.removeEventListener("mousemove", onParticleMove);
      };
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="top" className="relative mx-auto max-w-6xl overflow-hidden px-4 py-10">
      {/* Scroll progress bar */}
      <div className="pointer-events-none sticky top-0 z-30 -mx-4 mb-4">
        <div className="h-[2px] w-full bg-border/40">
          <div className="about-progress h-full w-full origin-left scale-x-0 bg-primary/80" />
        </div>
      </div>

      {/* Section Nav */}
      <div className="sticky top-[2px] z-20 -mx-4 mb-8 border-b border-border bg-background/70 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div className="hidden text-xs font-semibold tracking-wide text-foreground/70 md:block">About</div>

          <div className="flex flex-1 items-center justify-start gap-2 overflow-x-auto md:justify-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                data-target={item.id}
                className="about-nav-btn whitespace-nowrap rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground transition hover:bg-muted"
                aria-current="false"
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:block">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-semibold text-foreground hover:bg-muted"
            >
              Contact <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="about-bg--far absolute -top-24 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-secondary/15 blur-3xl" />
        <div className="about-bg--mid absolute top-36 -left-10 h-[420px] w-[420px] rounded-full bg-primary/10 blur-3xl" />
        <div className="about-bg--near absolute bottom-12 right-0 h-[520px] w-[520px] rounded-full bg-secondary/15 blur-3xl" />
        <div className="about-dots absolute inset-0" />
        <div className="about-float absolute top-8 left-1/2 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-secondary/10 blur-3xl md:h-[520px] md:w-[520px]" />
      </div>

      {/* Floating icon particles */}
      <div className="about-particles pointer-events-none absolute inset-0 -z-0">
        {particles.map(({ Icon, top, left, size, depth }, i) => (
          <span key={i} className="about-particle absolute" style={{ top, left }} data-depth={depth}>
            <Icon style={{ width: size, height: size }} className="text-foreground/20 dark:text-foreground/15" aria-hidden="true" />
          </span>
        ))}
      </div>

      {/* HERO GRID */}
      <div className="relative grid gap-10 md:grid-cols-2 md:items-start">
        {/* LEFT */}
        <div className="about-left space-y-4 md:sticky md:top-24 md:self-start">
          <p className="about-kicker text-xs text-muted-foreground">(About)</p>

          <h1 className="about-title-3d max-w-md text-4xl font-semibold leading-tight tracking-tight text-primary sm:text-5xl">
            {title.split(" ").map((word, i, arr) => (
              <span key={i} className="about-word inline-block will-change-transform" aria-hidden="true">
                {word}
                {i !== arr.length - 1 ? "\u00A0" : ""}
              </span>
            ))}
            <span className="sr-only">{title}</span>
          </h1>

          <p className="about-subtitle max-w-md text-sm leading-6 text-muted-foreground">{subtitle}</p>

          {/* STATS */}
          <div className="flex flex-wrap gap-2">
            {[
              { k: "7+ yrs", v: "Professional Software Dev" },
              { k: "15+ yrs", v: "Real-Time Production" },
              { k: "20+ yrs", v: "BIM Leadership" },
            ].map((s) => (
              <div
                key={s.k}
                className="about-stat group relative min-w-[170px] overflow-hidden rounded-2xl border border-border bg-card/45 px-3 py-2 backdrop-blur"
              >
                <div className="relative">
                  <div className="flex items-baseline gap-2">
                    <div className="text-sm font-semibold leading-none text-foreground">{s.k}</div>
                    <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground/40" />
                  </div>
                  <div className="mt-1 text-[11px] leading-none text-muted-foreground">{s.v}</div>
                </div>
              </div>
            ))}
          </div>

          {/* SKILLS (Left below years) */}
          <div className="about-skills">
            <div className="rounded-2xl border border-border bg-card/50 p-4 backdrop-blur">
              <div className="mt-1">
                <SkillsHubCloud height={460} motion="on" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="about-right space-y-4 md:pt-2">
          {/* IMAGE CARD */}
          <div className="about-image group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-card">
            <Image
              src="/me_03.png"
              alt="Bryan Quero"
              fill
              priority
              quality={100}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-background/10 via-transparent to-background/20" />
            <div className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_50%_35%,transparent_55%,rgba(0,0,0,0.45)_100%)] opacity-60 dark:opacity-70" />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-white/10" />

            <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-foreground/80 backdrop-blur">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/70" />
                Focus: tools, pipelines, systems
              </div>
            </div>
          </div>

          {/* CHIPS */}
          <div className="flex flex-wrap gap-2">
            {chips.map((t) => (
              <span key={t} className="about-chip rounded-full border border-border bg-card/45 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
                {t}
              </span>
            ))}
          </div>

          {/* CALLOUT */}
          <div className="about-callout rounded-2xl border border-border bg-card/50 p-4">
            <div className="flex items-start gap-3">
              <div className="relative mt-0.5 grid h-9 w-9 place-items-center rounded-xl border border-border bg-background/60">
                <Sparkles className="about-badge-icon absolute h-4 w-4 text-foreground/80" aria-hidden="true" />
                <Users className="about-badge-icon absolute h-4 w-4 text-foreground/80" aria-hidden="true" />
                <Workflow className="about-badge-icon absolute h-4 w-4 text-foreground/80" aria-hidden="true" />
                <ShieldCheck className="about-badge-icon absolute h-4 w-4 text-foreground/80" aria-hidden="true" />
                <BadgeCheck className="about-badge-icon absolute h-4 w-4 text-foreground/80" aria-hidden="true" />
                <Layers className="about-badge-icon absolute h-4 w-4 text-foreground/80" aria-hidden="true" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold tracking-wide text-foreground/80">Leadership Snapshot</p>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    Software Developer and Game/XR Engineer with 20+ years driving BIM coordination, production standards, and multidisciplinary workflows.</span>{" "} Experienced in leading coordination meetings, resolving clashes, and bridging engineering, design, and development teams to deliver scalable, production-ready systems.
                  
                 
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {[
                    { Icon: Users, label: "Coordination" },
                    { Icon: Workflow, label: "Pipelines" },
                    { Icon: ShieldCheck, label: "Reliability" },
                    { Icon: BadgeCheck, label: "Delivery" },
                    { Icon: Layers, label: "BIM Systems" },
                  ].map(({ Icon, label }) => (
                    <span
                      key={label}
                      className="about-callout-pill inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-3 py-1 text-[11px] text-muted-foreground"
                    >
                      <Icon className="h-3.5 w-3.5 text-foreground/70" aria-hidden="true" />
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTIONS */}
      <div className="mt-2 space-y-4">
        <div id="deliverables" className="about-reveal scroll-mt-28 rounded-2xl border border-border bg-card/50 p-4">
          <p className="text-xs font-semibold tracking-wide text-foreground/80">What I Deliver</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {[
              "Production-ready tools and automation that remove bottlenecks and increase team velocity.",
              "Scalable pipelines and systems designed for performance, reliability, and long-term maintainability.",
              "Leadership across disciplines - clear coordination, strong standards, and consistent delivery under real constraints.",
            ].map((item) => (
              <li key={item} className="about-reveal-item flex gap-2">
                <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-primary/70" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="about-wave pointer-events-none my-8 opacity-35">
          <svg viewBox="0 0 1200 120" className="h-10 w-full">
            <path d="M0,70 C180,110 420,110 600,70 C780,30 1020,30 1200,70 L1200,120 L0,120 Z" fill="currentColor" opacity="0.18" />
          </svg>
        </div>

        <div id="journey" className="about-reveal scroll-mt-28 rounded-2xl border border-border bg-card/50 p-4">
          <p className="text-xs font-semibold tracking-wide text-foreground/80">Journey</p>
          <p className="mt-2 text-sm text-muted-foreground">
            A quick view of the spaces I&apos;ve delivered in - real-time production, themed experiences, enterprise clients, and BIM leadership.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {[
              {
                icon: Cog,
                title: "Disney - Real-Time / Interactive Pipelines",
                body: "Ratatouille · Toy Story · Guardians of the Galaxy · Star Wars: Galaxy&apos;s Edge · Disney Wish",
                suffixIcon: Ship,
              },
              { icon: Mountain, title: "Harley-Davidson", body: "Production-grade experiences and systems built for quality and reliability." },
              { icon: Ship, title: "Royal Caribbean", body: "Large-scale, customer-facing projects delivered with strong production discipline." },
              { icon: GraduationCap, title: "University of Southern California", body: "Collaboration with a major institution on complex technical and production needs." },
              {
                icon: Building2,
                title: "AEC/BIM Leadership (20+ Years)",
                body: "Standards · QA/QC · coordination meetings · clash resolution · model health · deliverables at scale.",
              },
              { icon: PuzzleIcon, title: "Boston Consultant Group", body: "Large-scale, ambitious and very challenging projects delivered with strong production discipline." },
            ].map((t) => {
              const Icon = t.icon;
              const Suffix = (t as { suffixIcon?: typeof Ship }).suffixIcon;
              return (
                <div key={t.title} className="about-reveal-item relative overflow-hidden rounded-2xl border border-border bg-background/50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-background/60">
                      <Icon className="h-4 w-4 text-foreground/80" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{t.title}</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {t.body}
                        {Suffix ? (
                          <Suffix className="ml-1 inline-block h-4 w-4 align-[-2px] text-foreground/70" aria-hidden="true" />
                        ) : null}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="about-wave pointer-events-none my-8 opacity-35">
          <svg viewBox="0 0 1200 120" className="h-10 w-full">
            <path d="M0,64 C150,12 350,12 600,64 C850,116 1050,116 1200,64 L1200,120 L0,120 Z" fill="currentColor" opacity="0.18" />
          </svg>
        </div>

        <div id="credits" className="about-reveal scroll-mt-28 rounded-2xl border border-border bg-card/50 p-4">
          <p className="text-xs font-semibold tracking-wide text-foreground/80">Selected Projects & Clients</p>

          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-[11px] font-semibold text-foreground/70">Disney Projects</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Ratatouille", "Toy Story", "Guardians of the Galaxy", "Star Wars: Galaxy&apos;s Edge", "Disney Wish (Cruise)"].map((t) => (
                  <span key={t} className="about-reveal-item rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-foreground/70">Clients & Institutions</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Harley-Davidson", "Royal Caribbean", "University of Southern California"].map((t) => (
                  <span key={t} className="about-reveal-item rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="about-wave pointer-events-none my-8 opacity-35">
          <svg viewBox="0 0 1200 120" className="h-10 w-full">
            <path d="M0,70 C180,110 420,110 600,70 C780,30 1020,30 1200,70 L1200,120 L0,120 Z" fill="currentColor" opacity="0.18" />
          </svg>
        </div>

        <div id="leadership" className="about-reveal scroll-mt-28 rounded-2xl border border-border bg-card/50 p-4">
          <p className="text-xs font-semibold tracking-wide text-foreground/80">Leadership & Delivery</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {[
              "Led BIM coordination meetings and facilitated clash-resolution workflows across disciplines.",
              "Defined BIM standards, templates, naming conventions, and deliverable requirements to scale teams.",
              "Owned QA/QC checks and model health processes to reduce rework and improve project reliability.",
              "Bridged stakeholders across design, engineering, and production - translating constraints into actionable plans.",
              "Applied the same systems-thinking to real-time pipelines, tooling, and software development.",
              "Focused on production realities, performance, and maintainability under tight schedules.",
              "Delivered production-ready projects on time and on budget.",
              "Led a group of 20+ CADD technicians and BIM specialists.",
            ].map((item) => (
              <li key={item} className="about-reveal-item flex gap-2">
                <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-primary/70" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ✅ CERTIFIED BADGES (GSAP reveal) */}
        <div
          id="badges"
          className="about-reveal scroll-mt-28 rounded-2xl border border-border bg-card/50 p-4 backdrop-blur"
        >
          <p className="text-xs font-semibold tracking-wide text-foreground/80">Certified Badges</p>
          <p className="mt-2 text-sm text-muted-foreground">Certifications and training milestones.</p>

          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="about-reveal-item grid place-items-center rounded-xl border border-border bg-background/40 p-3">
              <Image
                src="/UCFbadge.svg"
                alt="UCF Badge"
                width={220}
                height={220}
                className="h-[120px] w-auto object-contain"
                priority
              />
            </div>

            <div className="about-reveal-item grid place-items-center rounded-xl border border-border bg-background/40 p-3">
              <Image
                src="/CS-_XRDEV.png"
                alt="XR Developer Badge"
                width={220}
                height={220}
                className="h-[120px] w-auto object-contain"
              />
            </div>
          </div>
        </div>

        <div id="cta" className="about-reveal scroll-mt-28 rounded-2xl border border-border bg-card/50 p-4">
          <p className="text-sm font-semibold text-foreground">Building something ambitious?</p>
          <p className="mt-1 text-sm text-muted-foreground">If you need strong engineering paired with real production leadership, let&apos;s talk.</p>

          <div className="mt-3 flex flex-wrap gap-2">
            <a href="/contact" className="rounded-full border border-border bg-card px-5 py-2 text-sm text-primary hover:bg-background">
              Get in touch
            </a>
            <a
              href="/Bryan_Alec_Quero_port.pdf"
              className="rounded-full border border-border bg-card px-5 py-2 text-sm text-primary hover:bg-background hover:bg-muted"
            >
              Download Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
