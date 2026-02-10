

import React from "react";



import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

type Skill = { name: string; icon: string; size?: number; tone?: "white" | "normal" };

const SKILLS: Skill[] = [
  { name: "TypeScript", icon: "/skills/typescript-colored.svg" },
  { name: "React", icon: "/skills/react-colored.svg" },
  { name: "Next.js", icon: "/skills/next.svg" },
  { name: "Node.js", icon: "/skills/nodejs-colored.svg" },

  // Unreal as white
  { name: "Unreal", icon: "/skills/unreal-engine.svg", tone: "white" },
  { name: "Blender", icon: "/skills/Logo_Blender.png" },
  { name: "Figma", icon: "/skills/figma-colored.svg" },
  { name: "CSS", icon: "/skills/css3-colored.svg" },
  { name: "HTML5", icon: "/skills/html5-colored.svg" },
];


export default function SkillsHub({
  height = 420,
  motion = "auto",
  centerLabel = "SKILL",
}: {
  height?: number;
  motion?: "auto" | "on" | "off";
  centerLabel?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const center = centerRef.current;
    if (!wrap || !center) return;

    const reduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    const prefersReduced =
      motion === "off" ? true : motion === "on" ? false : reduced;

    const ctx = gsap.context(() => {
      const positionAndAnimate = () => {
        // kill old timeline
        tlRef.current?.kill();
        tlRef.current = null;

        const rect = wrap.getBoundingClientRect();
        const W = rect.width;
        const H = rect.height;

        // center point inside wrapper
        const cx = W / 2;
        const cy = H / 2;

        // orbit radius (responsive)
        const radius = Math.max(120, Math.min(W, H) * 0.33);

        // place center label
        gsap.set(center, { x: cx, y: cy, xPercent: -50, yPercent: -50 });

        // gather nodes + lines
        const nodes = nodeRefs.current.filter(Boolean) as HTMLButtonElement[];
        const lines = lineRefs.current.filter(Boolean) as SVGLineElement[];

        // safety
        if (nodes.length === 0 || lines.length === 0) return;

        // initial states
        gsap.set(nodes, { opacity: 0, scale: 0.9, willChange: "transform" });
        gsap.set(lines, { opacity: 0.75 });

        // compute positions around circle (slight offset so top isn’t exactly at 12 o’clock)
        const startAngle = -Math.PI / 2 + 0.25;

        nodes.forEach((node, i) => {
          const skillSize = Number(node.dataset.size || 46);
          const box = skillSize + 18;

          const a = startAngle + (i * (Math.PI * 2)) / nodes.length;

          // orbit point
          const x = cx + Math.cos(a) * radius;
          const y = cy + Math.sin(a) * radius;

          // place node with transform (centered on point)
          gsap.set(node, {
            x,
            y,
            xPercent: -50,
            yPercent: -50,
          });

          // line from center to node
          const line = lines[i];
          if (line) {
            line.setAttribute("x1", `${cx}`);
            line.setAttribute("y1", `${cy}`);
            line.setAttribute("x2", `${x}`);
            line.setAttribute("y2", `${y}`);

            // draw effect
            const len = Math.hypot(x - cx, y - cy);
            line.style.strokeDasharray = `${len}`;
            line.style.strokeDashoffset = `${len}`;
          }
        });

        if (prefersReduced) {
          // no motion: just reveal
          gsap.set(nodes, { opacity: 1, scale: 1 });
          gsap.set(lines, { strokeDashoffset: 0, opacity: 0.6 });
          return;
        }

        // intro timeline: draw lines, pop nodes, then float
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

        tl.to(lines, {
          strokeDashoffset: 0,
          duration: 0.9,
          stagger: 0.06,
        });

        tl.to(
          nodes,
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            stagger: 0.06,
          },
          "-=0.65",
        );

        // subtle breathing on center
        tl.to(
          center,
          {
            scale: 1.03,
            duration: 1.6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          },
          0,
        );

        // floating nodes (each with its own tiny drift)
        nodes.forEach((node, i) => {
          gsap.to(node, {
            x: `+=${(i % 2 === 0 ? 1 : -1) * (6 + i * 0.4)}`,
            y: `+=${(i % 3 === 0 ? 1 : -1) * (8 + i * 0.35)}`,
            duration: 2.6 + i * 0.12,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        });

        // make lines gently “pulse”
        gsap.to(lines, {
          opacity: 0.85,
          duration: 1.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        tlRef.current = tl;
      };

      positionAndAnimate();

      // resize: recompute positions & re-run intro
      let raf: number | null = null;
      const ro = new ResizeObserver(() => {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(positionAndAnimate);
      });
      ro.observe(wrap);

      return () => {
        if (raf) cancelAnimationFrame(raf);
        ro.disconnect();
        tlRef.current?.kill();
      };
    }, wrap);

    return () => ctx.revert();
  }, [motion]);

  return (
    <div
      ref={wrapRef}
      className="relative w-full overflow-hidden rounded-3xl border border-border
                 bg-gradient-to-br from-background via-background to-muted/30"
      style={{ height }}
    >
      {/* soft background glow */}
      <div className="pointer-events-none absolute inset-0 opacity-35 [background:radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_45%),radial-gradient(circle_at_70%_60%,rgba(255,255,255,0.10),transparent_55%)]" />

      {/* SVG connector lines */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {SKILLS.map((_, i) => (
          <line
            key={i}
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
            x1="0"
            y1="0"
            x2="0"
            y2="0"
            stroke="currentColor"
            className="text-foreground/20"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        ))}
      </svg>

      {/* Center hub */}
      <div
        ref={centerRef}
        className="absolute grid place-items-center rounded-full border border-border
                   bg-background/60 px-6 py-5 backdrop-blur"
      >
        <div className="text-xs font-semibold tracking-[0.22em] text-foreground/80">
          {centerLabel}
        </div>
      </div>

      {/* Nodes */}
      {SKILLS.map((s, i) => {
        const size = s.size ?? 46;
        return (
          <button
            key={s.name}
            ref={(el) => {
              nodeRefs.current[i] = el;
            }}
            type="button"
            data-size={size}
            aria-label={s.name}
            className="absolute inline-flex items-center justify-center rounded-2xl
                       bg-muted/30 p-2 backdrop-blur-sm transition
                       hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
            style={{ width: size + 18, height: size + 18 }}
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                scale: 1.12,
                duration: 0.18,
                ease: "power2.out",
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                scale: 1,
                duration: 0.18,
                ease: "power2.out",
              });
            }}
          >
            <Image src={s.icon} alt={s.name} width={size} height={size} />
          </button>
        );
      })}
    </div>
  );
}
