"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import SvgIcon from "./SvgIcon";

type Skill = {
  name: string;
  icon: string;
  size?: number;
  tone?: "white" | "primary" | "muted";
  kind?: "svg" | "img"; // svg = inline via SvgIcon, img = next/image
};

const SKILLS: Skill[] = [
  { name: "TypeScript", icon: "/skills/typescript-colored.svg", kind: "svg", tone: "white" },
  { name: "React", icon: "/skills/react-colored.svg", kind: "svg", tone: "white" },
  { name: "Next.js", icon: "/skills/next.svg", kind: "svg", tone: "white" },
  { name: "Node.js", icon: "/skills/nodejs-colored.svg", kind: "svg", tone: "white" },
  { name: "Unreal", icon: "/skills/unreal-engine.svg", kind: "svg", tone: "white" },
  { name: "Blender", icon: "/skills/Logo_Blender.png", kind: "img" },
  { name: "Figma", icon: "/skills/figma-colored.svg", kind: "svg", tone: "white" },
  { name: "CSS", icon: "/skills/css3-colored.svg", kind: "svg", tone: "white" },
  { name: "HTML5", icon: "/skills/html5-colored.svg", kind: "svg", tone: "white" },
];

function toneClass(t?: Skill["tone"]) {
  if (t === "primary") return "text-primary";
  if (t === "muted") return "text-muted-foreground";
  return "text-white";
}

export default function SkillsHub({
  height = 460,
  motion = "on",
  centerLabel = "SKILLS",
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
      const layout = () => {
        tlRef.current?.kill();
        tlRef.current = null;

        const r = wrap.getBoundingClientRect();
        const W = r.width;
        const H = r.height;

        const cx = W / 2;
        const cy = H / 2;

        const radius = Math.max(130, Math.min(W, H) * 0.34);
        const startAngle = -Math.PI / 2 + 0.22;

        gsap.set(center, { x: cx, y: cy, xPercent: -50, yPercent: -50 });

        const nodes = nodeRefs.current.filter(Boolean) as HTMLButtonElement[];
        const lines = lineRefs.current.filter(Boolean) as SVGLineElement[];

        nodes.forEach((node, i) => {
          const size = Number(node.dataset.size || 46);
          const a = startAngle + (i * Math.PI * 2) / nodes.length;

          const x = cx + Math.cos(a) * radius;
          const y = cy + Math.sin(a) * radius;

          gsap.set(node, { x, y, xPercent: -50, yPercent: -50 });

          const line = lines[i];
          if (line) {
            line.setAttribute("x1", `${cx}`);
            line.setAttribute("y1", `${cy}`);
            line.setAttribute("x2", `${x}`);
            line.setAttribute("y2", `${y}`);

            const len = Math.hypot(x - cx, y - cy);
            line.style.strokeDasharray = `${len}`;
            line.style.strokeDashoffset = `${len}`;
          }

          // store for hover: index
          node.dataset.idx = String(i);
          node.dataset.cx = String(cx);
          node.dataset.cy = String(cy);
        });

        // reveal
        gsap.set(nodes, { opacity: 0, scale: 0.9 });
        gsap.set(lines, { opacity: 0.6 });

        if (prefersReduced) {
          gsap.set(nodes, { opacity: 1, scale: 1 });
          gsap.set(lines, { strokeDashoffset: 0, opacity: 0.5 });
          return;
        }

        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

        tl.to(lines, { strokeDashoffset: 0, duration: 0.9, stagger: 0.06 });
        tl.to(nodes, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.06 }, "-=0.65");

        // center breathe
        tl.to(
          center,
          { scale: 1.035, duration: 1.6, repeat: -1, yoyo: true, ease: "sine.inOut" },
          0
        );

        // node floating
        nodes.forEach((node, i) => {
          gsap.to(node, {
            x: `+=${(i % 2 === 0 ? 1 : -1) * (7 + i * 0.35)}`,
            y: `+=${(i % 3 === 0 ? 1 : -1) * (9 + i * 0.28)}`,
            duration: 2.8 + i * 0.1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        });

        // line pulse
        gsap.to(lines, { opacity: 0.85, duration: 1.4, repeat: -1, yoyo: true, ease: "sine.inOut" });

        tlRef.current = tl;
      };

      layout();

      let raf: number | null = null;
      const ro = new ResizeObserver(() => {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(layout);
      });
      ro.observe(wrap);

      // Hover: brighten the line + tiny “signal” animation
      const onEnter = (e: Event) => {
        const btn = e.currentTarget as HTMLButtonElement;
        const i = Number(btn.dataset.idx);
        const line = lineRefs.current[i];
        if (!line) return;

        gsap.to(btn, { scale: 1.12, duration: 0.18, ease: "power2.out" });
        gsap.to(line, { opacity: 1, duration: 0.2 });

        // quick pulse on line dash (fake signal)
        const len = Number(line.style.strokeDasharray) || 200;
        gsap.fromTo(
          line,
          { strokeDashoffset: 0 },
          { strokeDashoffset: -len * 0.12, duration: 0.28, ease: "power2.out", yoyo: true, repeat: 1 }
        );
      };

      const onLeave = (e: Event) => {
        const btn = e.currentTarget as HTMLButtonElement;
        const i = Number(btn.dataset.idx);
        const line = lineRefs.current[i];
        gsap.to(btn, { scale: 1, duration: 0.18, ease: "power2.out" });
        if (line) gsap.to(line, { opacity: 0.6, duration: 0.25 });
      };

      const nodes = nodeRefs.current.filter(Boolean) as HTMLButtonElement[];
      nodes.forEach((n) => {
        n.addEventListener("mouseenter", onEnter);
        n.addEventListener("mouseleave", onLeave);
      });

      return () => {
        if (raf) cancelAnimationFrame(raf);
        ro.disconnect();
        tlRef.current?.kill();
        nodes.forEach((n) => {
          n.removeEventListener("mouseenter", onEnter);
          n.removeEventListener("mouseleave", onLeave);
        });
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
      <div className="pointer-events-none absolute inset-0 opacity-35 [background:radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.14),transparent_45%),radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.10),transparent_55%)]" />

      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
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
            className="text-white/20"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        ))}
      </svg>

      <div
        ref={centerRef}
        className="absolute grid place-items-center rounded-full border border-border
                   bg-background/60 px-6 py-5 backdrop-blur"
      >
        <div className="text-xs font-semibold tracking-[0.22em] text-white/90">
          {centerLabel}
        </div>
      </div>

      {SKILLS.map((s, i) => {
        const size = s.size ?? 46;
        const iconWrap = `grid place-items-center ${toneClass(s.tone)}`;

        return (
          <button
            key={s.name + i}
            ref={(el) => {
              nodeRefs.current[i] = el;
            }}
            type="button"
            data-size={size}
            aria-label={s.name}
            className="absolute inline-flex items-center justify-center rounded-2xl
                       bg-white/5 p-2 backdrop-blur-sm transition
                       hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
            style={{ width: size + 18, height: size + 18 }}
          >
            <span className={iconWrap}>
              {s.kind === "img" ? (
                <Image src={s.icon} alt={s.name} width={size} height={size} />
              ) : (
                <SvgIcon src={s.icon} size={size} className={toneClass(s.tone)} title={s.name} />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
