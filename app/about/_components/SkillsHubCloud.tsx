"use client";

import Image from "next/image";
import { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import SvgIcon from "./SvgIcon";

type Skill = {
  name: string;
  icon: string;
  size?: number;
  kind?: "svg" | "img";
  tone?: "white" | "primary" | "muted";
};

const SKILLS: Skill[] = [
  { name: "TypeScript", icon: "/skills/typescript-colored.svg", kind: "svg", tone: "white" },
  { name: "React", icon: "/skills/react-colored.svg", kind: "svg", tone: "white" },
  { name: "Next.js", icon: "/skills/next.svg", kind: "svg", tone: "white" },
  { name: "Node.js", icon: "/skills/nodejs-colored.svg", kind: "svg", tone: "white" },
  { name: "Unity", icon: "/skills/unity-featured.svg", kind: "svg", tone: "white" },
  { name: "Unreal Engine", icon: "/skills/unreal-featured.svg", kind: "svg", tone: "white" },
  { name: "Blender", icon: "/skills/blender.svg", kind: "svg" },
  { name: "Figma", icon: "/skills/figma-colored.svg", kind: "svg", tone: "white" },
  { name: "CSS", icon: "/skills/css3-colored.svg", kind: "svg", tone: "white" },
  { name: "HTML5", icon: "/skills/html5-colored.svg", kind: "svg", tone: "white" },
  { name: "JavaScript", icon: "/skills/javascript-original.svg", kind: "svg", tone: "white" },
  { name: "Angular", icon: "/skills/angularjs-original.svg", kind: "svg", tone: "white" },
  { name: "Fusion", icon: "/skills/Fusion.svg", kind: "svg", tone: "white" },
  { name: "photoshop", icon: "/skills/photoshop-colored.svg", kind: "svg", tone: "white" },
  { name: "AfterFX", icon: "/skills/AfterFX.svg", kind: "svg", tone: "white" },
  { name: "illustrator", icon: "/skills/illustrator.svg", kind: "svg", tone: "white" },
  { name: "Python", icon: "/skills/python.svg", kind: "svg", tone: "white" },
  { name: "Godot", icon: "/skills/godot.svg", kind: "svg", tone: "white" },
  { name: "C#", icon: "/skills/csharp-colored.svg", kind: "svg", tone: "white" },
  { name: "C++", icon: "/skills/cplusplus-colored.svg", kind: "svg", tone: "white" },
  { name: "Kotlin", icon: "/skills/kotlin-colored.svg", kind: "svg", tone: "white" },
  { name: "Maya", icon: "/skills/maya-2017.svg", kind: "svg", tone: "white" },
  { name: "3ds Max", icon: "/skills/max.svg", kind: "svg", tone: "white" },
  { name: "Revit", icon: "/skills/revit.svg", kind: "img", tone: "white" },
];

function toneClass(t?: Skill["tone"]) {
  if (t === "primary") return "text-primary";
  if (t === "muted") return "text-muted-foreground";
  return "text-white";
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function dist2(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

function scatterCloudPoints({
  count,
  w,
  h,
  cx,
  cy,
  minR,
  maxR,
  minDist,
  centerExclusionR,
}: {
  count: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
  minR: number;
  maxR: number;
  minDist: number;
  centerExclusionR: number;
}) {
  const pts: { x: number; y: number }[] = [];
  const maxTries = 4500;

  for (let i = 0; i < count; i++) {
    let placed = false;

    for (let t = 0; t < maxTries; t++) {
      const a = Math.random() * Math.PI * 2;
      const biasX = 0.18;
      const biasY = -0.08;

      const u = Math.random();
      const r = minR + (maxR - minR) * (u * u);

      let x = cx + Math.cos(a) * r + biasX * maxR;
      let y = cy + Math.sin(a) * r + biasY * maxR;

      const pad = 24;
      x = clamp(x, pad, w - pad);
      y = clamp(y, pad, h - pad);

      const dCenter = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      if (dCenter < centerExclusionR) continue;

      let ok = true;
      for (const p of pts) {
        if (dist2({ x, y }, p) < minDist * minDist) {
          ok = false;
          break;
        }
      }

      if (ok) {
        pts.push({ x, y });
        placed = true;
        break;
      }
    }

    if (!placed) {
      pts.push({
        x: clamp(Math.random() * w, 24, w - 24),
        y: clamp(Math.random() * h, 24, h - 24),
      });
    }
  }

  return pts;
}

export default function SkillsHubCloud({
  height = 460,
  motion = "on",
  centerLabel = "SKILLS",
  pulseEvery = 5.8,
}: {
  height?: number;
  motion?: "auto" | "on" | "off";
  centerLabel?: string;
  pulseEvery?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const signalRefs = useRef<(SVGCircleElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);
  const pulseTimerRef = useRef<gsap.core.Tween | null>(null);

  const seeds = useMemo(() => {
    return SKILLS.map(() => ({
      vx: (Math.random() - 0.5) * 0.9,
      vy: (Math.random() - 0.5) * 0.9,
      drift: 1 + Math.random() * 1.3,
    }));
  }, []);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const center = centerRef.current;
    const tooltip = tooltipRef.current;
    if (!wrap || !center || !tooltip) return;

    const reduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    const prefersReduced = motion === "off" ? true : motion === "on" ? false : reduced;

    const ctx = gsap.context(() => {
      const setTooltip = (x: number, y: number, text: string, show: boolean) => {
        tooltip.textContent = text;

        gsap.to(tooltip, {
          autoAlpha: show ? 1 : 0,
          duration: show ? 0.12 : 0.15,
          ease: "power2.out",
        });

        gsap.set(tooltip, {
          x,
          y,
          xPercent: -50,
          yPercent: -110,
        });
      };

      const layout = () => {
        const r = wrap.getBoundingClientRect();
        const W = r.width;
        const H = r.height;

        const cx = W / 2;
        const cy = H / 2;

        gsap.set(center, { x: cx, y: cy, xPercent: -50, yPercent: -50 });

        const nodes = nodeRefs.current.filter(Boolean) as HTMLButtonElement[];
        const lines = lineRefs.current.filter(Boolean) as SVGLineElement[];
        const signals = signalRefs.current.filter(Boolean) as SVGCircleElement[];

        const maxR = Math.min(W, H) * 0.44;
        const minR = Math.min(W, H) * 0.18;
        const centerExclusionR = 92;
        const minDist = 100;

        const pts = scatterCloudPoints({
          count: nodes.length,
          w: W,
          h: H,
          cx,
          cy,
          minR,
          maxR,
          minDist,
          centerExclusionR,
        });

        nodes.forEach((node, i) => {
          const x = pts[i]?.x ?? cx;
          const y = pts[i]?.y ?? cy;

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

          const signal = signals[i];
          if (signal) {
            signal.setAttribute("cx", `${cx}`);
            signal.setAttribute("cy", `${cy}`);
            signal.style.opacity = "0";
          }

          node.dataset.idx = String(i);
        });

        if (prefersReduced) {
          gsap.set(nodes, { opacity: 1, scale: 1 });
          gsap.set(lines, { opacity: 0.55, strokeDashoffset: 0 });
          return;
        }

        gsap.set(nodes, { opacity: 0, scale: 0.92 });
        gsap.set(lines, { opacity: 0.55 });

        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
        tl.to(lines, { strokeDashoffset: 0, duration: 0.9, stagger: 0.05 });
        tl.to(nodes, { opacity: 1, scale: 1, duration: 0.35, stagger: 0.05 }, "-=0.65");

        gsap.to(center, { scale: 1.04, duration: 1.7, repeat: -1, yoyo: true, ease: "sine.inOut" });
      };

      layout();

      // resize relayout
      let raf: number | null = null;
      const ro = new ResizeObserver(() => {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(layout);
      });
      ro.observe(wrap);

      // floating tick + update line endpoints
      const tick = () => {
        const r = wrap.getBoundingClientRect();
        const W = r.width;
        const H = r.height;

        const cx = W / 2;
        const cy = H / 2;

        const nodes = nodeRefs.current.filter(Boolean) as HTMLButtonElement[];
        const lines = lineRefs.current.filter(Boolean) as SVGLineElement[];

        if (!prefersReduced) {
          const pad = 30;

          // ✅ time-based faster motion
          const dt = gsap.ticker.deltaRatio();
          const SPEED = 1.8;   // increase to 2.4 for faster
          const ACCEL = 0.055; // increase for more “alive”
          const DAMP = 0.965;  // lower = less friction (faster)

          const pts = nodes.map((node, i) => {
            const tr = gsap.getProperty(node, "x") as number;
            const ty = gsap.getProperty(node, "y") as number;

            let x = Number.isFinite(tr) ? tr : cx;
            let y = Number.isFinite(ty) ? ty : cy;

            const s = seeds[i];

            s.vx += (Math.random() - 0.5) * ACCEL * s.drift * dt;
            s.vy += (Math.random() - 0.5) * ACCEL * s.drift * dt;

            s.vx *= Math.pow(DAMP, dt);
            s.vy *= Math.pow(DAMP, dt);

            const MAX_V = 2.2 * s.drift;
            s.vx = clamp(s.vx, -MAX_V, MAX_V);
            s.vy = clamp(s.vy, -MAX_V, MAX_V);

            x += s.vx * SPEED * dt;
            y += s.vy * SPEED * dt;

            // bounce
            if (x < pad || x > W - pad) s.vx *= -0.9;
            if (y < pad || y > H - pad) s.vy *= -0.9;

            x = clamp(x, pad, W - pad);
            y = clamp(y, pad, H - pad);

            const rr = getNodeRadius(node);
            return { x, y, r: rr };
          });

          // keep away from center label
          const centerExclusionR = 92;
          for (const p of pts) {
            const dx = p.x - cx;
            const dy = p.y - cy;
            const d = Math.hypot(dx, dy) || 0.0001;
            const minCenter = centerExclusionR + p.r + 10;

            if (d < minCenter) {
              const nx = dx / d;
              const ny = dy / d;
              p.x = cx + nx * minCenter;
              p.y = cy + ny * minCenter;
            }
          }

          // collision: push nodes apart
          pushApart(pts, 10, 2);

          // clamp after collision
          for (const p of pts) {
            p.x = clamp(p.x, pad, W - pad);
            p.y = clamp(p.y, pad, H - pad);
          }

          // write back + update lines
          pts.forEach((p, i) => {
            gsap.set(nodes[i], { x: p.x, y: p.y });

            const line = lines[i];
            if (line) {
              line.setAttribute("x1", `${cx}`);
              line.setAttribute("y1", `${cy}`);
              line.setAttribute("x2", `${p.x}`);
              line.setAttribute("y2", `${p.y}`);
            }
          });
        }

        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);

      // signal animation helper (reads current line endpoints)
      const runSignal = (i: number) => {
        if (prefersReduced) return;

        const line = lineRefs.current[i];
        const signal = signalRefs.current[i];
        if (!line || !signal) return;

        const x1 = Number(line.getAttribute("x1"));
        const y1 = Number(line.getAttribute("y1"));
        const x2 = Number(line.getAttribute("x2"));
        const y2 = Number(line.getAttribute("y2"));

        gsap.killTweensOf(signal);
        gsap.set(signal, { opacity: 1 });

        gsap.fromTo(
          signal,
          { attr: { cx: x1, cy: y1 }, opacity: 0 },
          {
            attr: { cx: x2, cy: y2 },
            opacity: 1,
            duration: 0.55,
            ease: "power2.out",
            onComplete: () => {
              gsap.to(signal, { opacity: 0, duration: 0.25 });
            },
          }
        );
      };

      // AUTO PULSE (cycle through all skills)
      const startPulseLoop = () => {
        pulseTimerRef.current?.kill();

        const sweep = () => {
          for (let i = 0; i < SKILLS.length; i++) {
            gsap.delayedCall(i * 0.07, () => runSignal(i));
          }
        };

        sweep();

        pulseTimerRef.current = gsap.delayedCall(pulseEvery, function loop() {
          sweep();
          pulseTimerRef.current = gsap.delayedCall(pulseEvery, loop);
        });
      };

      startPulseLoop();

      // hover behavior + tooltip
      const onEnter = (e: Event) => {
        const btn = e.currentTarget as HTMLButtonElement;
        const i = Number(btn.dataset.idx);
        const line = lineRefs.current[i];

        gsap.to(btn, { scale: 1.12, duration: 0.18, ease: "power2.out" });
        if (line) gsap.to(line, { opacity: 1, duration: 0.2 });

        const x = gsap.getProperty(btn, "x") as number;
        const y = gsap.getProperty(btn, "y") as number;
        setTooltip(x, y, SKILLS[i]?.name ?? "", true);

        runSignal(i);
      };

      const onLeave = (e: Event) => {
        const btn = e.currentTarget as HTMLButtonElement;
        const i = Number(btn.dataset.idx);
        const line = lineRefs.current[i];

        gsap.to(btn, { scale: 1, duration: 0.18, ease: "power2.out" });
        if (line) gsap.to(line, { opacity: 0.55, duration: 0.25 });
        setTooltip(0, 0, "", false);
      };

      const nodes = nodeRefs.current.filter(Boolean) as HTMLButtonElement[];
      nodes.forEach((n) => {
        n.addEventListener("mouseenter", onEnter);
        n.addEventListener("mouseleave", onLeave);
      });

      return () => {
        ro.disconnect();
        pulseTimerRef.current?.kill();
        if (rafRef.current) cancelAnimationFrame(rafRef.current);

        nodes.forEach((n) => {
          n.removeEventListener("mouseenter", onEnter);
          n.removeEventListener("mouseleave", onLeave);
        });
      };
    }, wrap);

    return () => ctx.revert();
  }, [motion, seeds, pulseEvery]);

  return (
    <div
      ref={wrapRef}
      className="relative w-full overflow-hidden rounded-3xl border border-border
                 bg-gradient-to-br from-background via-background to-muted/30"
      style={{ height }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-35 [background:radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.14),transparent_45%),radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.10),transparent_55%)]" />

      {/* tooltip */}
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute left-0 top-0 z-20
                   rounded-full border border-border bg-background/70
                   px-3 py-1 text-[11px] text-foreground/90 backdrop-blur
                   opacity-0"
        aria-hidden="true"
      />

      {/* lines + signal dots */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        {SKILLS.map((_, i) => (
          <g key={i}>
            <line
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
            <circle
              ref={(el) => {
                signalRefs.current[i] = el;
              }}
              r="3.2"
              fill="currentColor"
              className="text-primary"
            />
          </g>
        ))}
      </svg>

      {/* center label */}
      <div
        ref={centerRef}
        className="absolute z-10 grid place-items-center rounded-full border border-border
                   bg-background/60 px-7 py-5 backdrop-blur"
      >
        <div className="text-xs font-semibold tracking-[0.28em] text-white/90">
          {centerLabel}
        </div>
      </div>

      {/* skill nodes */}
      {SKILLS.map((s, i) => {
        const size = s.size ?? 46;
        const tone = toneClass(s.tone);

        return (
          <button
            key={s.name + i}
            ref={(el) => {
              nodeRefs.current[i] = el;
            }}
            type="button"
            data-size={size}
            aria-label={s.name}
            className="absolute z-10 inline-flex items-center justify-center rounded-2xl
                       bg-white/5 p-2 backdrop-blur-sm transition
                       hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
            style={{ width: size + 18, height: size + 18 }}
          >
            {s.kind === "img" ? (
              <Image src={s.icon} alt={s.name} width={size} height={size} />
            ) : (
              <SvgIcon src={s.icon} size={size} className={tone} title={s.name} />
            )}
          </button>
        );
      })}
    </div>
  );
}

function getNodeRadius(node: HTMLElement) {
  const w = node.getBoundingClientRect?.().width ?? 64;
  return w * 0.5;
}

function pushApart(
  pts: { x: number; y: number; r: number }[],
  minGap: number,
  iterations = 2
) {
  for (let it = 0; it < iterations; it++) {
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i];
        const b = pts[j];

        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 0.0001;

        const target = a.r + b.r + minGap;
        if (dist >= target) continue;

        const overlap = target - dist;
        const nx = dx / dist;
        const ny = dy / dist;

        const push = overlap * 0.5;
        a.x -= nx * push;
        a.y -= ny * push;
        b.x += nx * push;
        b.y += ny * push;
      }
    }
  }
}
