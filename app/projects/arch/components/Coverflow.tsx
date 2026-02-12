// app/projects/arch/components/Coverflow.tsx

"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import Flip from "gsap/Flip";
import "./coverflow.css";

gsap.registerPlugin(Flip);

type Item = { title: string; img: string };

const ITEMS: Item[] = [
  { title: "ArchViz Study 01", img: "/images/Cad_Environment.png" },
  { title: "ArchViz Study 02", img: "/images/disneyCru.jpg" },
  { title: "Interior Lighting", img: "/images/interioDesign.jpg" },
  { title: "Exterior Section Night", img: "/images/SpeedDesign_Environment1.jpg" },
  { title: "Speed Design Concept", img: "/images/SpeedDesign_Environment2.jpg" },
  { title: "Speed Design Concept", img: "/images/SpeedDesign_Environment.jpg" },
  { title: "Game Enviroment Design", img: "/images/enviromentDesign.png" },
  { title: "Game Enviroment Design", img: "/images/enviromentDesign2.png" },
  
];

export default function Coverflow() {
  const root = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const itemRefs = useRef<HTMLLIElement[]>([]);
  const [active, setActive] = useState(7);

  // lightbox state
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const count = ITEMS.length;
  const centerScale = 1.15;

  const setItemRef = (el: HTMLLIElement | null, i: number) => {
    if (!el) return;
    itemRefs.current[i] = el;
  };

  const clamp = (n: number) => Math.max(0, Math.min(count - 1, n));

  const layout = (idx: number) => {
    const els = itemRefs.current;
    const spacing = 110;
    const rot = 55;
    const depth = -120;

    gsap.to(els, {
      duration: 0.55,
      ease: "power3.out",
      overwrite: "auto",
      transformPerspective: 1000,
      x: (i) => (i - idx) * spacing,
      z: (i) => (i === idx ? 0 : depth),
      rotationY: (i) => {
        const d = i - idx;
        if (d === 0) return 0;
        return d > 0 ? -rot : rot;
      },
      scale: (i) => (i === idx ? centerScale : 0.92),
      opacity: (i) => (Math.abs(i - idx) > 4 ? 0 : i === idx ? 1 : 0.55),
      filter: (i) => (i === idx ? "brightness(1)" : "brightness(0.85)"),
      zIndex: (i) => 1000 - Math.abs(i - idx),
    });

    gsap.to(els, {
      duration: 0.35,
      ease: "power2.out",
      "--capOpacity": (i: number) => (i === idx ? 1 : 0.35),
    } as gsap.TweenVars);
  };

  const pop = (idx: number) => {
    const el = itemRefs.current[idx];
    if (!el) return;

    layout(idx);
    gsap.killTweensOf(el);

    gsap.fromTo(
      el,
      { y: 0, scale: centerScale },
      {
        duration: 0.22,
        ease: "power2.out",
        y: -18,
        scale: 1.28,
        onComplete: () => {
          gsap.to(el, { duration: 0.28, ease: "power3.out", y: 0, scale: centerScale });
        },
      }
    );
  };

  // FLIP: move the clicked card into overlay and animate
  const openLightbox = (idx: number) => {
    const el = itemRefs.current[idx];
    const overlay = overlayRef.current;
    if (!el || !overlay) return;

    // Snapshot BEFORE moving element in the DOM
    const state = Flip.getState(el);

    setOpenIdx(idx);

    // Move the selected li into overlay as the "hero"
    overlay.appendChild(el);

    // Animate from old position to new
    Flip.from(state, {
      duration: 0.55,
      ease: "power3.inOut",
      absolute: true,
      scale: true,
      onStart: () => {
        gsap.set(overlay, { autoAlpha: 1 });
        gsap.to(overlay, { duration: 0.2, backgroundColor: "rgba(0,0,0,0.72)" });
      },
    });
  };

  const closeLightbox = () => {
    if (openIdx === null) return;

    const el = itemRefs.current[openIdx];
    const stage = stageRef.current;
    const overlay = overlayRef.current;
    if (!el || !stage || !overlay) {
      setOpenIdx(null);
      return;
    }

    // snapshot where it is (in overlay)
    const state = Flip.getState(el);

    // put it back into the list container
    listRef.current?.appendChild(el);

    // animate back
    Flip.from(state, {
      duration: 0.5,
      ease: "power3.inOut",
      absolute: true,
      scale: true,
      onComplete: () => {
        gsap.to(overlay, { duration: 0.18, autoAlpha: 0 });
        setOpenIdx(null);
        // re-apply coverflow layout so it snaps perfectly
        layout(active);
      },
    });
  };

  useLayoutEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      gsap.set(listRef.current, { transformStyle: "preserve-3d" });
      gsap.set(itemRefs.current, { transformStyle: "preserve-3d" });
      layout(active);
      gsap.set(overlayRef.current, { autoAlpha: 0 });
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    // don’t layout while open (because active element is in overlay)
    if (openIdx !== null) return;
    layout(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, openIdx]);

  // keyboard: arrows + ESC
  useLayoutEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && openIdx !== null) {
        closeLightbox();
        return;
      }
      if (openIdx !== null) return;

      if (e.key === "ArrowLeft") {
        setActive((a) => {
          const next = clamp(a - 1);
          pop(next);
          return next;
        });
      }
      if (e.key === "ArrowRight") {
        setActive((a) => {
          const next = clamp(a + 1);
          pop(next);
          return next;
        });
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, openIdx]);

  const onSelect = (i: number) => {
    if (openIdx !== null) return;

    if (i === active) {
      openLightbox(i); // blow up from clicked item
      return;
    }

    setActive(i);
    pop(i);
  };

  return (
    <div ref={root} className="cf-root">
      {/* overlay (lightbox) */}
      <div
        ref={overlayRef}
        className={`cf-overlay ${openIdx !== null ? "is-open" : ""}`}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) closeLightbox();
        }}
        aria-hidden={openIdx === null}
      >
        <button className="cf-overlayClose" onClick={closeLightbox} type="button" aria-label="Close">
          ✕
        </button>
        {/* content is inserted here via FLIP */}
        <div className="cf-overlaySlot" />
      </div>

      <div ref={stageRef} className="cf-stage">
        <ul ref={listRef} className="cf-list" aria-label="coverflow">
          {ITEMS.map((it, i) => (
            <li
              key={`${it.title}-${i}`}

              ref={(el) => setItemRef(el, i)}
              className={`cf-item ${openIdx === i ? "cf-item--hero" : ""}`}
              onClick={() => onSelect(i)}
              role="button"
              tabIndex={0}
              aria-label={`Select ${it.title}`}
            >
              <div className="cf-card">
                <div className="cf-imgWrap">
                  <Image
                    src={it.img}
                    alt={it.title}
                    fill
                  quality={100}
                  sizes={
                  openIdx === i
                  ? "(max-width: 768px) 92vw, 1100px" // fullscreen hero
                  : "180px" // thumbnails
        }
  className="cf-img"
  priority={i === active || openIdx === i}
/>
                </div>

                <div className="cf-caption">{it.title}</div>

                <div className="cf-reflection" aria-hidden="true">
                  <div className="cf-imgWrap cf-imgWrap--reflect">
                    <Image
                      src={it.img}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 160px, 180px"
                      className="cf-img cf-img--reflect"
                    />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="cf-controls">
        {ITEMS.map((_, i) => (
          <button
            key={i}
            className={`cf-btn ${i === active ? "is-active" : ""}`}
            onClick={() => {
              if (openIdx !== null) return;
              setActive(i);
              pop(i);
            }}
            type="button"
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
