// app/projects/Cadd/_components/PolaroidStack.tsx

"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import  styles from "./polaroid.module.css"

gsap.registerPlugin(ScrollTrigger);

type Card = {
  title: string;
  desc: string;
  img: string;
};

const CARDS: Card[] = [
  {
    title: "STAR WARS: GALAXY'S EDGE",
    desc: "BIM + visualization pipeline studies and delivery.",
    img: "/images/GalaxyofEdgeBIM.jpg",
  },
  {
    title: "VEHICLE DESIGN",
    desc: "Mobile vehicle design and visualization, showcasing exterior aesthetics and form. Tools: Inventor, Blender, Unreal Engine.",
    img: "/images/Cad.png",
  },
  {
    title: "VEHICLE INTERIOR DESIGN ",
    desc: "Design and visualization of vehicle interiors, showcasing exterior aesthetics and form. Tools: Inventor, Blender, Unreal Engine.",
    img: "/images/Cad_1.png",
  },
  {
    title: "VEHICLE INTERIOR DESIGN ",
    desc: "Design and visualization of vehicle interiors, showcasing exterior aesthetics and form. Tools: Inventor, Blender, Unreal Engine.",
    img: "/images/Cad_2.png",
  },
  {
    title: "VEHICLE INTERIOR DESIGN ",
    desc: "Design and visualization of vehicle interiors, showcasing exterior aesthetics and form. Tools: Inventor, Blender, Unreal Engine.",
    img: "/images/Cad_2.png",
  },
];

export default function PolaroidStack() {
  const root = useRef<HTMLDivElement | null>(null);

 useLayoutEffect(() => {
  if (!root.current) return;

  const ctx = gsap.context(() => {
    const cards = gsap.utils.toArray<HTMLElement>(".polaroid-card");

    gsap.set(cards, {
      y: () => window.innerHeight + 160,
      x: (i) => i * -8,
      rotation: (i) => (i % 3 === 0 ? -10 : i % 3 === 1 ? 7 : -5),
      zIndex: (i) => 100 + i,
      autoAlpha: 1,
      transformOrigin: "50% 90%",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root.current, // ✅ use ref, not ".polaroid-section"
        start: "top top",
        end: `+=${cards.length * 130}%`,
        pin: true,
        scrub: 1.4,
        invalidateOnRefresh: true,
      },
    });

    cards.forEach((card, i) => {
      const reveal = card.querySelector<HTMLElement>(".polaroid-reveal");
      if (!reveal) return;

      gsap.set(reveal, {
        clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)",
        WebkitClipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)",
      });

      tl.to(card, {
        y: i * 10,
        scale: 1 - i * 0.04,
        duration: 1,
        ease: "power2.out",
      });

      tl.to(
        card,
        { rotation: i % 2 === 0 ? -4 : 4, duration: 0.7, ease: "power1.out" },
        ">-0.15"
      );

      tl.to(
        reveal,
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          WebkitClipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1.1,
          ease: "power1.inOut",
        },
        "<"
      );
    });
  }, root);

  return () => ctx.revert();
}, []);


  return (
    <section
      ref={root}
      className="polaroid-section relative min-h-screen overflow-hidden px-4 py-16"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.15),transparent_40%),radial-gradient(circle_at_70%_30%,rgba(99,102,241,0.12),transparent_45%),linear-gradient(to_bottom,#070b18,#060814)]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-xl font-semibold tracking-tight text-white/90 ">
            ARCHITECTURAL VISUALIZATION
          </h1>
          {/* <p className="mt-2 max-w-2xl text-sm text-white/60 mx-auto text-center">
            Coming soon. Architectural visualization images in real-time.
          </p> */}

          <h2 className="scroll  mt-2 max-w-2xl text-sm text-white/60 mx-auto text-center">
            SCROLL DOWN FOR THE GALLERY
          </h2>
        </div>

        <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur ">
          {/* Architectural sketch watermark */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Image
            src="/images/ArchCADD.svg"
            alt=""
            width={1400}
            height={1000}
            className="
            opacity-[0.07]
            mix-blend-soft-light
            select-none
             w-[80%] h-auto
             object-contain"
            />
            </div>

          
          <div className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap text-center text-6xl font-black tracking-[0.22em] text-white/5">
            CADD and BIM GALLERY
          </div>

          <div className="relative mx-auto h-[560px] w-[360px] md:h-[620px] md:w-[460px]">
            {CARDS.map((c, idx) => (
       <article
            key={idx}
            className={`${styles.willChangeTransform} 
            polaroid-card 
            absolute 
            inset-0 
            rounded-2xl 
            border 
            border-white/10 
            bg-white 
            text-slate-900 
            shadow-[0_30px_90px_rgba(0,0,0,0.55)]
            `}>

                <div className="p-4">
                  {/* ✅ This is the element we clip/reveal */}
                  <div className="polaroid-reveal overflow-hidden rounded-xl bg-slate-200">
                    <div className="relative h-[330px] w-full md:h-[390px]">
                      <Image
                        src={c.img}
                        alt={c.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 360px, 460px"
                        priority={idx === 0}
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-sm font-bold tracking-[0.24em] text-slate-900">
                      {c.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-black">
                      {c.desc}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 text-xs text-white/50">
           
          </div>
        </div>
      </div>
    </section>
  );
}
